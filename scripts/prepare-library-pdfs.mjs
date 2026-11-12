import { execFile } from 'node:child_process';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);
const output = 'library-files';
const maxBytes = 25 * 1024 * 1024;
const sources = JSON.parse(await readFile(new URL('./library-pdf-sources.json', import.meta.url), 'utf8'));
const ready = Object.create(null);
await mkdir(output, { recursive: true });

async function savePdf(book) {
  if (!/^[a-z0-9-]+$/.test(book.id) || !book.downloadUrl.startsWith('https://')) {
    throw new Error('Invalid book source: ' + book.id);
  }
  const destination = output + '/' + book.id + '.pdf';
  const temporary = destination + '.tmp';
  try {
    await run('curl', [
      '--fail', '--silent', '--show-error', '--location', '--max-redirs', '6',
      '--proto', '=https', '--proto-redir', '=https', '--max-time', '35',
      '--max-filesize', String(maxBytes), '--output', temporary, book.downloadUrl
    ]);
    const { size } = await stat(temporary);
    const bytes = await readFile(temporary);
    if (size < 1024 || size > maxBytes || bytes.subarray(0, 5).toString() !== '%PDF-' ||
        !bytes.subarray(-2048).includes(Buffer.from('%%EOF'))) {
      throw new Error('Source did not return a complete PDF within the Pages size limit');
    }
    await rename(temporary, destination);
    ready[book.id] = { catalogUrl: book.catalogUrl, source: book.source, license: book.license };
    console.log('Hosted PDF: ' + book.id + ' (' + size + ' bytes)');
  } catch (error) {
    console.warn('PDF unavailable: ' + book.id + ' — ' + error.message);
  } finally {
    await rm(temporary, { force: true });
  }
}

for (let index = 0; index < sources.length; index += 5) {
  await Promise.all(sources.slice(index, index + 5).map(savePdf));
}
if (!Object.keys(ready).length) throw new Error('No licensed library PDFs could be prepared');
await writeFile(output + '/manifest.js', 'window.MAIC_HOSTED_BOOKS = ' + JSON.stringify(ready) + ';\n');
console.log('Hosted library books: ' + Object.keys(ready).length);
