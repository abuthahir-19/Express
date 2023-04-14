const mysql = require ('mysql');

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'registereduser'
});

db.connect (er => {
    if (er) console.log (er.name + " " + er.message)
    else {
        console.log ('Connection to the database successfull !');
    }
});

const getAllUsers = (req, res) => {
    var sqlQuery = 'SELECT * FROM User';
    db.query (sqlQuery, (er, result) => {
        if (er) throw er;
        else {
            if (result.length > 0) {
                console.log ('List of all users in our database : ');
                for (var obj of result) {
                    for (var prop in obj) {
                        console.log (prop + " : " + obj[prop]);
                    }
                    console.log ('\n');
                }
                res.json (result);
            }
        }
    });
};

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

const deleteAllUsers = (req, res) => {
    var sqlQuery = 'DELETE FROM User';
    db.query (sqlQuery, (err, result) => {
        if (err) {
            console.log (err.name + ":" + err.message);
            throw err;
        } else {
            console.log ('All records deleted from the database succesfully !!');
            res.json ({ "success" : "All users are deleted !!" });
        }
    });
}

module.exports = { removeUser, deleteAllUsers, getAllUsers };