const express = require ('express');
const router = express.Router();
const registerController = require ('../controllers/registerController');
const path = require ('path');

router.get ('/', (req, res) => {
    res.sendFile (path.join (__dirname, '..', 'views', 'register.html'));
});

router.post ('/', registerController.createNewUser);
module.exports = router;