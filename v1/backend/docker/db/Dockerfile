FROM postgres:16-alpine
#Enter the user, password and db name while running the container.
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY india_stocks_master.csv /docker-entrypoint-initdb.d/india_stocks_master.csv
