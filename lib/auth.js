import useSWR from 'swr'
// fetcher 
const fetcher = async url => {
	const res = await fetch(url)

	return res.json()
}

// fetch current user state
export const useUser = () => {
	const { data, error } = useSWR('/api/auth/user', fetcher)

	return {
		error,
		data: data || {},
		isLoading: !error && !data,
	}
}