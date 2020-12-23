import axios from 'axios'
import { handle_axios_error } from '../../../lib/http'

const register_api = async function (req, res) {
	const { method } = req
	switch (method) {
		case 'POST':
			try {
				const { body } = req
				return axios({
					url:
						'https://weefacorp-admin.herokuapp.com/auth/local/register',
					method: 'POST',
					data: JSON.stringify(body),
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then(response => {
						return res.json(response.data)
					})
					.catch(e => {
						const { message, data, status } = handle_axios_error(e)
						return res.status(status || 400).json(data)
					})
			} catch (e) {
				return res.status(500).json({
					message: 'Server Error',
					data: {},
					status: 500,
				})
			}
		default:
			return res.status(405).end()
	}
}

export default register_api
