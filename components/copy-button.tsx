"use client"

import { Button } from "@/components/ui/button"

export function CopyButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="p-1 size-7"
      aria-label="Copy snippet to clipboard"
      onClick={(e) => {
        const code = e.currentTarget.parentElement?.nextElementSibling?.textContent
        if (code) {
          navigator.clipboard.writeText(code)
        }
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        className="stroke-muted-foreground"
        viewBox="0 0 16 16"
      >
        <path d="M5.5 2h-2a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-2"></path>
        <path d="M6.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"></path>
      </svg>
    </Button>
  )
}
