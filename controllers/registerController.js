const usersDB = {
    users: require ('../model/users.json'),
    setUsers : function (data) {
        this.users = data;
    }
};

const fsPromises = require ('fs').promises;
const path = require ('path');
const bcrypt = require ('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pws) return res.status (400).json ({ 'message' : 'User and password field are required.'});
    //check for duplicate user names in the database
    const duplicateCheck = usersDB.users.find (person => person.username === user);
    if (duplicateCheck) {
        return res.sendStatus (409);
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
        console.log (usersDB.users);
        res.status (201).json ({ 'success' : `New user ${user} created !`});
    } catch (er) {
        res.status (500).json ({ 'message' : er.message });
    }
}

module.exports = { handleNewUser }