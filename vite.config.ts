import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
            rollupTypes: true,
        }),
        {
            name: 'copy-theme-vars',
            apply: 'build',
            async closeBundle() {
                const fs = await import('fs/promises');
                const srcPath = path.resolve(__dirname, 'src/theme-vars.css');
                const destPath = path.resolve(__dirname, 'dist/theme-vars.css');
                try {
                    await fs.copyFile(srcPath, destPath);
                } catch (err) {
                    console.error('Failed to copy theme-vars.css:', err);
                }
            }
        }
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        lib: {
            entry: {
                index: path.resolve(__dirname, 'src/index.ts'),
                scheduler: path.resolve(__dirname, 'src/components/EzScheduler/index.tsx'),
                kanban: path.resolve(__dirname, 'src/components/EzKanban/index.tsx'),
                layout: path.resolve(__dirname, 'src/components/EzLayout/index.tsx'),
                table: path.resolve(__dirname, 'src/components/EzTable/index.tsx'),
                treeview: path.resolve(__dirname, 'src/components/EzTreeView/index.tsx'),
                signature: path.resolve(__dirname, 'src/components/EzSignature/index.tsx'),
            },
            name: 'Ezux',
            fileName: (format, entryName) => format === 'es' ? `${entryName}.es.js` : `${entryName}.cjs`,
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@tanstack/react-table',
                '@tanstack/react-form',
                '@tanstack/react-virtual',
                '@tanstack/store',
                '@tanstack/react-store',
                '@tanstack/virtual-core',
                'rrule'
            ],
            output: {
                exports: 'named',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@tanstack/react-table': 'ReactTable',
                    '@tanstack/react-form': 'ReactForm',
                    '@tanstack/react-virtual': 'ReactVirtual',
                    '@tanstack/store': 'TanstackStore',
                    '@tanstack/react-store': 'TanstackReactStore',
                    '@tanstack/virtual-core': 'TanstackVirtualCore',
                    'rrule': 'rrule'
                },
            },
        },
    },
});
