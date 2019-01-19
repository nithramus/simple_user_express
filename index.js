const base_router = require('./src/user');

function userCreation(knex, params) {
    return new base_router(knex, params)
}

module.exports = userCreation