import { defineConfig } from 'vite';

export default defineConfig({
  // Configura a base como './' para gerar caminhos relativos ao compilar,
  // permitindo que o site seja hospedado em qualquer subdiretório, como no GitHub Pages.
  base: './'
});
