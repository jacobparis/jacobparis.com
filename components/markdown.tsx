import {
  MdxComponents,
  Callout,
  ImageGrid,
  SideNote,
  Excerpt,
  Highlight,
  Tweet,
  YoutubeVideo,
  SocialBannerSmall,
} from "@/components/mdx-components"
import rehypePrettyCode from "rehype-pretty-code"

export async function Markdown({ source }: { source: string }) {
  const { MDXRemote } = await import("next-mdx-remote-client/rsc")

  return (
    <div className="prose max-w-none" style={{ counterReset: "footnote-counter 0" }}>
      <MDXRemote
        source={source}
				options={{
					mdxOptions: {
						rehypePlugins: [
							[
								rehypePrettyCode,
								{
									theme: "github-light",
									keepBackground: false,
								},
							],
						],
					},
				}}
        components={{
          ...MdxComponents,
          Callout,
          ImageGrid,
          SideNote,
          Excerpt,
          Highlight,
          Tweet,
          YoutubeVideo,
          SocialBannerSmall,
          em: Highlight,
        }}
      />
    </div>
  )
}
