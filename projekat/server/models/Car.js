const mongoose = require('mongoose'); 
// Uvozimo Mongoose biblioteku koja nam omogućava rad sa MongoDB bazom podataka.

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true }, 
  // Definišemo polje 'brand' koje je tipa String i obavezno (required: true).

  model: { type: String, required: true }, 
  // Polje 'model', koje predstavlja model automobila, je tipa String i obavezno.

  averageSellingPrice: { type: Number, required: true }, 
  // Polje 'averageSellingPrice' predstavlja prosečnu prodajnu cenu automobila. Tip je Number i polje je obavezno.

  fuelType: { type: String, required: true }, 
  // Polje 'fuelType' koje označava vrstu goriva, tip je String i polje je obavezno.

  transmission: { type: String, required: true }, 
  // Polje 'transmission' koje označava tip menjača (npr. automatski ili manuelni), tip je String i polje je obavezno.

  about: { type: String, required: true }  
  // Polje 'about' koje sadrži opis automobila, tip je String i polje je obavezno.
});

const Car = mongoose.model('Car', carSchema); 
// Kreiramo Mongoose model pod nazivom 'Car' koristeći prethodno definisani šablon `carSchema`.

module.exports = Car; 
// Eksportujemo model 'Car' da bi mogao biti korišćen u drugim delovima aplikacije.
