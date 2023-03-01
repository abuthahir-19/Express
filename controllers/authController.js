const bcrypt = require ('bcrypt');
const mysql = require ('mysql');

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'registereduser',
});

db.connect (er => {
    if (er) throw er;
    else {
        console.log ('Connection to the DB was success !!');
    }
});


const checkForValidUser = async (req, res) => {
    const { user, pwd } = req.body;
    var sqlQuery = 'SELECT password from User WHERE email = ?';
    db.query (sqlQuery, [user], async (er, result) => {
        if (er) throw er;
        else {
            if (result.length > 0) {
                const match = await bcrypt.compare (pwd, result[0].password);
                if (match) {
                    res.json ({ "success" : "You\'re logged in . " });
                } else {
                    res.json ({ "message" : "Something gone wrong. Please check with your credentials !!" });
                }
            } else {
                res.json ({ "message" : "Invalid user. Please register !!" });
            }
        }
    });
};

module.exports = { checkForValidUser };
