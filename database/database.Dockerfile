FROM postgres:18.1
COPY *.sql /docker-entrypoint-initdb.d/