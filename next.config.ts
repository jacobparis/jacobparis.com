import { NextConfig } from "next"

export default {
	cacheComponents: true,
	reactCompiler: true,
	typescript: {
		ignoreBuildErrors: true,
	},
} satisfies NextConfig
