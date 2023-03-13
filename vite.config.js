import reactRefresh from '@vitejs/plugin-react-refresh';
import i18n from 'laravel-react-i18n/vite';

export default ({ command }) => ({
    base: command === 'serve' ? '' : '/build/',
    publicDir: 'fake_dir_so_nothing_gets_copied',
    build: {
        manifest: true,
        outDir: 'public/build',
        rollupOptions: {
            input: 'resources/js/app.js',
        },
    },
    plugins: [
        reactRefresh(),
        i18n(),
    ],
});