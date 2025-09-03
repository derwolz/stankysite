module.exports = {
  apps: [
    {
      name: 'stankysite',
      script: 'build/index.js', // SvelteKit with adapter-node creates this
      instances: 1, // Changed from 'max' because SQLite doesn't work well with cluster mode
      exec_mode: 'fork', // Changed from 'cluster' because of SQLite
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Add any other environment variables your app needs
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_restarts: 10,
      restart_delay: 1000,
      // Auto-restart if memory usage exceeds 1GB
      max_memory_restart: '1G',
      // Watch for file changes in production (usually not recommended)
      watch: false,
      // Kill timeout
      kill_timeout: 5000
    }
  ],

  // Optional: deployment configuration
  deploy: {
    production: {
      user: 'www-data',
      host: 'valkyriextruck.com',
      ref: 'origin/master',
      repo: 'git@github.com:derwolz/stankysite.git',
      path: '/var/www/stankysite',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
