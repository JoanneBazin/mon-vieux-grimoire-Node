const sharp = require("sharp");
const path = require("path");

async function resizeImage(file) {
  const extension = "webp";
  const filename =
    file.originalname.split(" ").join("_").split(".")[0] +
    Date.now() +
    "." +
    extension;
  const outputPath = path.join("images", filename);

  await sharp(file.buffer)
    .resize({ width: 700 })
    .toFormat(extension, { quality: 80 })
    .toFile(outputPath);
  return filename;
}

module.exports = resizeImage;
