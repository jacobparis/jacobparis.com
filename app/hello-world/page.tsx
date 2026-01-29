import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Hello World",
	description: "A simple hello world page",
}

export default function HelloWorldPage() {
	return (
		<main className="max-w-4xl mx-auto px-6 py-16">
			<h1 className="text-2xl font-medium">Hello, World!</h1>
		</main>
	)
}
