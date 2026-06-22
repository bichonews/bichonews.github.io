import './style.css';
import { PageFlip } from 'page-flip';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set worker source for PDF.js using the local module
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

async function init() {
  const url = 'BICHONEWS.pdf';
  const container = document.getElementById('book-container');
  const loading = document.getElementById('loading');

  try {
    // 1. Load the PDF
    const loadingTask = pdfjsLib.getDocument({ url: url });
    const pdf = await loadingTask.promise;

    const numPages = pdf.numPages;
    const pages = [];

    // We need to render the first page to get dimensions
    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1.5 });

    // 2. Render all pages into canvases
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const pageViewport = page.getViewport({ scale: 1.5 });

      const pageElement = document.createElement('div');
      pageElement.className = 'page';

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = pageViewport.height;
      canvas.width = pageViewport.width;

      pageElement.appendChild(canvas);
      container.appendChild(pageElement);

      const renderContext = {
        canvasContext: context,
        viewport: pageViewport
      };

      // Render page concurrently
      page.render(renderContext);
    }

    // 3. Initialize PageFlip
    loading.style.display = 'none';
    container.style.display = 'block';

    const pageFlip = new PageFlip(container, {
      width: viewport.width,
      height: viewport.height,
      size: 'stretch',
      // Força o modo de exibição de página única (retrato) usando um minWidth alto
      minWidth: 9999,
      maxWidth: 9999,
      minHeight: 100,
      maxHeight: 9999,
      drawShadow: true,
      showCover: false,
      usePortrait: true,
      mobileScrollSupport: false,
      maxShadowOpacity: 0.5,
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));
    
    // Remove os tamanhos forçados pela biblioteca que causam "zoom" gigante no mobile
    container.style.minWidth = '';
    container.style.maxWidth = '';
    container.style.minHeight = '';

    // Configura a navegação com as setas do teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        pageFlip.flipNext();
      } else if (e.key === 'ArrowLeft') {
        pageFlip.flipPrev();
      }
    });

  } catch (error) {
    console.error('Error loading PDF:', error);
    loading.innerHTML = '<p>Erro ao carregar o PDF.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading');

  loading.style.display = 'flex';
  init();
});
