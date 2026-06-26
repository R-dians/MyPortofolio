const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

// Fungsi rekursif untuk mencari semua file gambar di direktori
function getFiles(dir, files_ = []) {
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      const ext = path.extname(name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        files_.push(name);
      }
    }
  }
  return files_;
}

async function compressImages() {
  console.log('Memulai pencarian file gambar di:', IMAGES_DIR);
  const files = getFiles(IMAGES_DIR);
  console.log(`Menemukan ${files.length} file gambar.`);

  for (const file of files) {
    const relativePath = path.relative(IMAGES_DIR, file);
    const sizeInBytes = fs.statSync(file).size;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

    console.log(`Processing: ${relativePath} (${sizeInMB} MB)`);

    // Tentukan aturan kompresi & resize berdasarkan nama/direktori file
    let maxWidth = 1200;
    let quality = 80;

    const lowerPath = relativePath.toLowerCase();

    if (lowerPath.includes('hero2')) {
      // Foto online avatar mini
      maxWidth = 200;
      quality = 80;
    } else if (lowerPath.includes('certificate')) {
      // Gambar sertifikat
      maxWidth = 800;
      quality = 75;
    } else if (lowerPath.includes('projects')) {
      // Thumbnail proyek
      maxWidth = 800;
      quality = 80;
    } else if (lowerPath.includes('about')) {
      // Foto profil about
      maxWidth = 800;
      quality = 80;
    } else if (lowerPath.includes('hero')) {
      // Foto utama hero
      maxWidth = 1200;
      quality = 80;
    }

    try {
      const tempOutFile = file + '.tmp';
      const ext = path.extname(file).toLowerCase();

      let pipeline = sharp(file);

      // Ambil metadata untuk cek apakah perlu diresize
      const metadata = await pipeline.metadata();
      if (metadata.width > maxWidth) {
        pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
      }

      // Format dan kualitas kompresi
      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality, progressive: true });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality, lossless: false });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ quality: quality - 10, compressionLevel: 8 });
      }

      await pipeline.toFile(tempOutFile);

      // Ganti file asli dengan file hasil kompresi
      fs.unlinkSync(file);
      fs.renameSync(tempOutFile, file);

      const newSize = fs.statSync(file).size;
      const newSizeInMB = (newSize / (1024 * 1024)).toFixed(3);
      const savings = ((1 - newSize / sizeInBytes) * 100).toFixed(1);

      console.log(`Success: ${relativePath} -> Now ${newSizeInMB} MB (Saved ${savings}%)`);
    } catch (err) {
      console.error(`Gagal memproses ${relativePath}:`, err);
    }
  }

  console.log('Selesai mengompresi semua gambar!');
}

compressImages();
