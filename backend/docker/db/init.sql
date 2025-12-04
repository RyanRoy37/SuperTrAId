CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50) not null,
    exchange VARCHAR(10) not null,
    company_name TEXT not null,
    isin VARCHAR(20) not null,
    face_value NUMERIC,
    "status" VARCHAR(20),
    "group" VARCHAR(20),
    instrument VARCHAR(50),
    listing_date DATE,
    market_lot INTEGER,
    paid_up_value NUMERIC,
    security_code INTEGER
);

COPY stocks (
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
FROM '/docker-entrypoint-initdb.d/india_stocks_master.csv'
CSV HEADER;

CREATE INDEX idx_stocks_symbol ON stocks(symbol);
CREATE INDEX idx_stocks_exchange ON stocks(exchange);
CREATE INDEX idx_stocks_isin ON stocks(isin);
CREATE INDEX idx_stocks_security_code ON stocks(security_code);
