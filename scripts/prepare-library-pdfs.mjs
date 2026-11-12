import { execFile } from 'node:child_process';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);
const output = 'library-files';
const maxBytes = 25 * 1024 * 1024;
const sources = JSON.parse(await readFile(new URL('./library-pdf-sources.json', import.meta.url), 'utf8'));
const ready = Object.create(null);
const review = [];
await mkdir(output, { recursive: true });
await run('python3', ['-m', 'pip', 'install', '--quiet', '--target', '/tmp/maic-pdf-tools', 'pypdf[crypto]==6.1.3'], {timeout:120000});


async function savePdf(book) {
  if (!/^[a-z0-9-]+$/.test(book.id) || !book.downloadUrl.startsWith('https://')) {
    throw new Error('Invalid book source: ' + book.id);
  }
  if (!book.allowed && !book.reviewPublisher) {
    review.push({id:book.id,status:'permission-review'});
    return;
  }
  const destination = output + '/' + book.id + '.pdf';
  const temporary = destination + '.tmp';
  try {
    await run('curl', [
      '--fail', '--silent', '--show-error', '--location', '--max-redirs', '6',
      '--proto', '=https', '--proto-redir', '=https', '--max-time', '35',
      '--max-filesize', String(maxBytes), '--output', temporary, book.previousUrl || book.downloadUrl
    ]);
    const { size } = await stat(temporary);
    const bytes = await readFile(temporary);
    if (size < 1024 || size > maxBytes || bytes.subarray(0, 5).toString() !== '%PDF-' ||
        !bytes.subarray(-2048).includes(Buffer.from('%%EOF'))) {
      throw new Error('Source did not return a complete PDF within the Pages size limit');
    }
    if (!book.allowed) {
      const result = await run('python3', ['scripts/check-library-license.py', temporary], {
        env: { ...process.env, PYTHONPATH: '/tmp/maic-pdf-tools' }, timeout: 45000, maxBuffer: 2 * 1024 * 1024
      });
      const license = JSON.parse(result.stdout);
      if (!license.license) {
        review.push({id:book.id,status:'permission-unconfirmed'});
        return;
      }
      book.license = license.license;
    }
    await rename(temporary, destination);
    ready[book.id] = { catalogUrl: book.catalogUrl, source: book.source, license: book.license };
    review.push({id:book.id,status:'hosted',bytes:size});
    console.log('Hosted PDF: ' + book.id + ' (' + size + ' bytes)');
  } catch (error) {
    review.push({id:book.id,status:'download-failed'});
    console.warn('PDF unavailable: ' + book.id + ' — ' + error.message);
  } finally {
    await rm(temporary, { force: true });
  }
}

for (let index = 0; index < sources.length; index += 10) {
  await Promise.all(sources.slice(index, index + 10).map(savePdf));
}
if (Object.keys(ready).length < 17) throw new Error('No licensed library PDFs could be prepared');
await writeFile(output + '/manifest.js', 'window.MAIC_HOSTED_BOOKS = ' + JSON.stringify(ready) + ';\n');
console.log('Hosted library books: ' + Object.keys(ready).length);

await writeFile(output + '/availability.json', JSON.stringify(review, null, 2));
console.log('Library review: ' + JSON.stringify(review));
