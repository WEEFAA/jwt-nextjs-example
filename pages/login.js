import { Error, Page } from "../components/page"
import { Buttons, Elevated, Form } from '../components/layout'
import { useState, createRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { generateCsrf } from '../lib/csrf'
import Head from 'next/head'
import { verifyUser, isLegitimateCallbackUri, cookieName } from '../lib/jwt'
import {
	Typography,
	OutlinedInput,
	FormControl,
	InputLabel,
	Button,
	Input,
} from '@material-ui/core'

function Home(props) {
	const router = useRouter()
	const inputRef = createRef(null)
	// states
	const [fields, toggleFields] = useState({
		identifier: '',
		password: '',
	})
	const [errors, setErrors] = useState([])
	const [message, setMessage] = useState('')
	const [app_callback_uri, setAppCallback] = useState('/')

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
		const { errors = '', message = '', app_callback = '/' } = query
		const failing = errors.split(',')
		// set errors if exist
		setErrors(failing)
		setMessage(message)
		setAppCallback(app_callback)
	}, [router.query])

	useEffect(() => {
		const { current: identifier_field } = inputRef
		identifier_field.focus()
	}, []) 

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
				<Form
					id="loginForm"
					method="POST"
					action={`/api/auth/login?app_callback=${app_callback_uri}`}>
					<Error message={message} />
					<FormControl
						variant="outlined"
						fullWidth
						margin="normal"
						size="small"
						required>
						<InputLabel htmlFor="identifier">Username</InputLabel>
						<OutlinedInput
							id="identifier"
							name="identifier"
							placeholder="emela or emela@gmail.com"
							label="identifier"
							inputRef={inputRef}
							error={errors.includes('identifier')}
							value={fields.identifier}
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
							error={errors.includes('password')}
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
					<Button
						href={`/register?app_callback=${app_callback_uri}`}
						variant="text"
						color="primary"
						style={{ margin: '5px auto 0' }}>
						Doesn't have an account? Register now.
					</Button>
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
	const {
		res,
		req,
		query: { app_callback = '/' },
	} = context

	const allowed_uris = process.env.APP_CALLBACK_URIS || []
	const loggedIn = await verifyUser(req)
	if (loggedIn) {
		const token = req.cookies[cookieName]
		// if legitimate uri, send the token
		const should_redirect_with_token = isLegitimateCallbackUri(
			allowed_uris,
			app_callback
		)
		const go_to_uri = should_redirect_with_token
			? `${app_callback}?sid=${token}`
			: app_callback

		// redirect with the token, or not.
		res.writeHead(307, { Location: go_to_uri })
		res.end()
		return { props: {} }
	}
	// generate token
	const _csrf = await generateCsrf(res)
	return {
		props: { _csrf },
	}
}

export default Home