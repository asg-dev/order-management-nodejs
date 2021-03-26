const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { validate } = require('./cart')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: 5,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    source : {
        type: Number,
        default: 1
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    restaurant_agent : {
        type: Boolean,
        default: false
    },
    role:{
        type: Number,
        required: true,
        default: 1,
        validate(value){
            if (value < 1 || value > 3){
                throw new Error('Invalid role id')
            }
        }
    },
    role_name:{
        type: String,
        required: true,
        default:'Customer'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
    
})

userSchema.virtual('cart', {
    ref:'Cart',
    localField: '_id',
    foreignField: 'user_id'
})

userSchema.virtual('orders', {
    ref:'Order',
    localField: '_id',
    foreignField: 'user_id'
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.restaurant_agent
    delete userObject.__v

    return userObject
}


userSchema.pre('save', async function(next){
    const user = this
    try {
        const crypted_password = await bcrypt.hash(user.password, 8)
        user.password = crypted_password
        next()    
    } catch (error) {
        next(error)
    }
    
})


const User = mongoose.model('User', userSchema)

module.exports = User