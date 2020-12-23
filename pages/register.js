import React, { createRef, useEffect, useReducer, useState } from 'react'
import { Page, Error } from '../components/page'
import Head from 'next/head'
import { useRouter } from "next/router"
import { Elevated, Form } from '../components/layout'
import { makeStyles } from '@material-ui/core/styles'
import { verifyUser, isLegitimateCallbackUri, cookieName } from '../lib/jwt'
import { generateCsrf } from '../lib/csrf'
import axios from 'axios'
import { handle_axios_error } from '../lib/http'
import {
	FormHelperText,
	Button,
	FormControl,
	TextField,
	Typography,
	ButtonGroup,
	Backdrop,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@material-ui/core'


// registration dialog
const OnSuccess_Dialog = function(props){
	const { onClose, title } = props
	return (
		<Dialog
			open={true}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Thank you for registering to this platform. Enjoy your stay,
					login now!
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary" autoFocus>
					Cool
				</Button>
			</DialogActions>
		</Dialog>
	)
}

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
	const router = useRouter()

	const [error, setError] = useState('')
	const [open_dialog, setDialog] = useState(false)
	const [fieldErrors, error_dispatch] = useReducer(
		field_reducer,
		initialFields,
		field_init
	)
	const [fields, dispatch] = useReducer(
		field_reducer,
		initialFields,
		field_init
	)
	const [isSubmitting, toggleSubmit] = useState(false)

	// error update function
	const toggleErrors = result => {
		const { message, data: result_errors = [] } = result
		const input_fields = Object.keys(initialFields)
		// assign each error to its corresponding field
		if (Array.isArray(result_errors)) {
			for (let err of result_errors) {
				const { messages } = err
				for (let item of messages) {
					const { id, message } = item
					// determine if a field is failing
					for (let iField of input_fields) {
						const reg = new RegExp(iField, 'i')
						// if so, set error
						if (reg.test(id)) {
							error_dispatch({
								type: 'update',
								field: iField,
								value: message,
							})
						}
					}
				}
			}
		} else {
			setError(message || 'Unknown Error')
		}
	}
	
	// handle submit
	const onSubmit = async function (ev) {
		try {
			ev.preventDefault()
			toggleSubmit(true)
			// clear state
			setError('')
			error_dispatch({ type: 'reset' })
			// simple check if confirmPassword is === to password
			if(fields.password !== fields.confirmPassword){
				error_dispatch({ type:'update', field: 'confirmPassword', value: "Confirm Password doesn't match password"})
				return toggleSubmit(false)
			}
			// define the request body
			const body = {
				...fields,
				_csrfToken: props._csrf,
			}
			// register
			const response = await axios({
				url: '/api/auth/register',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				data: JSON.stringify(body),
			})
			// all seems to go well 
			// open success registration dialog
			// state 
			toggleSubmit(false)
			return setDialog(true)
		} catch (e) {
			const { data, message, status } = handle_axios_error(e)
			if (!status) {
				setError(message)
				error_dispatch({ type: 'reset' })
			} else {
				toggleErrors(data)
			}
			return toggleSubmit(false)
		}
	}

	const onChange = function (e) {
		const { target } = e
		dispatch({ type: 'update', value: target.value, field: target.name })
	}

	const redirect = function(){
		router.push("/login")
	}

	return (
		<Page>
			<Head>
				<title>Register 👁 JWT-NextJS</title>
			</Head>
			<Error message={error} />
			<Backdrop className={classes.backdrop} open={isSubmitting}>
				<CircularProgress />
			</Backdrop>
			{open_dialog && <OnSuccess_Dialog title="Registration successful" onClose={redirect}/>}
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
						<FormHelperText error={!!fieldErrors.username}>
							{fieldErrors.username}
						</FormHelperText>
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
						<FormHelperText error={!!fieldErrors.email}>
							{fieldErrors.email}
						</FormHelperText>
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
						<FormHelperText error={!!fieldErrors.password}>
							{fieldErrors.password}
						</FormHelperText>
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
						<FormHelperText error={!!fieldErrors.confirmPassword}>
							{fieldErrors.confirmPassword}
						</FormHelperText>
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
