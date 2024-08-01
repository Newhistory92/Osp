// lib/mssql.ts
import sql from 'mssql';

const config = {
  user: 'prueba23',
  password: 'Q1Tp2aXiMjN1*23',
  server: '10.25.1.103',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool: any) => {
    console.log('Connected to MSSQL - ObraSocial');
    return pool;
  })
  .catch((err: any) => console.log('Database Connection Failed! Bad Config: ', err));


export { poolPromise, sql };