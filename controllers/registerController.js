const usersDB = {
    users: require ('../model/users.json'),
    setUsers : function (data) {
        this.users = data;
    }
};

const fsPromises = require ('fs').promises;
const path = require ('path');
const bcrypt = require ('bcrypt');
const mysql = require ('mysql');
const uuid = require ('uuid');

const db = mysql.createConnection ({
    host: 'localhost',
    user : 'root',
    password: '123456789',
    database: 'registereduser'
});

db.connect (er => {
    if (er) {
        console.log (er.name + " : " + er.message);
    } else {
        console.log ('Connection to the database was successful !');
    }
});


const createNewUser = async (req, res) => {
    const { fname, lname, email, pwd, phone } = req.body;
    console.log (req.body);
    const id = uuid.v4();
    if (!fname || !lname || !email || !pwd || !phone) res.send ({ 'message' : 'All fields are mandatory !!' });
    //check for duplicate user names in the database
    try {
        //encrypting the password
        const hashedPwd = await bcrypt.hash (pwd, 10);
        //store the new user
        const newUser = { ID : id, Firstname : fname, Lastname : lname, email : email, password : hashedPwd, phone: phone}
        usersDB.setUsers ([...usersDB.users, newUser]);


        //check for whether the user is already exists
        var sqlQuery = 'SELECT * FROM User WHERE FirstName = ? AND LastName = ? AND email = ? and phone = ?';
        db.query (sqlQuery, [fname, lname, email, phone], async (err, result) => {
            if (err) throw err;
            else {
                if (result.length > 0) {
                    res.json ({ "message" : "User with the given credentials already exists !!" });
                } else {
                    const query = "INSERT INTO User (ID, FirstName, LastName, email, password, phone) VALUES ?";
                    var values = [
                        [id, fname, lname, email, hashedPwd, phone]
                    ];

                    db.query (query, [values], (er, result) => {
                        if (er) {
                            console.log (er.name + ":" + er.message);
                        } else {
                            console.log ('Data Insertion was successful !!');
                            console.log ('No of records inserted : ' + result.affectedRows);
                        }
                    });

                    await fsPromises.writeFile (
                        path.join (__dirname, '..', 'model', 'users.json'),
                        JSON.stringify (usersDB.users)
                    );
                    res.status (201).json ({ 'success' : `New user ${fname + " " + lname} created ! Please login using the given credentials`});
                }
            }
        });
    } catch (er) {
        throw er;
        // res.status (500).json ({ 'message' : er.message });
    }
}

module.exports = { createNewUser }