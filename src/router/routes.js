const express = require('express');
const { homeStart, getQuotes, userRegister } = require('../controller/user.controller')
const { validateToken } = require('../helpers/jwt')

const router = express.Router();

router.get('/', homeStart)
router.get('/getquote/:authorization', getQuotes);
router.post('/register', userRegister);

module.exports = router;
