import { getAllPosts } from "@/lib/mdx"
import { Navigable } from "@/components/navigable"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
	title: "Blog | Jacob Paris",
	description: "Come check out my guides to make you better at building web applications.",
}

export default async function ContentIndexPage() {
	const posts = await getAllPosts()

	return (
		<div>
			<main className="max-w-4xl mx-auto px-6 py-8">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<span>←</span>
					<span>Home</span>
				</Link>
				<div className="space-y-8 mt-8">
					{posts.map((post) => (
						<Navigable.Root
							key={post.slug}
							prefetch="viewport"
							className="group"
							href={`/content/${post.slug}`}
							asChild
						>
							<article>
								<Navigable.Link>
									<h2 className="mt-3 group-hover:opacity-70 transition-opacity text-balance leading-tight text-2xl font-medium">
										{post.title}
									</h2>
								</Navigable.Link>
								{post.timestamp ? (
									<time className="text-sm text-muted-foreground block mt-0">
										{new Date(post.timestamp).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</time>
								) : null}
								{post.description ? (
									<p className="text-base text-muted-foreground text-pretty leading-relaxed mt-2">
										{post.description}
									</p>
								) : null}
							</article>
						</Navigable.Root>
					))}
				</div>
			</main>
		</div>
	)
}
