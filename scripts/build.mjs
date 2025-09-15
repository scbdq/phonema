import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';
import { transform } from 'lightningcss';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

async function rimraf(dir){
  await fs.rm(dir, { recursive: true, force: true });
}

async function ensure(dir){
  await fs.mkdir(dir, { recursive: true });
}

async function copyFileMinifyCSS(from, to){
  const css = await fs.readFile(from);
  const { code } = transform({ filename: from, code: css, minify: true });
  await ensure(path.dirname(to));
  await fs.writeFile(to, Buffer.from(code));
}

async function copyFile(from, to){
  await ensure(path.dirname(to));
  await fs.copyFile(from, to);
}

async function* walk(dir){
  for(const e of await fs.readdir(dir, { withFileTypes: true })){
    const fp = path.join(dir, e.name);
    if(['.git','node_modules','dist'].includes(e.name)) continue;
    if(e.isDirectory()) yield* walk(fp);
    else yield fp;
  }
}

async function build(){
  await rimraf(dist); await ensure(dist);
  // Copy and minify
  for await (const file of walk(root)){
    const rel = path.relative(root, file);
    const out = path.join(dist, rel);
    if(file.endsWith('.js')){
      const code = await fs.readFile(file, 'utf8');
      const r = await esbuild.transform(code, { minify: true, loader: 'js' });
      await ensure(path.dirname(out));
      await fs.writeFile(out, r.code, 'utf8');
    } else if(file.endsWith('.css')){
      await copyFileMinifyCSS(file, out);
    } else if(file.endsWith('.html')){
      // tiny html min: remove extra spaces/newlines
      const html = await fs.readFile(file, 'utf8');
      const min = html.replace(/>\s+</g,'><').replace(/\s{2,}/g,' ');
      await ensure(path.dirname(out));
      await fs.writeFile(out, min, 'utf8');
    } else {
      await copyFile(file, out);
    }
  }
  console.log('Build complete in', dist);
}

build().catch((e)=>{ console.error(e); process.exit(1); });

