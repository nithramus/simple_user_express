const base_router = require('./src/user');

function userCreation(knex, fileUtils, params) {
    return new base_router(knex, fileUtils, params)
}

module.exports = userCreation