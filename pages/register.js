import React, { createRef, useReducer, useState } from 'react'
import { Page } from '../components/page'
import Head from 'next/head'
import { Elevated, Form } from '../components/layout'
import {
	Button,
	FormControl,
	TextField,
	Typography,
	ButtonGroup,
	Backdrop,
	CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { verifyUser, isLegitimateCallbackUri, cookieName } from '../lib/jwt'
import { generateCsrf } from '../lib/csrf'
import axios from 'axios'
import { handle_axios_error } from '../lib/http'

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}))

const initialFields = {
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
}

const field_init = function () {
	return initialFields
}

const field_reducer = function (state, action) {
	switch (action.type) {
		case 'update':
			return {
				...state,
				[action.field]: action.value,
			}
		case 'reset':
			return field_init()
		default:
			return state
	}
}

const Register_Page = function (props) {
	const classes = useStyles()
	const formRef = createRef()
	const [fields, dispatch] = useReducer(
		field_reducer,
		initialFields,
		field_init
	)
	const [isSubmitting, toggleSubmit] = useState(false)

	// handle submit
	const onSubmit = async function (ev) {
		try {
			ev.preventDefault()
			toggleSubmit(true)
			// define the request body
			const body = {
				...fields,
				_csrf: props._csrf,
			}

			const response = await axios({
				url: '/api/auth/register',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				data: JSON.stringify(body),
			})

			return toggleSubmit(false)
		} catch (e) {
			const result = handle_axios_error(e)

			return toggleSubmit(false)
		}
	}

	const onChange = function (e) {
		const { target } = e
		dispatch({ type: 'update', value: target.value, field: target.name })
	}

	return (
		<Page>
			<Head>
				<title>Register 👁 JWT-NextJS</title>
			</Head>
			<Backdrop className={classes.backdrop} open={isSubmitting}>
				<CircularProgress />
			</Backdrop>
			<Elevated>
				<Typography variant="h3" color="primary" align="center">
					Register
				</Typography>
				<Typography
					component="p"
					variant="h6"
					color="textPrimary"
					align="center">
					Be a member now, no hesitations!
				</Typography>
				<Form onSubmit={onSubmit} ref={formRef}>
					<FormControl fullWidth margin="dense">
						<TextField
							id="username"
							name="username"
							label="Username"
							aria-required
							type="text"
							required
							variant="filled"
							value={fields.username}
							onChange={onChange}
						/>
					</FormControl>
					<FormControl fullWidth margin="dense">
						<TextField
							id="email"
							name="email"
							label="Email"
							type="email"
							aria-required
							required
							variant="filled"
							value={fields.email}
							onChange={onChange}
						/>
					</FormControl>
					<FormControl fullWidth margin="dense">
						<TextField
							id="password"
							name="password"
							label="Password"
							type="password"
							aria-required
							required
							variant="filled"
							value={fields.password}
							onChange={onChange}
						/>
					</FormControl>
					<FormControl fullWidth margin="dense">
						<TextField
							id="confirmPassword"
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							aria-required
							required
							variant="filled"
							value={fields.confirmPassword}
							onChange={onChange}
						/>
					</FormControl>
					<ButtonGroup
						aria-label="Form buttons"
						style={{ marginTop: 10, marginBottom: 5 }}>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							style={{ marginRight: 2 }}>
							Register
						</Button>
						<Button
							type="button"
							variant="contained"
							color="secondary"
							onClick={() => dispatch({ type: 'reset' })}>
							Reset
						</Button>
					</ButtonGroup>
					<Button
						href="/login"
						variant="text"
						color="primary"
						style={{ marginBottom: 3 }}>
						Already have an account? Login now.
					</Button>
				</Form>
			</Elevated>
		</Page>
	)
}

export const getServerSideProps = async context => {
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

export default Register_Page
