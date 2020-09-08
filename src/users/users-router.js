const express = require('express');
const usersRouter = express.Router();
const jsonBodyParser = express.json();
const path = require('path');
const UsersService = require('./users-service');

usersRouter
.post('/', jsonBodyParser, (req, res, next) => {
    const { username, name, password } = req.body;
    for(const field of ['username', 'name', 'password']) {
        if(!req.body[field]){
            return res.status(400).jason({
                error: `Missing ${field} in request body`
            })
        }
    }
    const passwordError = UsersService.validatePassword(password)
    if(passwordError){
        return res.status(400).json({error: passwordError})
    }
    UsersService.hasUserWithUsername(
        req.app.get('db'),
        username
    )
    .then(hasUserWithUsername => {
        if(hasUserWithUsername){
            return res.status(400).json({error: 'Username taken'})
        }
        return UsersService.hashPassword(password)
        .then(hashedPassword => {
            const newUser = { username, name, password: hashedPassword }
            return UsersService.insertUser(
                req.app.get('db'),
                newUser
            )
            .then(user => {
                res.status(201).json(UsersService.serializeUser(user))
            })
        })
    })
    .catch(next)
})

module.exports = usersRouter;