const crypto = require('crypto')
const sequelize = require('../config/db.config')
const { createToken } = require('../helpers/jwt')
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const homeStart = (req, res) => {
	const url = process.env.EXPRESS_PORT;

	const response = res.status(200).json({
		status: 'success',
		message: `Server Started at : ${url}`
	});

	return response;
};

const userRegister = async (req, res) => {
	try {
		const { username } = req.body
		const signature = nanoid(4)
		const data = [{ username: username, signature: signature }]

		const accessToken = createToken(data[0])

		if (!accessToken) {
			const response = res.status(400).json({
				status: 'fail',
				message: 'Gagal membuat Token',
			})
			return response;
		}

		const hashToken = await bcrypt.hash(accessToken, 10);
		const quotesId = crypto.randomInt(1, 20)

		await sequelize.query('INSERT INTO users (name, signature, access_token, id_quotes) VALUES (?,?,?,?)', {
			replacements: [username, signature, accessToken, quotesId]
		})

		const response = res.status(400).json({
			status: 'success',
			message: 'Berhasil Register',
			data: {
				jwt: hashToken,
			}
		})
		return response;

	} catch (err) {
		res.status(500).json({
			status: 'fail',
			error: err
		})
	}
}

const getQuotes = async (req, res) => {
	try {
		const { signature, authorization } = req.params

		// const token = authorization.split(' ')[1];

		const [searchSignature] = await sequelize.query('SELECT * FROM users WHERE signature = ?', {
			replacements: [signature]
		});

		const isValid = await bcrypt.compare(searchSignature[0].access_token, authorization)

		if (!isValid) {
			const response = res.status(400).json({
				status: 'fail',
				message: 'Hash Token Salah',
			})
			return response;
		}

		const [decodeData] = await sequelize.query('SELECT * FROM users WHERE signature = ?', {
			replacements: [signature]
		});

		if (!decodeData) {
			const response = res.status(400).json({
				status: 'fail',
				message: 'User Tidak Ditemukan',
			})
			return response;
		}

		const quotesId = crypto.randomInt(1, 20)

		const [data] = await sequelize.query('SELECT * FROM quotes WHERE id_quotes = ?', {
			replacements: [decodeData[0].id_quotes],
		})

		if (data[0].status) {
			getQuotes()
		}

		const date = Date.now()
		const expiredTime = Date.now() + 4 * 60 * 60 * 1000;

		if (decodeData[0].expired_date < date) {

			await sequelize.query('UPDATE users SET id_quotes = ? WHERE id = ?', {
				replacements: [quotesId, decodeData[0].id]
			});

			await sequelize.query('UPDATE users SET expired_date = ? WHERE id = ?', {
				replacements: [expiredTime, decodeData[0].id]
			});

			await sequelize.query('UPDATE quotes SET status = ? WHERE id_quotes = ? ', {
				replacements: [false, decodeData[0].id_quotes]
			});

			await sequelize.query('UPDATE quotes SET status = ? WHERE id_quotes = ? ', {
				replacements: [true, quotesId]
			});
		}

		const response = res.status(200).json({
			quotes: data[0].quotes,
			author: data[0].author
		});

		return response;

	} catch (err) {
		// const response = res.status(500).json({
		// 	status: "fail",
		// 	error: err.message
		// });

		// return response;
	}

}

module.exports = { homeStart, getQuotes, userRegister }