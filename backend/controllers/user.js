
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');// création d'un mot de passe fort // OWASP
const emailValidator = require("email-validator");

var passwordSchema = new passwordValidator()

passwordSchema
.is().min(8)                                    
.is().max(20)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits(2)                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123', 'motdepasse']); 

// inscription de l'utilisateur et cryptage du password

exports.signup = (req, res, next) => {

   if (!emailValidator.validate(req.body.email) ||!passwordSchema.validate(req.body.password)) {

      return res.status(400).json({ message: 'Vérifiez le format de votre adresse e-mail ou Votre mot de passe : Celui-ci doit comporter au moins 8 caractères, des majuscules, des minuscules et des chiffres'});
           
    } else if (emailValidator.validate(req.body.email) || passwordSchema.validate(req.body.password)) {
 
      bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash 
        });
        user.save() 
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    };
  };


  // connexion de l'utilisateur

  exports.login = (req, res, next) => {

      User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(405).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
