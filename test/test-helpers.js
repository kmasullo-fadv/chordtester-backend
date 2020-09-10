const { use } = require("chai");
const usersRouter = require("../src/users/users-router");

function makeUsersArray() {
    return [
        {
            id: 1,
            name: 'user',
            username: 'user1',
            password: 'password'
        },
        {
            id: 2,
            name: 'user',
            username: 'user2',
            password: 'password'
        },
        {
            id: 3,
            name: 'user',
            username: 'user3',
            password: 'password'
        }
    ]
}

function makeProjectsArray(users) {
    return [
        {
            id: 1,
            username: users[0].username,
            title: 'Song1'
        },
        {
            id: 2,
            username: users[1].username,
            title: 'Song2'
        },
        {
            id: 3,
            username: users[2].username,
            title: 'Song3'
        },
    ]
}

function makeChordsArray(projects) {
    return [
        {
            id: 1,
            name: 'E',
            project_id: projects[0].id,
            notes: ["le0","a2","d2","g1","b0","he0"]
        },
        {
            id: 2,
            name: 'E',
            project_id: projects[1].id,
            notes: ["le0","a2","d2","g1","b0","he0"]
        },
        {
            id: 3,
            name: 'E',
            project_id: projects[2].id,
            notes: ["le0","a2","d2","g1","b0","he0"]
        }
    ]
}


function makeFixtures() {
    const chordtester_users = makeUsersArray();
    const user_projects = makeProjectsArray(chordtester_users);
    const project_chords = makeChordsArray(user_projects);
    return { chordtester_users, user_projects, project_chords }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
          `TRUNCATE
            project_chords,
            user_projects,
            chordtester_users
          `
        )
        .then(() =>
          Promise.all([
            trx.raw(`ALTER SEQUENCE project_chords_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE user_projects_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE chordtester_users_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('project_chords_id_seq', 0)`),
            trx.raw(`SELECT setval('user_projects_id_seq', 0)`),
            trx.raw(`SELECT setval('chordtester_users_id_seq', 0)`),
          ])
        )
      )
}


function seedTables(db, users, projects, chords) {
    return db.transaction(async trx => {
        await trx.into('chordtester_users').insert(users);
        await trx.into('user_projects').insert(projects);

        await Promise.all([
            trx.raw(
                `SELECT setval(chordtester_users_id_seq, ?)`,
                [users[users.length-1].id],
            ),
            trx.raw(
                `SELECT setval(user_projects_id_seq, ?)`,
                [projects[projects.length-1].id],
            ),
            trx.raw(
                `SELECT setval(project_chords_id_seq, ?)`,
                [chords[chords.length-1].id],
            ),
        ]);
    })
}




module.exports = {
    makeUsersArray,
    makeProjectsArray,
    makeChordsArray,
    makeFixtures,
    cleanTables,
    seedTables
}