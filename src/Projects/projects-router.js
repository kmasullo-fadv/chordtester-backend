const express = require('express');
const projectsRouter = require('express').Router();
const path = require('path');
const xss = require('xss');
const jsonParser = express.json();
const projectsService = require('./projects-service');
const {requireAuth} = require('../middleware/jwt-auth');

projectsRouter
    .route('/projects')
    .get(requireAuth, (req, res, next) => {
        projectsService.getAllProjects(
            req.app.get('db'),
            req.user.username
        )
        .then(projects => {
            res.json(projects)
        })
        .catch(next);
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        console.log(req.body);
        const { title, chords } = req.body;
        const details = { title, chords }
        projectsService.addProject(
            req.app.get('db'),
            req.user.username,
            details
        )
        .then(project => {
            res.json(project)
        })
        .catch(next);
    })


module.exports = projectsRouter;