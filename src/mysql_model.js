const property = [
    "username"
]

class MysqlModel {
    constructor (knex) {
        this.knex = knex;
    }
    async add(params) {
        try {
            const id = await this.knex('users').insert({
                username: params.username,
                email: params.email,
                password: this.knex.raw(`HASBYTE(SHA2_512, ${params.password})`)
            }).returning('id');
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Serveur erreur")
        }
        return id;
    }

    async update(params, id) {
        try {
            const id = await this.knex('users').update({
                username: params.username,
                email: params.email,
                password: this.knex.raw(`HASBYTE(SHA2_512, ${params.password})`)
            }).where({
                id
            }).returning('id');
            const user = await this.get({ id });
            return user[0];
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Serveur erreur")
        }
    }

    async delete(id) {
        try {
            await this.knex('users').where({
                id
            }).delete();
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Serveur erreur")
        }
        return id;
    }

    async get(params) {
        try {
            const users = await this.knex('users').where(params);
            return users
        }
        catch(err) {
            console.log(err)
            throw new Error("Internal Serveur erreur")
        }
    }

    
}

module.exports = MysqlModel