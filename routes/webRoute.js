const express = require('express');
const user_route = express();

user_route.set('view engine', 'ejs'); // Set the view engine to ejs
user_route.set('views', './views'); // Set the views directory

user_route.use(express.static('public'));

const userController = require('../controllers/userControllers')

user_route.get('/mail-verification', userController.veryfiyMail)

module.exports = user_route;
