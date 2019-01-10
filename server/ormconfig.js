module.exports = {
  "type": "postgres",
  "host": process.env.POSTGRES_HOSTNAME,
  "port": process.env.POSTGRES_PORT,
  "username": process.env.POSTGRES_USER,
  "password": process.env.POSTGRES_PASSWORD,
  "database": process.env.POSTGRES_DATABASE,
  "synchronize": false,
  "logging": false,
  "entities": [
    "src/lib/entity/**/*.js"
  ],
  "migrations": [
    "src/migration/**/*.js"
  ],
  "cli": {
    "entitiesDir": "src/lib/entity/**/*.js",
    "migrationsDir": "src/migration"
  }
}
