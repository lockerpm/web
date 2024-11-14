module.exports = {
  apps: [{
    name: 'cypass',
    script: './node_modules/nuxt/bin/nuxt.js',
    args: 'start ./src/renderer/',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_restarts: 2,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'development',
      CS_ENV: 'web'
    },
    env_production: {
      NODE_ENV: 'production',
      CS_ENV: 'web'
    },
    cwd: './',
    time: true
  }]
}
