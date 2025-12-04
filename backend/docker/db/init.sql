-- We load the csv file as raw data so that we can process/ format it for the db
CREATE TABLE stocks_raw (
    symbol TEXT,
    exchange TEXT,
    company_name TEXT,
    isin TEXT,
    face_value TEXT,
    status TEXT,
    "group" TEXT,
    instrument TEXT,
    listing_date TEXT,
    market_lot TEXT,
    paid_up_value TEXT,
    security_code TEXT
);
COPY stocks_raw
FROM '/docker-entrypoint-initdb.d/india_stocks_master.csv'
CSV HEADER;


CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50),
    exchange VARCHAR(10),
    company_name TEXT,
    isin VARCHAR(20),
    face_value NUMERIC,
    "status" VARCHAR(20),
    "group" VARCHAR(20),
    instrument VARCHAR(50),
    listing_date DATE,
    market_lot NUMERIC,
    paid_up_value NUMERIC,
    security_code NUMERIC
);

INSERT INTO stocks (
    symbol,
    exchange,
    company_name,
    isin,
    face_value,
    "status",
    "group",
    instrument,
    listing_date,
    market_lot,
    paid_up_value,
    security_code
)
SELECT
    NULLIF(symbol, '-') AS symbol,
    NULLIF(exchange, '-') AS exchange,
    NULLIF(company_name, '-') AS company_name,
    NULLIF(isin, '-') AS isin,
    NULLIF(face_value, '-')::NUMERIC AS face_value,
    NULLIF("status", '-') AS "status",
    NULLIF("group", '-') AS "group",
    NULLIF(instrument, '-') AS instrument,


    CASE 
        WHEN listing_date IS NULL OR listing_date = '-' THEN NULL
        ELSE listing_date::DATE
    END AS listing_date,

    NULLIF(market_lot, '-')::NUMERIC AS market_lot,
    NULLIF(paid_up_value, '-')::NUMERIC AS paid_up_value,
    NULLIF(security_code, '-')::NUMERIC AS security_code
FROM stocks_raw;

-- STEP 5: Indexes
CREATE INDEX idx_stocks_symbol ON stocks(symbol);
CREATE INDEX idx_stocks_exchange ON stocks(exchange);
CREATE INDEX idx_stocks_isin ON stocks(isin);
CREATE INDEX idx_stocks_security_code ON stocks(security_code);
