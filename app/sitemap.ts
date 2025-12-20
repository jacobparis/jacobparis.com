import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/mdx"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

	const posts = await getAllPosts()

	const postUrls = posts.map((post) => ({
		url: `${baseUrl}/content/${post.slug}`,
		lastModified: new Date(post.timestamp),
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}))

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		...postUrls,
	]
}
