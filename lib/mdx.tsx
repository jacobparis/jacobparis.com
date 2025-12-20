import matter from "gray-matter"
import { Octokit } from "@octokit/rest"
import { cacheLife, cacheTag } from "next/cache"

if (!process.env.GITHUB_REPO_OWNER) {
	throw new Error("GITHUB_REPO_OWNER environment variable is required")
}

if (!process.env.GITHUB_REPO_NAME) {
	throw new Error("GITHUB_REPO_NAME environment variable is required")
}

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
})

const owner = process.env.GITHUB_REPO_OWNER
const repo = process.env.GITHUB_REPO_NAME
const contentPath = "content"
const branch = "main"

export interface PostMetadata {
	title: string
	timestamp: string
	description: string
	slug: string
	tags?: string
	published?: boolean
}

export interface Post extends PostMetadata {
	content: string
}

function filenameToSlug(filename: string): string {
	return filename.replace(".mdx", "").replace(`${contentPath}/`, "")
}

function slugToFilename(slug: string): string {
	return `${contentPath}/${slug}.mdx`
}

async function getContentFiles(): Promise<Array<{ name: string; path: string }>> {
	const { data } = await octokit.repos.getContent({
		owner,
		repo,
		path: contentPath,
		ref: branch,
	})

	if (!Array.isArray(data)) {
		return []
	}

	return data
		.filter((file) => file.type === "file" && file.name.endsWith(".mdx"))
		.map((file) => ({ name: file.name, path: file.path }))
}

async function getFileContent(path: string): Promise<string> {
	const { data } = await octokit.repos.getContent({
		owner,
		repo,
		path,
		ref: branch,
	})

	if ("content" in data && data.content) {
		return Buffer.from(data.content, "base64").toString("utf-8")
	}

	throw new Error(`Failed to fetch content for ${path}`)
}

export async function getFirstPostSlug(): Promise<string | null> {
	"use cache"
	cacheTag("posts-index")
	cacheLife("max")

	const files = await getContentFiles()
	if (files.length === 0) {
		return null
	}

	return filenameToSlug(files[0].name)
}

export async function getAllPosts(): Promise<PostMetadata[]> {
	"use cache"
	cacheTag("posts-index")
	cacheLife("max")

	const files = await getContentFiles()

	const posts = await Promise.all(
		files.map(async (file) => {
			const fileContent = await getFileContent(file.path)
			const { data } = matter(fileContent)

			return {
				title: data.title,
				timestamp: data.timestamp,
				description: data.description,
				slug: filenameToSlug(file.name),
				tags: data.tags,
				published: data.published,
			} as PostMetadata
		}),
	)

	return posts
		.filter((post) => post.published !== false)
		.sort((a, b) => {
			const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0
			const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0
			return dateB - dateA
		})
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
	"use cache"
	cacheTag(`post-${slug}`)
	cacheLife("max")

	try {
		const filePath = slugToFilename(slug)
		const fileContent = await getFileContent(filePath)
		const { data, content } = matter(fileContent)

		return {
			title: data.title,
			timestamp: data.timestamp,
			description: data.description,
			slug,
			tags: data.tags,
			published: data.published,
			content,
		}
	} catch {
		return null
	}
}

export async function getNextPost(currentSlug: string): Promise<PostMetadata | null> {
	const posts = await getAllPosts()
	const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

	if (currentIndex === -1 || currentIndex === posts.length - 1) {
		return null
	}

	return posts.at(currentIndex + 1) ?? null
}
