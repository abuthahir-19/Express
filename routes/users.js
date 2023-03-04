const usersDB = {
    users: require ('../model/users.json'),
    setUsers : function (data) {
        this.users = data;
    }
};

const express = require ('express');
const router = express();
const userController = require ('../controllers/usersControllers');

// router.get ('/', (req, res) => {
//     res.status (200).json (usersDB.users);
// });

router.get ('/', require ('../controllers/usersControllers').getAllUsers);

// router.delete ('/', userController.removeUser);
router.delete ('/', require ('../controllers/usersControllers').deleteAllUsers);

module.exports = router;