import { Feed } from "feed"
import { getAllPosts } from "@/lib/mdx"

const baseUrl = "https://www.jacobparis.com"

export async function GET() {
	const feed = new Feed({
		id: baseUrl,
		link: `${baseUrl}/content`,
		title: "Jacob Paris",
		language: "en",
		copyright: `All rights reserved ${new Date().getFullYear()}, Jacob Paris`,
		description: "Come check out my guides to make you better at building web applications.",
		author: {
			name: "Jacob Paris",
			link: "https://twitter.com/jacobmparis",
		},
	})

	const posts = await getAllPosts()

	for (const post of posts) {
		if (!post.timestamp) continue

		feed.addItem({
			link: `${baseUrl}/content/${post.slug}`,
			title: post.title,
			description: post.description || "",
			date: new Date(post.timestamp),
			category: post.tags
				?.split(",")
				.map((t) => t.trim())
				.map((item) => ({
					name: item,
				})),
		})
	}

	const rss = feed.rss2()

	return new Response(rss, {
		headers: {
			"Content-Type": "application/xml",
			"Content-Length": String(Buffer.byteLength(rss)),
		},
	})
}
