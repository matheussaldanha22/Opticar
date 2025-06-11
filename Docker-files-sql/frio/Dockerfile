FROM mysql:8.0

COPY ./OpticarQuente.sql  /docker-entrypoint-initdb.d/

ENV MYSQL_ROOT_PASSWORD=opticar123
ENV MYSQL_DATABASE=opticarQuente
ENV MYSQL_USER=admin
ENV MYSQL_PASSWORD=admin123

EXPOSE 3307