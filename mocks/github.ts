import { promises as fs } from "fs"
import path from "node:path"
import { http, type DefaultRequestMultipartBody, type HttpHandler, HttpResponse } from "msw"
import {
	getLocalPath,
	GHContent,
	GHContentsDescription,
	hasMatchingGitHubRemote,
	lstat,
	notFoundResponse,
	readFile,
	toBase64,
} from "./github-utils"

function assertHasGitHubRemote(owner: string, repo: string) {
	if (hasMatchingGitHubRemote(owner, repo)) return

	const message = [
		`Refused to mock github repo: ${owner}/${repo}`,
		`If you want to return local files for this request, run "git remote add origin https://github.com/${owner}/${repo}.git"`,
		"If you want to return the actual GitHub response, remove this guard in mocks/github.ts",
	].join("\n")

	console.error(message)
	throw new Error(message)
}

const githubHandlers: Array<HttpHandler> = [
	// Get the content of a file or directory
	http.get<any, DefaultRequestMultipartBody>(
		`https://api.github.com/repos/:owner/:repo/contents/:path*`,
		async ({ params }) => {
			console.log("get contents", params)
			void assertHasGitHubRemote(params.owner, params.repo)

			const remotePath = decodeURIComponent(params.path.join("/")).trim()
			const localPath = getLocalPath(remotePath)
			const { isDirectory, isFile, size } = await lstat(localPath)

			if (isFile) {
				const content = await readFile(localPath)
				const sha = Buffer.from(remotePath).toString("hex")

				return HttpResponse.json({
					sha,
					node_id: `${remotePath}_node_id`,
					size,
					url: `https://api.github.com/repos/${params.owner}/${params.repo}/git/blobs/${sha}`,
					content: toBase64(content),
					encoding: "base64",
				} satisfies GHContent)
			}

			if (isDirectory) {
				const dirList = await fs.readdir(localPath)

				const contentDescriptions = await Promise.all(
					dirList.map(async (name): Promise<GHContentsDescription> => {
						const relativePath = path.join(remotePath, name)
						const sha = Buffer.from(relativePath).toString("hex")
						const fullPath = path.join(localPath, name)
						const { isDirectory, size } = await lstat(fullPath)
						return {
							name,
							path: relativePath,
							sha,
							size: isDirectory ? 0 : size,
							url: `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${relativePath}`,
							html_url: `https://github.com/${params.owner}/${params.repo}/tree/main/${relativePath}`,
							git_url: `https://api.github.com/repos/${params.owner}/${params.repo}/git/trees/${sha}`,
							download_url: null,
							type: isDirectory ? "dir" : "file",
							_links: {
								self: `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${relativePath}`,
								git: `https://api.github.com/repos/${params.owner}/${params.repo}/git/trees/${sha}`,
								html: `https://github.com/${params.owner}/${params.repo}/tree/main/${relativePath}`,
							},
						}
					}),
				)

				return HttpResponse.json(contentDescriptions)
			}

			return notFoundResponse()
		},
	),
	// Get the content of a blob
	http.get<any, DefaultRequestMultipartBody>(
		`https://api.github.com/repos/:owner/:repo/git/blobs/:sha`,
		async ({ params }) => {
			void assertHasGitHubRemote(params.owner, params.repo)

			const sha = Buffer.from(params.sha, "hex").toString("utf8")
			const relativePath = decodeURIComponent(sha).trim()
			const fullPath = getLocalPath(relativePath)
			const { isFile, size } = await lstat(fullPath)

			if (!isFile) return notFoundResponse()

			const content = await readFile(fullPath)

			return HttpResponse.json({
				sha,
				node_id: `${sha}_node_id`,
				size,
				url: `https://api.github.com/repos/${params.owner}/${params.repo}/git/blobs/${sha}`,
				content: toBase64(content),
				encoding: "base64",
			} satisfies GHContent)
		},
	),
]

export { githubHandlers }
