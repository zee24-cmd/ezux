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
                'tailwindcss',
                'date-fns',
                'lucide-react',
                '@tanstack/react-table',
                '@tanstack/react-form',
                '@tanstack/react-virtual',
                '@tanstack/store',
                '@tanstack/react-store',
                '@tanstack/virtual-core',
                '@dnd-kit/core',
                '@dnd-kit/modifiers',
                '@dnd-kit/utilities',
                '@dnd-kit/sortable',
                'rrule',
                'dompurify',
                '@radix-ui/react-context-menu',
                '@radix-ui/react-dropdown-menu',
                '@radix-ui/react-label',
                '@radix-ui/react-radio-group',
                '@radix-ui/react-scroll-area',
                '@radix-ui/react-slot',
                '@radix-ui/react-switch',
                '@radix-ui/react-tooltip'
            ],
            output: {
                exports: 'named',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    tailwindcss: 'tailwindcss',
                    'date-fns': 'dateFns',
                    'lucide-react': 'lucide',
                    '@tanstack/react-table': 'ReactTable',
                    '@tanstack/react-form': 'ReactForm',
                    '@tanstack/react-virtual': 'ReactVirtual',
                    '@tanstack/store': 'TanstackStore',
                    '@tanstack/react-store': 'TanstackReactStore',
                    '@tanstack/virtual-core': 'TanstackVirtualCore',
                    '@dnd-kit/core': 'DndKitCore',
                    '@dnd-kit/modifiers': 'DndKitModifiers',
                    '@dnd-kit/utilities': 'DndKitUtilities',
                    '@dnd-kit/sortable': 'DndKitSortable',
                    'rrule': 'rrule',
                    'dompurify': 'DOMPurify'
                },
            },
        },
    },
});
