const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares.js/auth');

router.use('/', authRouter);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

module.exports = router;
