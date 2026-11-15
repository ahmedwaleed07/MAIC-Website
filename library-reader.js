const pdfDirectory = '/library-files/pdfjs/';
let renderer;

function loadRenderer() {
  renderer ??= import(pdfDirectory + 'pdf.min.mjs').then(pdfjs => {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfDirectory + 'pdf.worker.min.mjs';
    return pdfjs;
  });
  return renderer;
}

class MaicPdfReader extends HTMLElement {
  connectedCallback() {
    this.abort = new AbortController();
    this.open(this.abort.signal);
  }

  disconnectedCallback() {
    this.abort.abort();
    this.loadingTask?.destroy().catch(() => {});
  }

  async open(signal) {
    const status = this.querySelector('[data-pdf-status]');
    const canvas = this.querySelector('canvas');
    const controls = this.querySelector('.maic-pdf-controls');
    const previous = controls.querySelector('[data-pdf-previous]');
    const next = controls.querySelector('[data-pdf-next]');
    const pageLabel = controls.querySelector('output');
    const fail = () => {
      if (signal.aborted) return;
      status.textContent = this.dataset.error;
      status.hidden = false;
    };

    try {
      const file = this.dataset.file;
      if (!/^\/library-files\/[a-z0-9-]+\.pdf$/.test(file)) throw Error('Invalid book file');
      const [response, pdfjs] = await Promise.all([
        fetch(file, { signal, redirect: 'error', mode: 'same-origin' }),
        loadRenderer(),
      ]);
      if (!response.ok || !response.headers.get('Content-Type')?.startsWith('application/pdf')) {
        throw Error('Book PDF unavailable');
      }
      const data = await response.arrayBuffer();
      if (signal.aborted) return;
      this.loadingTask = pdfjs.getDocument({
        data, isEvalSupported: false,
        cMapUrl: pdfDirectory + 'cmaps/', cMapPacked: true,
        standardFontDataUrl: pdfDirectory + 'standard_fonts/', wasmUrl: pdfDirectory + 'wasm/',
        iccUrl: pdfDirectory + 'iccs/',
      });
      const book = await this.loadingTask.promise;
      let current = 1;

      const show = async number => {
        previous.disabled = next.disabled = true;
        try {
          const page = await book.getPage(number);
          if (signal.aborted) return;
          const width = Math.min(this.clientWidth || 800, 1000);
          const ratio = Math.min(devicePixelRatio, 2);
          const viewport = page.getViewport({ scale: width * ratio / page.getViewport({ scale: 1 }).width });
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          // Paint the book page without creating interactive link annotations.
          await page.render({ canvas, viewport, annotationMode: pdfjs.AnnotationMode.DISABLE }).promise;
          if (signal.aborted) return;
          current = number;
          pageLabel.textContent = current + ' / ' + book.numPages;
          previous.disabled = current <= 1;
          next.disabled = current >= book.numPages;
          status.hidden = true;
          controls.hidden = false;
          canvas.hidden = false;
        } catch {
          fail();
        }
      };

      previous.onclick = () => show(current - 1);
      next.onclick = () => show(current + 1);
      await show(current);
    } catch {
      fail();
    }
  }
}

customElements.define('maic-pdf-reader', MaicPdfReader);
