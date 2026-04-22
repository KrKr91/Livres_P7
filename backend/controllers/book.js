const Book = require('../models/Book');
const fs = require('fs');

// nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  
  // on supprime l'ID envoyé par le front (mongodb va en créer un nv)
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
      ...bookObject,
      userId: req.auth.userId, 
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      
      // si pas de note au début
      ratings: bookObject.ratings ? bookObject.ratings : [],
      averageRating: bookObject.averageRating ? bookObject.averageRating : 0
  });

  book.save()
      .then(() => { res.status(201).json({ message: 'Livre enregistré !' })})
      .catch(error => { res.status(400).json({ error })});
};

// récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find() 
    .then(books => res.status(200).json(books)) 
    .catch(error => res.status(400).json({ error }));
};

// 3 meilleures notes
exports.getBestRating = (req, res, next) => {
  Book.find()
      .sort({ averageRating: -1 }) 
      .limit(3) 
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
};

// récupérer un seul livre grâce à son ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) 
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// modifier livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }; 

  delete bookObject._userId; 

  Book.findOne({_id: req.params.id})
      .then((book) => {
        //  vérification si l'ID de celui qui a créé le livre est différent de l'ID de celui qui est connecté
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message: 'Non autorisé !' });
          } else {
              Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Livre modifié avec succès !' }))
                  .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
        // vérif si c'est le bon utilisateur
          if (book.userId != req.auth.userId) {
              res.status(403).json({message: 'Non autorisé !'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              
            // fs.unlink va effacer l'image du dossier images
              fs.unlink(`images/${filename}`, () => {
                // on supprime définitivement le livre de la base de données
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};


// note moyenne livre
exports.rateBook = (req, res, next) => {
    // on vérifie que la note est bien entre 0 et 5
    if (req.body.rating < 0 || req.body.rating > 5) {
        return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5 !' });
    }

    Book.findOne({ _id: req.params.id })
        .then(book => {
            // on vérifie si l'utilisateur a déjà noté ce livre
            const hasAlreadyRated = book.ratings.find(rating => rating.userId === req.auth.userId);
            if (hasAlreadyRated) {
                return res.status(400).json({ message: 'Tu as déjà noté ce livre !' });
            }

            // on ajoute la nouvelle note au tableau ratings
            book.ratings.push({
                userId: req.auth.userId,
                grade: req.body.rating
            });

            // calcul moyenne note
            const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
            book.averageRating = Math.round((totalRatings / book.ratings.length) * 10) / 10;

            return book.save();
        })
        .then(updatedBook => res.status(200).json(updatedBook))
        .catch(error => res.status(400).json({ error }));
};