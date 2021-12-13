/*
Code copied from Node-Postgres library documentation:
https://node-postgres.com/guides/project-structure
 */

const createDbConnection = credential => {
  return require('knex')({
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: process.env.MYSQL_PORT || 3306,
      database: 'music_metadata',
      ...credential
    }
  });
};

module.exports = createDbConnection;
