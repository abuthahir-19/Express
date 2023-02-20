const express = require ('express');
const router = express();
const authControllerRouter = require ('../controllers/authController');
const path = require ('path');

router.get ('/', (req, res) => {
    res.sendFile (path.join (__dirname, '..', 'views', 'login.html'));
});

router.post ('/', authControllerRouter.checkForValidUser);
module.exports = router;