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
        tsconfigPaths: true,
    },
    server: {
        forwardConsole: true,
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
                flow: path.resolve(__dirname, 'src/components/EzFlow/index.ts'),
                advanced: path.resolve(__dirname, 'src/advanced.ts'),
                'mock-services': path.resolve(__dirname, 'src/mock-services.ts'),
            },
            name: 'Ezux',
            fileName: (format, entryName) => format === 'es' ? `${entryName}.es.js` : `${entryName}.cjs`,
        },
        rollupOptions: {
            checks: {
                pluginTimings: false,
            },
            external: [
                /^react/,
                /^react-dom/,
                /^@tanstack/,
                /^@radix-ui/,
                /^@dnd-kit/,
                /^@xyflow/,
                'lucide-react',
                'framer-motion',
                'date-fns',
                'clsx',
                'tailwind-merge',
                'class-variance-authority',
                'rrule',
                'dompurify',
                'cmdk',
                'country-flag-icons',
                'react-resizable-panels'
            ],
            output: {
                exports: 'named',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                },
            },
        },
    },
});
