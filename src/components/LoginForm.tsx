import React, { useCallback, useState } from "react"
import { useRouter } from "next/router"
import ky from "ky"
import styles from "@/styles/Login.module.scss"
import { alegreya } from "@/pages/_app"

import { BsKey } from "react-icons/bs"
import { BiShow, BiHide } from "react-icons/bi"

interface LoginData {
	login: string
	password: string
}

interface ResponseState {
	error: string
	message: string
}

export default function LoginForm() {
	const router = useRouter()
	const [loginData, setLoginData] = useState<LoginData>({ login: "", password: "" })
	const [response, setResponse] = useState<ResponseState>({ error: "", message: "" })
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [showPassword, setShowPassword] = useState<boolean>(false)

	const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const response = await ky.post("https://technical-task-api.icapgroupgmbh.com/api/login/", {
				json: { username: loginData.login, password: loginData.password },
			})

			const data: { message: string } = await response.json()
			setResponse({ error: "", message: data.message })
			if (data.message === "Authentication successful.") {
				setTimeout(() => router.push("/table"), 1500)
			}
		} catch (err) {
			setResponse({ error: "Incorrect login details. Please check the entered username and password.", message: "" })
		} finally {
			setIsLoading(false)
		}
	}

	const loginDataHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget
		setLoginData(loginData => ({ ...loginData, [name]: value }))
		setResponse({ error: "", message: "" })
	}, [])

	const showPasswordHandler = () => {
		setShowPassword(prev => !prev)
	}

	return (
		<div className={alegreya.className}>
			<form
				onSubmit={loginHandler}
				className={styles.form}
			>
				<label htmlFor="login">
					Login
					<br />
					<input
						name="login"
						onChange={loginDataHandler}
						type="text"
						value={loginData.login}
						placeholder="Login"
					/>
				</label>

				<label htmlFor="password">
					<span onClick={showPasswordHandler}>
						Password
						{!showPassword ? <BiShow /> : <BiHide />}
					</span>

					<input
						value={loginData.password}
						type={showPassword ? "text" : "password"}
						onChange={loginDataHandler}
						name="password"
						placeholder="Password"
					/>
				</label>

				{response.error && <p className={styles.error}>❗{response.error}</p>}
				{response.message && <p className={styles.success}>✅{`${response.message}\nRedirect to a data table`}. </p>}

				<button
					type="submit"
					className={styles.loginButton}
					disabled={isLoading || (!loginData.login && !loginData.password)}
					style={{
						cursor: loginData.password && loginData.login && !isLoading ? "pointer" : "not-allowed",
					}}
				>
					{isLoading ? (
						<div className={styles.loading}>
							<span></span>
							<span></span>
							<span></span>
						</div>
					) : (
						<>
							Login <BsKey />
						</>
					)}
				</button>
			</form>
		</div>
	)
}
