const sharp = require('sharp');
const fs = require('fs');

// on s'assure que le dossier images existe et s'il n'existe pas, on le crée
if (!fs.existsSync('images')) {
    fs.mkdirSync('images');
}

module.exports = (req, res, next) => {
    // s'il n'y a pas d'image dans la requête, on passe directement à la suite
    if (!req.file) {
        return next();
    }

    // on prend le nom d'origine, on remplace les espaces par des underscores (_), et on enlève l'ancienne extension (.jpg/.png)
    const name = req.file.originalname.split(' ').join('_').split('.')[0];
    // on ajoute la date exacte (en millisecondes) pour éviter les doublons, et on force l'extension .webp
    const filename = `${name}_${Date.now()}.webp`;

    // sharp pour redimenssioner et convertir le format
    sharp(req.file.buffer)
        .resize({ 
            width: 824,   
            height: 1040,  
            fit: 'cover' 
        })
        .webp({ quality: 90 }) // on convertit l'image en .webp  
        .toFile(`images/${filename}`) // on sauvegarde le résultat final physiquement dans le dossier images
        .then(() => {
            req.file.filename = filename;
            next(); 
        })
        .catch(error => {
            console.log("Erreur Sharp :", error);
            res.status(500).json({ error: "Erreur lors du traitement de l'image avec Sharp." });
        });
};