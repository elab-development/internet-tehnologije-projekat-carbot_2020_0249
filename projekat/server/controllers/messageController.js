const Message = require("../models/Message");

// Kontroler za preuzimanje poruke po ID-u
const get_message = async (req, res) => {
    try {
      // Pokušaj da pronađe poruku po ID-u
      const message = await Message.findById(req.params.id);
      if (!message) {
        // Ako poruka nije pronađena, vrati grešku
        return res.status(404).json({ msg: "Message not found" });
      }
      // Vrati pronađenu poruku kao odgovor
      res.json(message);
    } catch (err) {
      // Ako dođe do greške, loguj grešku i vrati odgovor sa greškom
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  };

// Izvoz kontrolera
module.exports = {
    get_message
};
