const authRouter = require('express').Router();

const { signinValidation, signupValidation } = require('../middlewares/celebrateValidation');
const { createUser, login } = require('../controllers/users');

authRouter.post('/signin', signinValidation, login);
authRouter.post('/signup', signupValidation, createUser);

module.exports = authRouter;
