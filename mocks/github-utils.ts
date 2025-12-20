import { promises as fs } from "fs"
import fsSync from "fs"
import { HttpResponse } from "msw"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export function getLocalPath(relativePath: string): string {
	return path.join(__dirname, "..", relativePath)
}

function resolveGitDir(cwd: string): string | null {
	const p = path.join(cwd, ".git")
	if (!fsSync.existsSync(p)) return null

	if (fsSync.statSync(p).isDirectory()) return p

	const m = fsSync.readFileSync(p, "utf8").match(/gitdir:\s*(.+)/)
	return m ? path.resolve(cwd, m[1]) : null
}

export function hasMatchingGitHubRemote(owner: string, repo: string, cwd = process.cwd()): boolean {
	const gitDir = resolveGitDir(cwd)
	if (!gitDir) return false

	const configPath = path.join(gitDir, "config")
	if (!fsSync.existsSync(configPath)) return false

	const text = fsSync.readFileSync(configPath, "utf8")

	const targetOwner = owner.toLowerCase()
	const targetRepo = repo.toLowerCase()

	const remoteRegex = /\[remote "[^"]+"\][\s\S]*?url\s*=\s*(.+)/g

	for (const m of text.matchAll(remoteRegex)) {
		const url = m[1].trim()

		const parsed = url.match(/github\.com[:/](?<owner>[^/]+)\/(?<repo>.+?)(\.git)?$/)

		if (!parsed?.groups) continue

		if (
			parsed.groups.owner.toLowerCase() === targetOwner &&
			parsed.groups.repo.toLowerCase() === targetRepo
		) {
			return true
		}
	}

	return false
}

export async function lstat(path: string) {
	try {
		const stats = await fs.lstat(path)
		return {
			isDirectory: stats.isDirectory(),
			isFile: stats.isFile(),
			size: stats.size,
		}
	} catch {
		return {
			isDirectory: false,
			isFile: false,
			size: 0,
		}
	}
}

export async function readFile(path: string) {
	return await fs.readFile(path, { encoding: "utf-8" })
}

export function toBase64(content: string) {
	return Buffer.from(content, "utf-8").toString("base64")
}

export function notFoundResponse() {
	return HttpResponse.json(
		{
			message: "Not found in local filesystem",
			documentation_url: "/mocks/github.ts",
		},
		{ status: 404 },
	)
}

export type GHContentsDescription = {
	name: string
	path: string
	sha: string
	size: number
	url: string
	html_url: string
	git_url: string
	download_url: string | null
	type: "dir" | "file"
	_links: {
		self: string
		git: string
		html: string
	}
}

export type GHContent = {
	sha: string
	node_id: string
	size: number
	url: string
	content: string
	encoding: "base64"
}
