const Schema = require('validate')
const mysql_model = require('./mysql_model');
const express = require('express');
const uuidv1 = require('uuid/v1');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        length: { min: 4, max: 255},
    },
    password: {
        type: String,
        required: true,
        length: { min: 4, max: 255  }
    },
    email: {
        type: String,
        required: true,
        length: { min: 4, max: 255  }
    }
});



const userUpdateSChema = new Schema({
    username: {
        type: String,
        required: false,
        length: { min: 4, max: 255},
    },
    password: {
        type: String,
        required: false,
        length: { min: 4, max: 255  }
    },
    email: {
        type: String,
        required: false,
        length: { min: 4, max: 255  }
    }
});

class User {
    constructor(knex, fileUtils, params) {
        this.allow_signup = params.allow_signup;
        this.bdd = new mysql_model(knex);
        this.router = express.Router();
        this.fileUtils = fileUtils;
    }

    generateRouter() {
        if (this.allow_signup) {
            this.router.post('/signup', user.signup);
        }
        this.router.post('/login', user.login);
        this.router.post('/me/picture', user.setProfilePicture)
        this.router.delete('/logout', user.logout);
        this.router.put('/me', user.update);
    }

    async login(req, res) {
        if (req.session.connected = true) {
            throw new Error('Already connected')
        }
        const errors = userSchema.validate(req.body);
        if (errors.length > 1) {
            res.status(400).send({ errors: errors })
        }
        const user = await this.bdd.get({
            // username: req.body.username,
            password: this.knex.raw(`HASBYTE(SHA2_512, ${req.body.password})`),
            email: req.body.email
        });
        if (user.length !== 1) {
            throw new Error('Login error');
        }
        req.session.user = user[0];
        req.session.connected = true;
        await this.renderResponse({ user: user[0]}, res);

    }

    async signup(req, res) {
        
    }

    async update(req, res) {
        const errors = userUpdateSChema.validate(req.body);
        if (errors.length > 1) {
            await res.status(400).send({ errors: errors })
        }
        const newUser = await this.bdd.update({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }, req.session.user.id);
        req.session.user = newUser;
        await this.renderResponse({ user: user }, res);
    }

    async setProfilePicture(req, res) {
        const path = await this.fileUtils.uploadBase64File(req.body.data, 'user_profile', uuidv1());
        const newUser = await this.bdd.update({
            profile: path
        }, req.session.user.id);
        await this.renderResponse({ user: newUser}, res);
    }

    async delete(req, res) {
        delete req.session.user;
        delete req.session.connected;
        await this.renderResponse({ message: "ok" }, res)
    }

    async renderResponse(data, res) {
        await res.send({ status: 200, data });
    }
}

module.exports = User;