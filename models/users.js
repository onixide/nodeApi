const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    login: { type: String, required: true, unique: true, minlength: 3, maxlength:255, trim: true },
    password: { type: String, required: true, minlength: 4, maxlength:1024, trim: true  },
    email: { type: String, required: true, unique: true, minlength: 1, maxlength:255, trim: true },
    scope: { type: String, enum: ['admin', 'user'], default: "user" },
    created: { type: Date, default: Date.now }
});


userSchema.methods.generateJWTToken = function(){
    const token = jwt.sign({ login: this.login, _id: this._id}, "borsuczi");
    return token;
}

const Users = mongoose.model('User', userSchema);
//sprawdzanie przed zapisem joiem danych
function validateUser(obj) {

    const schema = ({
        login: Joi.string().alphanum().min(3).max(255).required(),
        //mozna uzyc joi-password-comlexity do hasla zeby dodac jakies duze male litery itd
        password: Joi.string().min(4).max(255).required(),
        email: Joi.string().min(1).max(255).required().email(),
        scope: Joi.string().valid('admin', 'user')
    });

    return Joi.validate(obj, schema);
}

module.exports.Users = Users;
module.exports.validateUser = validateUser;
// module.exports.userSchema = userSchema;