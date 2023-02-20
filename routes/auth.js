const express = require ('express');
const router = express();
const authControllerRouter = require ('../controllers/authController');

router.get ('/', authControllerRouter.createNewUser);
module.exports = router;