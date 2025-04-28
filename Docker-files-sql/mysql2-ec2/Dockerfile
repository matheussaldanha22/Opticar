FROM mysql:8.0

COPY ./script-tabelasFrio.sql /docker-entrypoint-initdb.d/

ENV MYSQL_ROOT_PASSWORD=opticar123
ENV MYSQL_DATABASE=opticarFrio
ENV MYSQL_USER=admin
ENV MYSQL_PASSWORD=admin123

EXPOSE 3307
