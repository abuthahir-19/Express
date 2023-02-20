const usersDB = {
    users: require ('../model/users.json'),
    setUsers : function (data) {
        this.users = data;
    }
};

const express = require ('express');
const router = express();

router.get ('/', (req, res) => {
    res.status (200).json (usersDB.users);
});

router.delete ('/', (req, res) => {
    usersDB.setUsers ([]);
    res.status (200).json (usersDB.users).send ("Deleted All the users");
});

module.exports = router;