const userRouter = require('express').Router();

const { usersIdValidation, userInfoValidation, userAvatarValidation } = require('../middlewares.js/celebrateValidation');
const {
  getUsers, getUser, updateUserInfo, updateAvatar, getCurrentUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUserInfo);
userRouter.get('/:userId', usersIdValidation, getUser);
userRouter.patch('/me', userInfoValidation, updateUserInfo);
userRouter.patch('/me/avatar', userAvatarValidation, updateAvatar);

module.exports = userRouter;
