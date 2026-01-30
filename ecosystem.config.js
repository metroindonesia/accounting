export const apps = [{
	name: 'core',
	script: './src/index.js',
    exec_mode: 'fork', // fork, cluster
    instances: '1', // 1, 2, 3, 4, max: gunakan semua core CPU
	watch: ['./src', '.env'], // yang akan dipantau
	ignore_watch: ['node_modules', 'public'], // Direktori yang diabaikan
	watch_delay: 1000, // Delay sebelum restart (ms)
}];