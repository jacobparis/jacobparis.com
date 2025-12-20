import type { PostMetadata } from "@/lib/mdx"
import Link from "next/link"

export function NextPost({ post }: { post: PostMetadata | null }) {
	if (!post) return null

	return (
		<div className="flex-1">
			<div className="mt-2 text-base text-foreground font-medium">Next post</div>
			<Link
				prefetch={true}
				href={`/content/${post.slug}`}
				className="block text-2xl font-semibold text-foreground hover:text-accent transition-colors"
			>
				{post.title}
			</Link>
		</div>
	)
}
