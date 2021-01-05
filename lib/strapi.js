import axios from 'axios'
import { handle_axios_error } from './http'

export const processStrapiErrors = function (errorData = [], formFields = []) {
	// default
	let message = 'Unknown Error'
	const failing = []
	try {
		for (let error of errorData) {
			const { messages } = error
			for (let messageData of messages) {
				const { message: error_msg } = messageData
				for (let field of formFields) {
					// check failing fields
					const regxp = new RegExp(`${field}`, 'i')
					const failed = regxp.test(error_msg)
					if (failed) {
						failing.push(field)
						message = error_msg
					}
				}
			}
		}

		return { message, failing }
	} catch (e) {
		return { message, failing }
	}
}

export const auth = async function (URI, credentials) {
	try {
		const res = await axios.post(URI, credentials)
		// user valid,
		const { jwt, user } = res.data
		return {
			err: null,
			failing: null,
			jwt,
			user,
		}
	} catch (e) {
		// login failed
		const login_response = handle_axios_error(e)
		const { data, message } = login_response
		if (data.error) {
			// check these fields
			const fields = ['identifier']
			const { message, failing } = processStrapiErrors(data.data, fields)
			return {
				err: message,
				failing,
				jwt: null,
				user: null,
			}
		} else {
			// unknown error
			return {
				err: message,
				failing: [],
				jwt: null,
				user: null,
			}
		}
	}
}
