#!/usr/bin/env node

// Custom ignore build step script for Vercel
// This prevents full deployments when only content files change

const { execSync } = require("child_process")

try {
  // Get the list of changed files
  const changedFiles = execSync("git diff --name-only HEAD~1 HEAD").toString().trim().split("\n")

  console.log("[v0] Changed files:", changedFiles)

  // Check if only content files changed
  const onlyContentChanged = changedFiles.every((file) => file.startsWith("content/"))

  if (onlyContentChanged && changedFiles.length > 0) {
    console.log("[v0] Only content files changed, skipping build")
    console.log("[v0] Cache component webhook should handle revalidation")
    process.exit(0) // Exit 0 = skip build
  }

  console.log("[v0] Code changes detected, proceeding with build")
  process.exit(1) // Exit 1 = proceed with build
} catch (error) {
  console.error("[v0] Error checking changed files:", error)
  // On error, proceed with build to be safe
  process.exit(1)
}
