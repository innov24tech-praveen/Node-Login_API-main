const mysql = require('mysql');
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

// var mysql = require('mysql')

const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
        debugger
    }
    console.log('Database connected successfully');
});

module.exports = con;
