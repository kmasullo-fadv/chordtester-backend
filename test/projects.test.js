const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')
const express = require('express');
const knex = require('knex')
const projectsRouter = require('express').Router();
const path = require('path');
const xss = require('xss');
const jsonParser = express.json();
const projectsService = require('../src/projects/projects-service');
const {requireAuth} = require('../src/middleware/jwt-auth');
const AuthService = require('../src/auth/auth-service')
const helpers = require('./test-helpers')

describe('Projects', () => {
    let db;

    const { chordtester_users, user_projects, project_chords } = helpers.makeFixtures();
    const testUser = chordtester_users[0];
    const username = testUser.username;
    const id = testUser.id;
    const projects = user_projects.filter(project => project.username === username)
    const token = AuthService.createJwt(username, {id: id})
    const chords = project_chords
        .filter(chord => chord.project_id === 1)
        .map(chord => ({...chord, notes: JSON.parse(chord.notes)}))
    const chord = project_chords.find(chord => chord.id === 1)
    
    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));
    
    beforeEach('seed tables', () => helpers.seedTables(db, chordtester_users, user_projects, project_chords ))

    afterEach('cleanup', () => helpers.cleanTables(db))

    it('GET api/projects responds with all projects', () => {
        return supertest(app)
            .get('/api/projects')
            .set('Authorization', `Bearer ${token}`)
            .expect(200, projects)
    })

    it('GET api/projects/1 responds with all project chords', () => {
        return supertest(app)
            .get('/api/projects/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200, chords)
    })

    // it('GET api/chords/1 returns chord with id 1', () => {
    //     return supertest(app)
    //         .get('/api/chords/1')
    //         .set('Authorization', `Bearer ${token}`)
    //         .expect(200, chord)
    // })

    it('Deletes chords by id', () => {
        return supertest(app)
            .delete('/api/chords/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    })
})