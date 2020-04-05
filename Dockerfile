FROM microsoft/mssql-server-linux

EXPOSE 1433

COPY ./ /simulator
WORKDIR /simulator
ENV SA_PASSWORD "UHT-password"
ENV ACCEPT_EULA "Y"

RUN /opt/mssql/bin/sqlservr & sleep 20 \
  && /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d master \
  -Q "create database uhtlive; create database uhwlive; create database HBCTLIVEDB; create database cmData" \
  && /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d master \
  -e -i ./api/test/sql/test_schema.sql

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=10 \
  CMD /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -Q "SELECT 1" || exit 1

CMD /opt/mssql/bin/sqlservr
