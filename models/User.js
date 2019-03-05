const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const UserSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favorites: {
        type: [Schema.Types.ObjectId],
        ref: 'Recipe'
    }
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt)
        this.password = hash;
        next()
    } catch (err) {
        return next(err)
    }
});

module.exports = mongoose.model('User', UserSchema)