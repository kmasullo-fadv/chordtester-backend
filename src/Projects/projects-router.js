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
        const { title } = req.body;
        projectsService.addProject(
            req.app.get('db'),
            req.user.username,
            title
        )
        .then(project => {
            res.json(project)
        })
        .catch(next);
    });

projectsRouter
    .route('/projects/:id')
    .get(requireAuth, (req, res, next) => {
        projectsService.getProjectById(
            req.app.get('db'),
            req.user.username,
            req.params.id
        )
        .then(chords => {
            res.json(chords.map(chord => ({
                ...chord,
                notes: JSON.parse(chord.notes)
            })))
        })
        .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { project_id, notes, name } = req.body;
        const notesJson = JSON.stringify(notes)
        const details = { project_id, notes: notesJson, name };
        projectsService.addChordtoProject(
            req.app.get('db'),
            req.user.username,
            details
        )
        .then(project => {
            res.json(project)
        })
        .catch(next)
    })
    .delete(requireAuth, (req,res, next) => {
        projectsService.deleteProjectById(
            req.app.get('db'),
            req.params.id
        )
        .then(res.status(204).end())
        .catch(next)
    });

projectsRouter
    .route('/chords/:id')
    .get(requireAuth, (req, res, next) => {
        projectsService.getChordById(
            req.app.get('db'),
            req.params.id
        )
        .then(chord => {
            res.json({...chord, notes: JSON.parse(chord.notes)})
        })
        .catch(next)
    })
    .delete(requireAuth, (req, res, next) => {
        projectsService.deleteChordById(
            req.app.get('db'),
            req.params.id
        )
        .then(res.status(204).end())
        .catch(next)
    })
   


module.exports = projectsRouter;