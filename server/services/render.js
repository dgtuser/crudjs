// exports.homeRoutes = (req,res) => {
//     res.render('index')
// }
exports.homeRoutes = (req, res) => {
    res.render('index', { users: res.data })
}
exports.addRoutes = (req, res) => {
    res.render('add__user')
}

exports.updateRoutes = (req, res) => {
    res.render('update')
}

const  axios = require('axios')

exports.homeRoutes = (req, res) => {
    axios.get('http://localhost:3000/api/users')
        .then(function(response){
            res.render('index', {users: response.data})
        })
        .catch(err => {
            res.send(err)
        })
}


