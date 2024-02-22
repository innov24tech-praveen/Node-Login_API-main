const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../config/dbConnection');

const randomstring = require('randomstring');
const sendMail = require('../helpers/sendMail')

const register = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    db.query(
        `SELECT * FROM crm_user WHERE LOWER(email) = LOWER(?);`,
        [email],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ msg: 'Database error' });
            }
            if (result && result.length) {
                return res.status(409).send({ msg: 'This user is already registered' });
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({ msg: 'Error hashing password' });
                    }
                    const token = randomstring.generate(); // Generate token
                    db.query(
                        `INSERT INTO crm_user (name, email, password, token, image) VALUES (?, ?, ?, ?, ?);`,
                        [name, email, hash, token, 'Images/${req.file.filename}'],
                        (err, result) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send({ 
                                    msg: err 
                                });
                            }
                            let mailSubject = ' Mail Verification';
                            const rendomToken = randomstring.generate();
                            let content =  '<p>Hii. '+req.body.name+',Please <a href="http://127.0.0.1:3000/mail-verification?token='+token+'">verify<a>Your Mail</p>';
                            sendMail(req.body.email, mailSubject, content);
                            console.log("Mail Sent Successfully");
                            return res.status(200).send({ msg: 'User registered successfully' });
                        }
                    );
                });
            }
        }
    );
};

const veryfiyMail = (req, res) => {
    var token = req.query.token;

    db.query('SELECT * FROM crm_user WHERE token=? LIMIT 1', [token], function(error, result, fields){
        if(error){
            console.log(error.message);
            return res.status(500).send({ msg: error.message });
        }

        if (result.length > 0) {
            console.log("Result:", result); // Log result to inspect its structure
            const userId = result[0].Id;
            console.log("userId:", userId); // Log userId to check its value
            db.query(
                'UPDATE crm_user SET token = null, is_verified = 1 WHERE id = ?',
                [userId],
                function (updateError, updateResult, updateFields) {
                    if (updateError) {
                        console.error(updateError);
                        return res.status(500).send({ msg: updateError.message });
                    }
                    return res.render('mail-verification', { message: 'Mail Verified successfully' });
                }
            );
        } else {
            return res.render('404');
        }
    });
}

module.exports = { 
    register ,
    veryfiyMail
};
