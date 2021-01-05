import axios from 'axios'

export const getUserInfo = async function (baseUri, token) {
	//
	baseUri = baseUri || process.env.BACKEND_URI || ''
	const user_info_uri = `${baseUri}/users/me`
	const headers = {
		Authorization: `Bearer ${token}`,
	}
	// try to fetch user info
	try {
		const response = await axios.get(user_info_uri, { headers })
		return response.data
	} catch (e) {
		// failed to get user information
		return null
	}
}
