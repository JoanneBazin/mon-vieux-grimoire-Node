const fs = require("fs");

const deleteImage = (filename) => {
  fs.unlink(`images/${filename}`, (err) => {
    if (err) console.log("Echec de la suppression de l'ancienne image: ", err);
  });
};

module.exports = deleteImage;
