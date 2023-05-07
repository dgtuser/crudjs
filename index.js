const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodypaser = require('body-parser')
const connectDB = require('./server/database/connection')

const app = express();

const path = require('path')
const { connection } = require('mongoose')

dotenv.config({path: 'config.env'})
const PORT = process.env.PORT || 8080;

app.use(morgan('tiny'))


connectDB()

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, "views/ejs"))



app.use('/css', express.static(path.resolve(__dirname, '/assets/css')))
app.use('/img', express.static(path.resolve(__dirname, '/assets/img')))
app.use('/js', express.static(path.resolve(__dirname, '/assets/js')))

app.use(express.static('assets'));


app.use(bodypaser.urlencoded({extended: true}))


app.use('/', require('./server/routes/router'))

app.listen(PORT,() => {
    console.log('сервер запущен на '+ PORT +' порту')
})