const User = require('../models/user')
const validator = require('validator')

const mongoose = require('mongoose')


const validateRequest = async function(req) {
    let errors = [] 
    let error = await validateEmail(req.body['email'])
    if (error != undefined ) errors.push(error)
    if(!validator.isEmail(req.body['email'])) errors.push("Invalid email format")
    return errors
}


const validateEmail = async (email) => {
    const user = await User.find({email:email})
    if (user.length > 0) return "Email address is already taken"

}

const isValidMongoID = function({id}) {
    return validator.isMongoId(id)
}

module.exports = {
    validateRequest,
    isValidMongoID
}