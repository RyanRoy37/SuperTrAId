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
