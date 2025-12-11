API Documentation
(For dev, as well to be fed into a gpt)

For Daily Historical Candles:
Endpoint - GET /stocks/:id/history/daily

Purpose
    Returns daily OHLCV candle data for a specific stock.
    Supports:
        Pagination
        Sorting
        Date-range filtering
        Efficient queries

Used by UI charts such as candlestick charts, line charts

URL Parameters
| Name | Type    | Required | Description                        |
| ---- | ------- | -------- | ---------------------------------- |
| `id` | integer | Yes      | The stock ID (from `/stocks` API). |


Example : /stocks/12/history/daily

Query Paramter (optional, but recommended for use as there is large data involved) 
Pagination
    | Parameter | Type   | Default | Description                             |
| --------- | ------ | ------- | --------------------------------------- |
| `limit`   | number | `200`   | Number of candles to return.            |
| `offset`  | number | `0`     | How many rows to skip (for pagination). |

Example : ?limit=100&offset=100

Data Range Filtering:
| Parameter    | Type         | Description                             |
| ------------ | ------------ | --------------------------------------- |
| `start_date` | `YYYY-MM-DD` | Only return candles on/after this date  |
| `end_date`   | `YYYY-MM-DD` | Only return candles on/before this date |

Example : ?start_date=2020-01-01&end_date=2021-01-01

Sorting
| Parameter | Allowed values | Default |
| --------- | -------------- | ------- |
| `sort`    | `asc` / `desc` | `desc`  |

Example : ?sort=asc

Example Requests:

        GET /stocks/12/history/daily
        GET /stocks/12/history/daily?limit=50&sort=asc
        GET /stocks/12/history/daily?start_date=2020-01-01&end_date=2020-12-31
        GET /stocks/12/history/daily?limit=200&offset=200

Example JSON response :
{
  "stock_id": "12",
  "count": 200,
  "limit": 200,
  "offset": 0,
  "data": [
    {
      "date": "2023-09-18",
      "open": 2540.45,
      "high": 2600.10,
      "low": 2530.20,
      "close": 2580.75,
      "volume": 1829300
    },
    {
      "date": "2023-09-15",
      "open": 2505.25,
      "high": 2550.90,
      "low": 2490.00,
      "close": 2535.40,
      "volume": 2103400
    }
  ]
}


Response Fields Explained:

| Field      | Description                     |
| ---------- | ------------------------------- |
| `stock_id` | Which stock the data belongs to |
| `count`    | Number of rows returned         |
| `limit`    | Limit used for this request     |
| `offset`   | Offset used for this request    |
| `data`     | Array of OHLCV candles          |


(For the frontend dev team):

1. Initial chart load (call without paramters)
GET /stocks/:id/history/daily
Loads the latest 200 candles (default has been set to last 200 days)

2. As the user scrolls leftward of the graph
/stocks/:id/history/daily?limit=200&offset=200

3. if the user selects a custom date range
/stocks/:id/history/daily?start_date=2023-01-01&end_date=2023-12-31




Frontend Data Flow & Requirements Documentation

This document explains how the frontend should fetch, store, and manage stock list data and historical candle data for chart rendering in the dashboard.

1. Initial Stock List Fetching
Purpose
    To load the entire list of tradable stocks (≈ 2,700 records), which is required for the search bar, stock selection panel, and watchlist components.

Behavior
    As soon as the UI loads (e.g., application initialization), the frontend must send a request to:
    GET /stocks
    This request should be performed asynchronously in the background, without waiting for the user to navigate to the stocks page.
    The UI should not be blocked by this request.

Caching Requirement
    The complete stock list must be cached locally on the client side.

    Recommended storage options:
    In-memory state store (e.g., Redux, Context, Zustand), and/or
    localStorage or IndexedDB for persistence between refreshes.

On subsequent loads, the frontend must:
    Check if cached stock data exists.
    Use cached data immediately for rendering.
    Only refresh from API if cache is missing or outdated.

2. Selecting a Stock & Fetching Candle Data
User Action:
    When the user selects a stock from the list, the frontend must:
    Store the selected stock’s ID internally.
    Make a request to load the initial candle data:
        GET /stocks/:id/history/daily

Response
    The API returns the 200 most recent daily candles, sorted in ascending order (oldest → newest).
    This dataset is ready to be fed directly into the chart component (e.g., TradingView, ApexCharts).

3. Loading Additional Historical Candles (Infinite Scroll / Chart Panning)
When Required
    If the user pans/scrolls the chart to earlier dates, the frontend must request older candles using pagination.

Request
    GET /stocks/:id/history/daily?offset=<current_offset>&limit=200


Example:
    offset=200 → fetch candles 201–400
    offset=400 → fetch candles 401–600

Frontend Responsibilities

    Maintain the current offset for each stock.
    Append newly fetched candles to the existing candle list.
    Ensure no duplicates are added.
    Update the chart smoothly with the extended dataset.

4. Data Retention Policy (Per-Stock Candle Data)
When a user switches away from a stock:
    The frontend should decide between two strategies:
    Option A — Discard candle data when user leaves the chart
        Saves memory.
        Best for low-memory devices (mobile/tablet).
        Recommended if the average user views many different stocks.

    Option B — Retain candle data in memory
        Reduces API requests when switching back to the same stock.
        Recommended for desktop dashboards or power users.
        If retained, candle history must be indexed by stock_id in a frontend store.

Example structure:

    {
    5: { candles: [...], offset: 400 },
    12: { candles: [...], offset: 200 }
    }


Your team can choose the appropriate strategy depending on UX needs.

5. Summary of Required Frontend Responsibilities
On Application Load

- Trigger /stocks fetch in background
- Cache result (memory + persistent storage)
- Render UI using cached data immediately when available

On Stock Click

- Store selected stock ID
- Fetch latest 200 daily candles
- Render chart with ascending candle order

On Chart Backward Scroll (Left Pan)

- Increase pagination offset
- Request next set of 200 candles
- Append to existing candle list
- Re-render chart

On Leaving Stock Chart

- Either discard candle data OR keep it cached per stock
(Decision left to UX requirements)

6. API Endpoints Summary for Frontend
    Get all stocks (cached on load)
    GET /stocks

    Get latest daily candles
    GET /stocks/:id/history/daily

    Get older daily candles
    GET /stocks/:id/history/daily?offset=200&limit=200
