const usersDB = {
    users: require ('../model/users.json'),
    setUsers : function (data) {
        this.users = data;
    }
};

const fsPromises = require ('fs').promises;
const path = require ('path');
const bcrypt = require ('bcrypt');

const checkForExistence = (user, pwd) => {
    const foundDuplicate = usersDB.users.find (person => {
        if (person.username === user && bcrypt.compare (pwd, person.password))
            return true;
        else return false;
    });

    if (foundDuplicate) return true;
    return false;
};

const createNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status (400).json ({ 'message' : 'User and password field are required.'});
    //check for duplicate user names in the database
    if (checkForExistence (user, pwd)) {
        res.send ('User already exists !!');
    }

    try {
        //encrypting the password
        const hashedPwd = await bcrypt.hash (pwd, 10);
        //store the new user
        const newUser = { 'username' : user, 'password': hashedPwd}
        usersDB.setUsers ([...usersDB.users, newUser]);
        await fsPromises.writeFile (
            path.join (__dirname, '..', 'model', 'users.json'),
            JSON.stringify (usersDB.users)
        );
        res.status (201).json ({ 'success' : `New user ${user} created !`});
    } catch (er) {
        res.status (500).json ({ 'message' : er.message });
    }
}

module.exports = { createNewUser }