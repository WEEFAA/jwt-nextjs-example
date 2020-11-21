import { Error, Page } from "../components/page"
import {
	Typography,
	OutlinedInput,
	FormControl,
	InputLabel,
	Button,
	Container,
	Input,
	formatMs,
	CircularProgress,
} from '@material-ui/core'
import { Buttons, Elevated, Form } from "../components/layout"
import { useState, createRef, useEffect } from "react"
import { useRouter } from "next/router"
import Token from "csrf"
import { generateCsrf } from "../lib/csrf"
import Head from 'next/head'
import { useUser } from '../lib/auth'

function Home(props) {
	const { isValidating, data, error } = useUser()
	const router = useRouter()
	// states
	const [fields, toggleFields] = useState({
		username: '',
		password: '',
	})
	const [errors, setErrors] = useState([])
	const [message, setMessage] = useState('')

	// submit btn ref
	const submitBtnRef = createRef()
	function onSubmit() {
		const btn = submitBtnRef.current
		if (btn) btn.click()
	}
	// form control
	function onChange(e) {
		const { target } = e
		toggleFields({
			...fields,
			[target.name]: target.value,
		})
	}

	useEffect(() => {
		const query = router.query
		// check errors
		const { errors = '', message = '' } = query
		const failing = errors.split(',')
		// set errors if exist
		setErrors(failing)
		setMessage(message)
	}, [router.query])

	// loading
	if (isValidating || !data) {
		return <CircularProgress />
	}
	// user is already logged in
	if (data.user) {
		router.push('/')
		return null
	}

	return (
		<Page>
			<Head>
				<title>Authorize 👁 JWT-NextJS</title>
			</Head>
			<Elevated>
				<Typography
					variant="h3"
					component="h1"
					color="primary"
					style={{ textAlign: 'center' }}>
					Login
				</Typography>
				<Typography
					variant="h6"
					component="h2"
					color="textSecondary"
					style={{ textAlign: 'center' }}>
					JWT authorization DEMO
				</Typography>
				<Form method="POST" action="/api/auth/login">
					<Error message={message} />
					<FormControl
						variant="outlined"
						fullWidth
						margin="normal"
						size="small"
						required>
						<InputLabel htmlFor="username">Username</InputLabel>
						<OutlinedInput
							id="username"
							name="username"
							placeholder="emela"
							label="username"
							error={errors.includes('user')}
							value={fields.username}
							onChange={onChange}
							required
						/>
					</FormControl>
					<FormControl
						variant="outlined"
						fullWidth
						size="small"
						required>
						<InputLabel htmlFor="password">Password</InputLabel>
						<OutlinedInput
							id="password"
							name="password"
							type="password"
							placeholder="************"
							label="password"
							error={errors.includes('pass')}
							value={fields.password}
							onChange={onChange}
							required
						/>
					</FormControl>
					<Input
						type="hidden"
						name="_csrfToken"
						value={props._csrf}
					/>
					<Buttons>
						<Input
							inputRef={submitBtnRef}
							style={{ display: 'none' }}
							type="submit"
							value="submit"
						/>
						<Button
							color="primary"
							variant="contained"
							onClick={onSubmit}>
							Login
						</Button>
						<Button variant="contained">Info</Button>
					</Buttons>
				</Form>
			</Elevated>
		</Page>
	)
}

// SSR
export const getServerSideProps = async function(context){
    const { res } = context 
    // generate token
    const _csrf = await generateCsrf(res)
    return {
        props: { _csrf }
    }
}

export default Home