import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "node:crypto"
import { after } from "next/server"
import { Buffer } from "node:buffer"
// Function to verify HMAC signature
async function verifySignature(
	payload: string,
	signature: string | null,
	secret: string,
): Promise<boolean> {
	if (!signature) return false

	// GitHub sends signatures as "sha256=<hash>"
	const signatureParts = signature.split("=")
	if (signatureParts.length !== 2) return false

	const [algorithm, hash] = signatureParts
	if (algorithm !== "sha256") return false

	// Compute HMAC of the payload
	const computedHash = crypto.createHmac("sha256", secret).update(payload).digest("hex")

	const a = Buffer.from(hash)
	const b = Buffer.from(computedHash)

	if (a.length !== b.length) return false
	if (!crypto.timingSafeEqual(new Uint8Array(a.buffer), new Uint8Array(b.buffer))) return false

	return true
}

function getSlugFromPath(path: string): string | null {
	const match = path.match(/^content\/(.+)\.mdx$/)
	return match ? match[1] : null
}

// Webhook endpoint to trigger cache tag revalidation
export async function POST(request: NextRequest) {
	const secret = process.env.REVALIDATE_SECRET

	if (!secret) {
		return NextResponse.json({ error: "REVALIDATE_SECRET not configured" }, { status: 500 })
	}

	const rawBody = await request.text()
	const signature = request.headers.get("x-hub-signature-256")

	// Verify HMAC signature
	const isValid = await verifySignature(rawBody, signature, secret)
	if (!isValid) {
		return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
	}

	const body = JSON.parse(rawBody)

	const ref = body.ref
	if (ref !== "refs/heads/main") {
		console.log("Ignoring push to branch:", ref)
		return NextResponse.json({
			revalidated: false,
			message: "Only main branch pushes trigger revalidation",
			branch: ref,
		})
	}

	const tagsToRevalidate = new Set<string>()
	let shouldRevalidateIndex = false

	for (const commit of body.commits || []) {
		const allFiles = [
			...(commit.added || []),
			...(commit.removed || []),
			...(commit.modified || []),
		]

		for (const file of allFiles) {
			const slug = getSlugFromPath(file)
			if (!slug) continue

			if ((commit.added || []).includes(file) || (commit.removed || []).includes(file)) {
				shouldRevalidateIndex = true
			}

			if ((commit.added || []).includes(file) || (commit.modified || []).includes(file)) {
				tagsToRevalidate.add(`post-${slug}`)
			}
		}
	}

	if (shouldRevalidateIndex) {
		console.log("Revalidating index with tag: posts-index")
		revalidateTag("posts-index", "max")
		after(async () => {
			await fetch(`${origin}/`, { method: "GET" })
		})
	}

	for (const tag of tagsToRevalidate) {
		console.log("Revalidating post with tag:", tag)
		revalidateTag(tag, "max")
		after(async () => {
			await fetch(`${origin}/post/${tag.replace("post-", "")}`, { method: "GET" })
		})
	}

	return NextResponse.json({
		revalidated: true,
		timestamp: new Date().toISOString(),
		tags: {
			index: shouldRevalidateIndex,
			posts: Array.from(tagsToRevalidate),
		},
	})
}
