import { headers } from "next/headers"
import Link from "next/link"

export async function FakePostCard() {
  const headersList = await headers()
  const hostname = headersList.get("host") || ""
  const isV0 = hostname.includes("vusercontent.net")

  if (!isV0) return null

  return (
    <article className="group">
      <Link href="/fake-post" className="block">
        <h2 className="mt-3 group-hover:opacity-70 transition-opacity text-balance leading-tight text-2xl font-medium">
          v0 Preview Post
        </h2>
        <time className="text-sm text-muted-foreground block mt-0">
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <p className="text-base text-muted-foreground text-pretty leading-relaxed mt-2">
          This is a placeholder post visible only in the v0 preview environment since MDXRemote doesn't work here.
        </p>
      </Link>
    </article>
  )
}
