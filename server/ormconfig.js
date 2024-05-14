
const devConfig = {
  "type": "postgres",
  "host": process.env.POSTGRES_HOSTNAME,
  "port": process.env.POSTGRES_PORT,
  "username": process.env.POSTGRES_USER,
  "password": process.env.POSTGRES_PASSWORD,
  "database": process.env.POSTGRES_DB,
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

const prodConfig = {
  "type": "postgres",
  "host": process.env.POSTGRES_HOSTNAME,
  "port": process.env.POSTGRES_PORT,
  "username": process.env.POSTGRES_USER,
  "password": process.env.POSTGRES_PASSWORD,
  "database": process.env.POSTGRES_DB,
  "synchronize": false,
  "logging": false,
  "entities": [
    "dist/lib/entity/**/*.js"
  ],
  "migrations": [
    "dist/migration/**/*.js"
  ],
  "cli": {
    "entitiesDir": "src/lib/entity/**/*.js",
    "migrationsDir": "src/migration"
  }
}

// switch orm config based on ENVIRONMENT env var (as set in docker-compose)
module.exports = process.env.ENVIRONMENT == 'development' ?
  devConfig :
  prodConfig
