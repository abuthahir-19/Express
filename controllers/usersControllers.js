const mysql = require ('mysql');

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'registereduser'
});

db.connect (er => {
    if (er) throw er;
    else {
        console.log ('Connection to the database successfull !');
    }
});


const removeUser = (req, res) => {
    const { fname, lname, email, pwd, phone } = req.body;
    var sqlQuery = 'DELETE FROM User WHERE FirstName = ? AND LastName = ? AND email = ? AND phone = ?';
    db.query (sqlQuery, [fname, lname, email, phone], (er, result) => {
        if (er) throw er;
        else {
            res.json ({ "message" : `User ${fname + " " + lname} has been deleted successfully !` });
            console.log ('Record deleted from the database successfully !!');
        }
    });
};

module.exports = { removeUser };