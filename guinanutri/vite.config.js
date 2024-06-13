import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080, // Ajout du port 8080
    proxy: {
      '/api': {
        target: 'https://guinanutri-9235c252beda.herokuapp.com',
        changeOrigin: true, // Ajoute cette ligne pour gérer les requêtes de proxy correctement
      },
    },
  },
  plugins: [react()],
});