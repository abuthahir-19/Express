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


const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'registereduser'
});

db.connect (e => {
    if (e) console.log (e.name + " : " + e.message);
    else console.log ('connection to the database successfull !!');
});

const checkForExistence = ({ fname, lname, email, pwd, phone }) => {
    
};

const createNewUser = async (req, res) => {
    const { fname, lname, email, pwd, phone } = req.body;
    if (!fname || !lname || !email || !pwd || !phone) res.send (401).json ({'message' : 'All fields are mandatory !!'});


    try {
        //encrypting the password
        const hashedPwd = await bcrypt.hash (pwd, 10);
        //store the new user
        const newUser = { 'Firstname' : fname, 'Lastname' : lname, 'Email' : email, 'Password' : hashedPwd, 'Phone' : phone };
        var query = 'INSERT INTO userdata (FirstName, LastName, email, password, phone) VALUE ?'
        var values = [
            [fname, lname, email, hashedPwd, phone]
        ];

        db.query (query, [values], (err, result) => {
            if (err) {
                console.log (err.name + ":" + err.message);
            } else {
                console.log ("Data has been inserted to the database successfully !!");
                console.log ('Number of rows affected : ' + result.AffectedRows);
            }
        });

        usersDB.setUsers ([...usersDB.users, newUser]);
        await fsPromises.writeFile (
            path.join (__dirname, '..', 'model', 'users.json'),
            JSON.stringify (usersDB.users)
        );
        console.log (newUser);
        res.status (201).json ({ 'success' : `New user ${fname + " " + lname} has been created !`});
    } catch (er) {
        console.log (er.name + ":" + er.message);
        res.status (500).json ({ 'message' : er.message });
    }
}

module.exports = { createNewUser }