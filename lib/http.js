export const handle_axios_error = error => {
	if (error.response) {
		return {
			message: 'Request failed',
			data: error.response.data,
			status: error.response.status,
		}
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		return {
			message: "Server didn't responded",
			data: {},
			status: null,
		}
	} else {
		return {
			message: 'Unknown error',
			data: {},
			status: null,
		}
	}
}
