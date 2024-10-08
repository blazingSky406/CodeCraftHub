const express = require('express');
const { registerUser, loginUser, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', updateUser); // Route to update a user
router.delete('/:id', deleteUser); // Route to delete a user

module.exports = router;
