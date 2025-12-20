"use client"

import { createContext, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Slot } from "@radix-ui/react-slot"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const NavigableContext = createContext<
	| {
			href: string
			shouldPrefetch: boolean
	  }
	| undefined
>(undefined)

export function useNavigable() {
	const context = use(NavigableContext)
	if (context === undefined) {
		throw new Error("useNavigable must be used within a Navigable component")
	}
	return context
}

export function NavigableRoot({
	href,
	children,
	prefetch = "hover",
	asChild,
	...props
}: {
	href: string
	children: React.ReactNode
	asChild?: boolean
	prefetch?: "hover" | "viewport"
} & React.ComponentPropsWithoutRef<typeof Slot>) {
	"use client"
	const router = useRouter()
	const [shouldPrefetch, setShouldPrefetch] = useState(prefetch === "viewport")

	const Comp = asChild ? Slot : "div"

	return (
		<NavigableContext.Provider value={{ href, shouldPrefetch }}>
			<Comp
				className={cn("cursor-pointer", props.className)}
				onClick={() => router.push(href)}
				onMouseEnter={() => setShouldPrefetch(true)}
				{...props}
			>
				{children}
			</Comp>
		</NavigableContext.Provider>
	)
}

export function NavigableLink({
	children,
	...props
}: {
	children: React.ReactNode
} & Omit<React.ComponentProps<typeof Link>, "href" | "prefetch">) {
	"use client"

	const { href, shouldPrefetch } = useNavigable()

	return (
		<Link
			href={href}
			prefetch={shouldPrefetch ? true : false}
			onClick={(e) => e.stopPropagation()}
			{...props}
		>
			{children}
		</Link>
	)
}
