const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth endpoints', () => {
    let db;

    const { chordtester_users, user_projects, project_chords } = helpers.makeFixtures();
    const testUser = chordtester_users[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    
})