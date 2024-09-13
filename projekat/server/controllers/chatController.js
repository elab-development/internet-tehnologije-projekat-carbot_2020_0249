const User = require("../models/User");

// Kontroler za preuzimanje podataka o korisniku
const chat_index = (req, res) => {
  // Preuzmi ID korisnika sačuvanog od strane auth middleware-a
  const id = req.user.id;

  // Vrati podatke o korisniku osim lozinke
  User.findById(id)
    .select("-password") // Izbaci lozinku iz rezultata pretrage
    .then(user => res.json(user)) // Vrati podatke o korisniku kao JSON
    .catch(err => {
      // Ako dođe do greške, vrati status greške
      console.error(err.message);
      res.status(500).send("Server Error");
    });
};

module.exports = { chat_index };