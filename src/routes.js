const express = require('express');
const verify = require('./Utils/functionsJWT');

const routes = express.Router();

const UserController = require('./Controllers/UserController');
const { verifyJWT } = require('./Utils/functionsJWT');

routes.get('/users/newest-four', verify.verifyJWT, UserController.newestFourUsersGet);
routes.get('/users/:id', verifyJWT, UserController.getSingleUser);
routes.get('/users', verify.verifyJWT, UserController.getAllUsers);
routes.post('/signup', UserController.createUser);
routes.post('/login', UserController.login);
routes.post('/recover-password', UserController.recoverPassword);
routes.put('/change-password/:id', verify.verifyJWT, UserController.changePassword);
routes.put('/users/update/:id', verify.verifyJWT, UserController.updateUser);
routes.delete('/users/delete/:id', verify.verifyJWT, UserController.toggleUser);

module.exports = routes;