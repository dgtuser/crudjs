const express = require('express')

const route = express.Router()
const services = require('../services/render')
const controller = require('../controller/controller')

route.get('/', services.homeRoutes)
route.get('/add-ip', services.addRoutes)
route.get('/edit-ip/:id', services.updateRoutes)

route.post('/ips', controller.create)
route.post('/ips/:id/update', controller.update)
route.post('/ips/:id/delete', controller.delete)
route.post('/ips/import', controller.importCsv)

module.exports = route
