import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Alegreya } from "next/font/google"
import "@/styles/Home.scss"

export const alegreya = Alegreya({
	weight: ["400", "600"],
	preload: false,
})

export default function App({ Component, pageProps }: AppProps) {
	return (
		<main className="main">
			<Component {...pageProps} />
		</main>
	)
}
