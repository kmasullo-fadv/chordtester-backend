require('dotenv').config();

module.exports = {
    "MigrationsDirectory": "migrations",
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DB_URL
    : process.env.DATABASE_URL,
}