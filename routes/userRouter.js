const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userControllers');

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../Public/Images'))
    },
    filename: function (req, file, cb) {
        const name = `${Date.now()}-${file.originalname}`;
        cb(null, name);
    }

});

const filefilter = (req, file, cb) => {
    (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') ? cb(null, true) : cb(null, false);
}

const upload = multer({
    storage: storage,
    fileFilter: filefilter
})

const {signUpValidation, loginValidation} = require('../helpers/validation')

router.post('/register', upload.single('Image'), [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail({ gmail_remove_dots: true }).withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], signUpValidation, userController.register);



router.post('/login', [    
    body('email').isEmail().normalizeEmail({ gmail_remove_dots: true }).withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], loginValidation,userController.login);


module.exports = router;
