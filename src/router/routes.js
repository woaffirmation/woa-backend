const express = require('express');
const { homeStart, getQuotes, userRegister } = require('../controller/user.controller')
const { validateToken } = require('../helpers/jwt')

const router = express.Router();

router.get('/', homeStart)
router.get('/getQuotes/:authorization/:signature', getQuotes);
router.post('/register', userRegister);

module.exports = router;
