const mongoose = require('mongoose')
const connectDB = async () => {
    try{
        const conn =  await mongoose.connect('mongodb://127.0.0.1:27017/test', {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true})
        console.log(`Mongodb connected`)
    }
    catch(error)
    {
        throw new Error(error)
    }
}

module.exports = connectDB
