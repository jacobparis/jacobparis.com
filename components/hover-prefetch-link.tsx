"use client"

import Link from "next/link"
import { useState } from "react"

export function HoverPrefetchLink({
	href,
	children,
	...props
}: {
	href: string
	children: React.ReactNode
} & Omit<React.ComponentProps<typeof Link>, "href" | "prefetch">) {
	const [active, setActive] = useState(false)

	return (
		<Link
			href={href}
			prefetch={active ? true : false}
			onMouseEnter={() => setActive(true)}
			{...props}
		>
			{children}
		</Link>
	)
}
