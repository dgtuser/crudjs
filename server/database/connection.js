const mongoose = require('mongoose')

const connectDB = async() => {
    try{
        const con = await mongoose.connect(process.env.MONGOurl,{
            useNewUrlParser: true
        })
        
        console.log('Соединение с БД успешно прошло')
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB