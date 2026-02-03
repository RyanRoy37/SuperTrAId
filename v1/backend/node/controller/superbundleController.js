const db = require("../db");

exports.createSuperbundle = async (req, res) => {
  const { bundle_name, stocks } = req.body;
  const userId = req.user_id; 

  if (!bundle_name || !stocks || stocks.length === 0) {
    return res.status(400).json({
      error: "bundle_name and at least one stock are required"
    });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Create superbundle
    const bundleResult = await client.query(
      `
      INSERT INTO superbundles (name, created_by)
      VALUES ($1, $2)
      RETURNING id
      `,
      [bundle_name, userId]
    );

    const bundleId = bundleResult.rows[0].id;

    // 2️⃣ Insert bundle stocks
    const insertStockQuery = `
      INSERT INTO superbundle_stocks (bundle_id, stock_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;

    for (const stock of stocks) {
      await client.query(insertStockQuery, [
        bundleId,
        stock.stock_id
      ]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Superbundle created successfully",
      bundle_id: bundleId
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      error: "Failed to create superbundle"
    });
  } finally {
    client.release();
  }
};


exports.updateSuperbundle = async (req, res) => {
  const bundleId = req.params.id;
  const userId = req.user.user_id;
  const { bundle_name, stocks } = req.body;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Check ownership
    const ownerCheck = await client.query(
      `SELECT id FROM superbundles WHERE id=$1 AND created_by=$2`,
      [bundleId, userId]
    );

    if (ownerCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Not authorized" });
    }

    // 2️⃣ Update name
    if (bundle_name) {
      await client.query(
        `UPDATE superbundles SET name=$1 WHERE id=$2`,
        [bundle_name, bundleId]
      );
    }

    // 3️⃣ Replace stocks
    if (stocks && stocks.length > 0) {
      await client.query(
        `DELETE FROM superbundle_stocks WHERE bundle_id=$1`,
        [bundleId]
      );

      for (const stock of stocks) {
        await client.query(
          `INSERT INTO superbundle_stocks (bundle_id, stock_id)
           VALUES ($1, $2)`,
          [bundleId, stock.stock_id]
        );
      }
    }

    await client.query("COMMIT");

    res.json({ message: "Superbundle updated successfully" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Update failed" });
  } finally {
    client.release();
  }
};


exports.deleteSuperbundle = async (req, res) => {
  const bundleId = req.params.id;
  const userId = req.user.user_id;

  const result = await db.query(
    `DELETE FROM superbundles
     WHERE id=$1 AND created_by=$2`,
    [bundleId, userId]
  );

  if (result.rowCount === 0) {
    return res.status(403).json({ error: "Not authorized or not found" });
  }

  res.json({ message: "Superbundle deleted successfully" });
};


exports.buySuperbundle = async (req, res) => {
  const bundleId = req.params.id;
  const userId = req.user.user_id;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Fetch bundle stocks
    const stocksResult = await client.query(
      `SELECT s.id, s.symbol, s.current_price
       FROM superbundle_stocks bs
       JOIN stocks s ON s.id = bs.stock_id
       WHERE bs.bundle_id = $1`,
      [bundleId]
    );

    if (stocksResult.rowCount === 0) {
      throw new Error("Bundle empty or not found");
    }

    // 2️⃣ Calculate total cost (1 qty per stock for now)
    let totalCost = 0;
    for (const stock of stocksResult.rows) {
      totalCost += Number(stock.current_price);
    }

    // 3️⃣ Check balance
    const userResult = await client.query(
      `SELECT balance FROM users WHERE id=$1`,
      [userId]
    );

    if (userResult.rows[0].balance < totalCost) {
      throw new Error("Insufficient balance");
    }

    // 4️⃣ Deduct balance
    await client.query(
      `UPDATE users SET balance = balance - $1 WHERE id=$2`,
      [totalCost, userId]
    );

    // 5️⃣ Process each stock
    for (const stock of stocksResult.rows) {

      // holdings upsert
      await client.query(
        `
        INSERT INTO holdings (user_id, stock_symbol, quantity, avg_price)
        VALUES ($1, $2, 1, $3)
        ON CONFLICT (user_id, stock_symbol)
        DO UPDATE SET
          quantity = holdings.quantity + 1,
          avg_price =
            ((holdings.avg_price * holdings.quantity) + $3)
            / (holdings.quantity + 1)
        `,
        [userId, stock.symbol, stock.current_price]
      );

      // transaction log
      await client.query(
        `
        INSERT INTO activity_log
          (user_id, type, stock_symbol, quantity, price)
        VALUES ($1, 'buy', $2, 1, $3)
        `,
        [userId, stock.symbol, stock.current_price]
      );
    }

    // 6️⃣ Bundle purchase log
    await client.query(
      `
      INSERT INTO activity_log (user_id, type, bundle_id, message)
      VALUES ($1, 'bundle_buy', $2, 'Superbundle purchased')
      `,
      [userId, bundleId]
    );

    await client.query("COMMIT");

    res.json({
      message: "Superbundle purchased successfully",
      total_cost: totalCost
    });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};


exports.getSuperbundles = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        b.id AS bundle_id,
        b.name AS bundle_name,
        b.created_at,
        u.id AS creator_id,
        u.name AS creator_name,
        json_agg(
          json_build_object(
            'stock_id', s.id,
            'symbol', s.symbol,
            'price', s.current_price
          )
        ) AS stocks
      FROM superbundles b
      JOIN users u ON u.id = b.created_by
      LEFT JOIN superbundle_stocks bs ON bs.bundle_id = b.id
      LEFT JOIN stocks s ON s.id = bs.stock_id
      GROUP BY b.id, u.id
      ORDER BY b.created_at DESC
      `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch superbundles" });
  }
};


exports.getSuperbundleById = async (req, res) => {
  const bundleId = req.params.id;

  try {
    const result = await db.query(
      `
      SELECT
        b.id AS bundle_id,
        b.name AS bundle_name,
        b.created_at,
        u.id AS creator_id,
        u.name AS creator_name,
        json_agg(
          json_build_object(
            'stock_id', s.id,
            'symbol', s.symbol,
            'price', s.current_price
          )
        ) AS stocks
      FROM superbundles b
      JOIN users u ON u.id = b.created_by
      LEFT JOIN superbundle_stocks bs ON bs.bundle_id = b.id
      LEFT JOIN stocks s ON s.id = bs.stock_id
      WHERE b.id = $1
      GROUP BY b.id, u.id
      `,
      [bundleId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Superbundle not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch superbundle" });
  }
};
