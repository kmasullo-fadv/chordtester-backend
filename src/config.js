module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://chordmaster@localhost/chordtester',
    TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://chordmaster@localhost/chordtester_test',
    JWT_SECRET: process.env.JWT_SECRET || '12345678'
  }