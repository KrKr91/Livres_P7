const multer = require('multer');

// on demande à multer de garder le fichier en mémoire 
const storage = multer.memoryStorage();

module.exports = multer({ storage: storage }).single('image');