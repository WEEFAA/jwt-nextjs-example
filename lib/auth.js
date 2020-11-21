import useSWR from 'swr'
// fetcher 
const fetcher = async url => {
	const res = await fetch(url)

	return res.json()
}

// fetch current user state
export const useUser = () => {
    return useSWR("/api/auth/user", fetcher)
}