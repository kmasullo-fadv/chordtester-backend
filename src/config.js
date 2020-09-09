module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://chordmaster@localhost/chordtester',
    JWT_SECRET: process.env.JWT_SECRET || '12345678'
  }