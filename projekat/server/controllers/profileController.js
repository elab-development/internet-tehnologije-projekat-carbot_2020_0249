const Profile = require("../models/Profile");

// Kontroler za preuzimanje profila
const get_profile = async (req, res) => {
    try {
      // Pronađi profil korisnika po ID-u
      const profile = await Profile.findOne({ user: req.params.userId });
      if (!profile) return res.status(404).json({ error: "Profile not found" });
      // Vrati profil kao odgovor
      res.json(profile);
    } catch (error) {
      // Ako dođe do greške, vrati grešku
      res.status(500).json({ error: error.message });
    }
  };


const update_profile = async (req, res) => {
  const { bio, avatar } = req.body;
  const { userId } = req.params;

  try {
    // Nadji i azuriraj profil
    let profile = await Profile.findOneAndUpdate(
      { user: userId },
      { bio, avatar },
      { new: true }
    );

    // Ako ne postoji kreiraj novi profil
    if (!profile) {
      profile = new Profile({ user: userId, bio, avatar });
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Izvoz kontrolera
module.exports = {
    get_profile,
    update_profile
};
