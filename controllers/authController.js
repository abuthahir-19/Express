const usersDB = {
    users: require ('../model/users.json')
};

const bcrypt = require ('bcrypt');

const checkForValidUser = async (req, res) => {
    const { user, pwd } = req.body;
    const hashedPwd = bcrypt.hash (pwd, 10);
    const foundUser = usersDB.users.find (person => person.username === user);
    if (!foundUser) {
        res.send ("User does not exists");
        return;
    }
    const matchPwd = await bcrypt.compare (pwd, foundUser.password);
    if (matchPwd) {
        res.send ("User logged in !!");
    } else {
        res.json ("Password does not match.");
    }
};

module.exports = { checkForValidUser };