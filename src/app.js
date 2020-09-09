const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const projectsRouter = require('./Projects/projects-router')
const usersRouter = require('./users/users-router');
const PORT = process.env.PORT || 8000

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))

app.use(helmet())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api', projectsRouter)
app.use('/api/users', usersRouter)

app.use((error, req, res, next) => {
   let response
   if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
   } else {
    console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
 })

module.exports = app