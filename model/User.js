const mongoose = require('mongoose')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    hash: String,
    salt: String,
    password: { type: String, require: true }
})


UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    return jwt.sign({
        name: this.name,
        id: this._id,
    }, process.env.SECRET, { expiresIn: '10 m' });
}

mongoose.model('User', UserSchema)