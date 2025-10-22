import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dtsPlugin from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    dtsPlugin({ tsconfigPath: './tsconfig.app.json' })
  ],
  build: {
    // Configure Vite for library mode
    lib: {
      // The entry point for your library (where you export components)
      entry: resolve(__dirname, 'src/index.ts'), // Adjust if your entry file is different
      name: 'PackageA', // A UMD global name for the library (optional but good practice)
      // Output file names (without hashes). Vite determines extensions based on formats.
      fileName: (format) => `index.${format === 'es' ? 'js' : format}`, 
      // Specify output formats. 'es' (ES Module) is standard for modern apps.
      // 'cjs' (CommonJS) might be needed for older Node environments.
      formats: ['es', 'cjs'], 
    },
    rollupOptions: {
      // Make sure to externalize dependencies that you don't want bundled
      // into your library (usually React, peer dependencies)
      external: ['react', 'react-dom'], 
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps (optional, mainly for UMD)
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    // Recommended: Generate source maps for debugging
    // sourcemap: true,
    // Optional: Empty the output directory before building
    emptyOutDir: true, 
  },
})
