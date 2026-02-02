require('dotenv').config();
const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');


app.use(express.json());

app.use('/auth', authRoutes);

app.use(authMiddleware);


//app.use('/portfolio', require('./routes/portfolioRoutes'));
//app.use('/stocks', require('./routes/stocksRoutes'));
//app.use('/superbundles', require('./routes/superbundleRoutes'));
const profileRoutes = require('./routes/profileRoutes');
app.use(profileRoutes);

const portfolioRoutes = require('./routes/portfolioRoutes');
app.use('/portfolio', portfolioRoutes);

const superbundleRoutes = require('./routes/superbundleRoutes');
app.use(superbundleRoutes);

const stocksRoutes = require("./routes/stocksRoutes");
app.use("/stocks", stocksRoutes);

const historyRoutes = require("./routes/historyRoutes");
app.use("/", historyRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});





/*require("dotenv").config({path: "C:/Users/jryan/Documents/Env/postgres.env.txt" });
const express = require("express");
const { Pool } = require("pg");
const app = express();

app.use(express.json());

// PostgreSQL connection pool (uses env vars)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// List of stocks
app.get("/stocks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, symbol, company_name FROM stocks ORDER BY id ;"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Daily historical candles
app.get("/stocks/:id/history/daily", async (req, res) => {
  const stockId = req.params.id;

  let { limit, offset, start_date, end_date, sort } = req.query;

  limit = parseInt(limit) || 200;  
  offset = parseInt(offset) || 0;
  sort = ["asc", "desc"].includes(sort) ? sort : "desc";

  try {
    let query = `
      SELECT date, open, high, low, close, volume
      FROM historical_prices
      WHERE stock_id = $1
    `;

    const params = [stockId];
    let idx = 2;//parameter numbering  $2, $3, $4...

    if (start_date) {
      query += ` AND date >= $${idx++}`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND date <= $${idx++}`;
      params.push(end_date);
    }

    query += ` ORDER BY date DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const orderedData = result.rows.slice().reverse();
    res.json({
      stock_id: stockId,
      count: orderedData.length,
      limit,
      offset,
      data: orderedData
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


app.get("/stocks/:id/history/intraday", async (req, res) => {});

// Monthly candles 
app.get("/stocks/:id/history/monthly", async (req, res) => {});

// Yearly candles 
app.get("/stocks/:id/history/yearly", async (req, res) => {});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/
