import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
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
	},
	build: {
		rollupOptions: {
			external: [],
			output: {
				// Copy JSON files to the build
				assetFileNames: (assetInfo) => {
					if (assetInfo.name?.endsWith('.json')) {
						return 'assets/[name][extname]';
					}
					return 'assets/[name]-[hash][extname]';
				}
			}
		}
	}
});
