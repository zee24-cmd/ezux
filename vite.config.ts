import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'Ezux',
            fileName: (format) => `ezux.${format}.js`,
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'tailwindcss',
                'date-fns',
                'lucide-react',
                '@tanstack/react-table',
                '@tanstack/react-form',
                '@tanstack/react-virtual',
                '@dnd-kit/core',
                '@dnd-kit/modifiers',
                '@dnd-kit/utilities',
                'class-variance-authority',
                'clsx',
                'tailwind-merge',
                'rrule',
                'dompurify',
                '@dnd-kit/utilities',
                '@dnd-kit/modifiers'
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    tailwindcss: 'tailwindcss',
                    'date-fns': 'dateFns',
                    'lucide-react': 'lucide',
                    '@tanstack/react-table': 'ReactTable',
                    '@tanstack/react-form': 'ReactForm',
                    '@tanstack/react-virtual': 'ReactVirtual',
                    '@dnd-kit/core': 'DndKitCore',
                    '@dnd-kit/modifiers': 'DndKitModifiers',
                    '@dnd-kit/utilities': 'DndKitUtilities',
                    'class-variance-authority': 'cva',
                    'clsx': 'clsx',
                    'tailwind-merge': 'tailwindMerge',
                    'rrule': 'rrule',
                    'dompurify': 'DOMPurify'
                },
            },
        },
    },
});
