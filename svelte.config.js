import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
        // See https://svelte.dev/docs/kit/adapters for more information about adapters.
        adapter: adapter(),
        alias: {  // Added colon after alias
            '$lib': './src/lib'  // Fixed syntax
        }
    },
    preprocess: [
        vitePreprocess(), // Added vitePreprocess
        mdsvex({
            extensions: ['.md', '.svx']
        })
    ],
    extensions: [".svelte", ".svx", ".md", ".json"]
};

export default config;
