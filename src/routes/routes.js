
const express = require('express');
const bodyParser = require('body-parser');
const controller=require('../controllers/controller');
const authenticateToken=require('../middleware/middleware')
const router = express.Router();
router.use(bodyParser.json());

router.post('/signup', controller.signUp);
router.get('/get',authenticateToken,controller.getUsers);
router.post('/login', controller.login);
router.put('/update',authenticateToken, controller.updateUser);
router.delete('/delete/:id',authenticateToken,controller.deleteUser);
router.post('/changepassword', authenticateToken, controller.changePassword);

module.exports = router;              