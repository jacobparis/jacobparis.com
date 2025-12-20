export function PostHeader({ title, timestamp }: { title: string; timestamp: string }) {
  return (
    <header>
      <h1 className="text-balance leading-tight font-medium text-2xl mt-0">{title}</h1>
      <time className="text-sm text-muted-foreground block mt-0">
        {new Date(timestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    </header>
  )
}
