const knex = require('knex');

const projectsService = {
    getAllProjects (db, username) {
        return db.from('user_project')
        .where('username', username)
    },
    addProject (db, username, details) {
        return db
        .insert({
            username: username,
            title: details.title,
            chords: details.chords
        })
        .into('user_project')
    }
}

module.exports = projectsService;