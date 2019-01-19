const base_router = require('./src/base_router');

function userCreation(knex, params) {
    return new base_router(knex, params)
}

module.exports = userCreation