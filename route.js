var express = require('express');
var router = express.Router();
const con = require('./db/connection');
const checkValidUser = require('./middleware/auth');
const userLogin = require('./controller/loginController');
const reg = require('./controller/registrationController');
const changeUserPassword = require('./controller/changePasswordController');
const sendUserPasswordResetEmail = require('./controller/sendUserPasswordResetController');
const updateUser = require('./controller/updateUSerController');
const userProfile = require('./controller/userProfileController');
const file = require('./controller/fileController');

router.post('/login', checkValidUser.checkValidUser, userLogin.userLogin);
router.post('/register',checkValidUser.checkRegisterUser, reg.userReg);
router.post('/changePassword',checkValidUser.checkUserAuth,changeUserPassword.changeUserPassword);
router.post('/send-reset-password-email',sendUserPasswordResetEmail.changeUserPassResetEmail);
router.post('/reset-password/:id/:token',sendUserPasswordResetEmail.userPasswordReset);
router.post('/updateUser',checkValidUser.verifyToken, updateUser.updateUser);
router.post('/deleteUser',checkValidUser.verifyToken, updateUser.deleteUser);
router.post('/profile',checkValidUser.verifyToken,userProfile.userProfile);
router.post('/file',file.fileSystem);


module.exports = router;