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
        const username = testUser.username;
        const id = testUser.id;
        const token = AuthService.createJwt(username, {id: id})
        console.log(username, id, token)
        return supertest(app)
            .get('/api/projects')
            .set('Authorization', token)
            .expect(200)
    })
})