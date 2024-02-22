const { check } = require('express-validator');

exports.signUpValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password is required').isLength({ min: 8 }),
    check('image').custom((value, {req}) =>{

        if(req.file.mimetype == 'image/jpeg' ||req.file.mimetype == 'image/png'){
            return true;
        }
        else{
            return false;
        }

    }).withMessage('Please Upload an image type PNG, JPG')
];
