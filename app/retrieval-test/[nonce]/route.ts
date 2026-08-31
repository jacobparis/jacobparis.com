import { createRetrievalProbeResponse } from "@/lib/retrieval-probe"

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ nonce: string }> },
) {
	const { nonce } = await params
	return createRetrievalProbeResponse(request, nonce)
}
