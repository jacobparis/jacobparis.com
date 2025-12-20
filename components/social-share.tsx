import { headers } from "next/headers"

export async function SocialShare({ title, slug }: { title: string; slug: string }) {
	const url = `https://www.jacobparis.com/content/${slug}`

	const encodedTitle = encodeURIComponent(title)
	const encodedUrl = encodeURIComponent(url)

	return (
		<div className="flex-1 w-full">
			<div className="mt-2 text-base text-foreground font-medium">Share</div>
			<div className="mt-2 inline-flex space-x-1">
				<a
					href={`https://twitter.com/share?text=${encodedTitle}&url=${encodedUrl}`}
					target="_blank"
					rel="nofollow noopener noreferrer"
					className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
					aria-label="Share on Twitter"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
						/>
					</svg>
				</a>
				<a
					href={`https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedTitle}`}
					target="_blank"
					rel="nofollow noopener noreferrer"
					className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
					aria-label="Share on LinkedIn"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						fill="none"
						viewBox="0 0 18 18"
					>
						<path
							fill="currentColor"
							d="M0 1.29C0 .576.592 0 1.322 0h15.356C17.408 0 18 .577 18 1.29v15.42c0 .713-.592 1.29-1.322 1.29H1.322C.592 18 0 17.423 0 16.71zm5.56 13.778V6.94h-2.7v8.128zM4.21 5.83c.943 0 1.529-.623 1.529-1.404-.017-.798-.585-1.404-1.51-1.404S2.7 3.629 2.7 4.426c0 .78.586 1.404 1.493 1.404zm5.522 9.238v-4.54c0-.242.018-.485.09-.658.195-.485.64-.988 1.386-.988.978 0 1.368.745 1.368 1.838v4.348h2.701v-4.662c0-2.497-1.331-3.658-3.109-3.658-1.433 0-2.076.787-2.436 1.342v.028h-.018l.018-.028V6.94h-2.7c.034.763 0 8.128 0 8.128z"
						/>
					</svg>
				</a>
			</div>
		</div>
	)
}
