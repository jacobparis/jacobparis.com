import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Hello | Jacob Paris",
	description: "A friendly greeting from Jacob Paris",
}

export default function HelloPage() {
	return (
		<main className="max-w-4xl mx-auto px-6 py-16">
			<h1 className="text-2xl font-medium">Hello!</h1>
			<p className="mt-3 text-muted-foreground">
				Welcome to my site. Thanks for stopping by!
			</p>
		</main>
	)
}
