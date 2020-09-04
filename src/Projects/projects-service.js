const knex = require('knex');

const projectsService = {
    getAllProjects (db, username) {
        return db.from('user_projects')
        .where('username', username)
    },
    getProjectById (db, username, id) {
        return db.from('project_chords')
        .where('project_chords.project_id', id)
        
    },
    addProject (db, username, title) {
        return db
        .insert({
            username: username,
            title: title
        })
        .into('user_projects')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    addChordtoProject (db, username, details) {
        return db
        .insert({
            name: details.name,
            project_id: details.project_id,
            notes: details.notes
        })
        .into('project_chords')
    },
    deleteProjectById (db, id) {
        return db.from('user_projects')
        .where('id', id)
        .delete()
    }
}

module.exports = projectsService;