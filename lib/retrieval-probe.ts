const sensitiveHeaderNamePattern =
	/authorization|cookie|token|secret|api[-_]?key|signature|sc-headers/i
const sensitiveHeaderValuePattern = /\b(?:bearer|basic)\s+|(?:^|[;,\s{"])(?:sig|signature)=/i

function sanitizeHeaders(headers: Headers) {
	return Object.fromEntries(
		[...headers.entries()]
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([name, value]) => [
				name,
				sensitiveHeaderNamePattern.test(name) || sensitiveHeaderValuePattern.test(value)
					? "[REDACTED]"
					: value,
			]),
	)
}

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;")
}

function selectFormat(request: Request) {
	const requestedFormat = new URL(request.url).searchParams.get("format")
	if (requestedFormat === "html" || requestedFormat === "markdown") return requestedFormat

	const accept = request.headers.get("accept")?.toLowerCase() ?? ""
	return accept.includes("text/markdown") ? "markdown" : "html"
}

export function createRetrievalProbeResponse(request: Request, nonce: string) {
	const requestId = crypto.randomUUID()
	const selectedFormat = selectFormat(request)
	const record = {
		requestId,
		receivedAt: new Date().toISOString(),
		method: request.method,
		url: request.url,
		nonce,
		selectedFormat,
		headers: sanitizeHeaders(request.headers),
	}

	console.info(`retrieval-test ${JSON.stringify(record)}`)

	const responseHeaders = {
		"Cache-Control": "private, no-store, max-age=0, must-revalidate",
		"CDN-Cache-Control": "no-store",
		"Vercel-CDN-Cache-Control": "no-store",
		"Surrogate-Control": "no-store",
		Vary: "Accept",
		"X-Content-Type-Options": "nosniff",
		"X-Probe-Request-Id": requestId,
		"X-Probe-Selected-Format": selectedFormat,
		"X-Robots-Tag": "noindex, noarchive, nosnippet",
	}

	if (selectedFormat === "markdown") {
		return new Response(
			`---\ntitle: Retrieval Reader Test\nrobots: noindex, noarchive, nosnippet\nrequest_id: ${requestId}\n---\n\n# Retrieval Reader Test\n\nThe server selected \`text/markdown\`.\n\n## Observed request\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\`\n`,
			{
				headers: {
					...responseHeaders,
					"Content-Type": "text/markdown; charset=utf-8",
				},
			},
		)
	}

	const serializedRecord = escapeHtml(JSON.stringify(record, null, 2))

	return new Response(
		`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, noarchive, nosnippet"><title>Retrieval Reader Test</title></head><body><main><h1>Retrieval Reader Test</h1><p>The server selected <code>text/html</code>.</p><h2>Observed request</h2><pre>${serializedRecord}</pre></main></body></html>`,
		{
			headers: {
				...responseHeaders,
				"Content-Type": "text/html; charset=utf-8",
			},
		},
	)
}
