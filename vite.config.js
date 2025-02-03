import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	kit: {
		files: {
		assets: 'src/lib'
		}
	},
	server: {
		host: true,
		port: 5173,
		strictPort: true,
	},
	json: { 
		stringify: false
	},
	assetsInclude:['**/*.json'],
	optimizeDeps: {
	}
});
