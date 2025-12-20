import { setupServer } from "msw/node"
import { githubHandlers } from "./github"

/** @tutorial https://mswjs.io/ */
export const server = setupServer(...githubHandlers)
