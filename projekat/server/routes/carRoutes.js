const express = require('express'); 
// Uvozimo Express biblioteku za pravljenje web servera i API ruta.

const { getAllCars, insertCarData } = require('../controllers/carController'); 
// Uvozimo funkcije `getAllCars` i `insertCarData` iz kontrolera `carController`.
// Ove funkcije će rukovati zahtevima vezanim za podatke o automobilima.

const router = express.Router(); 
// Kreiramo Express router objekat koji će nam omogućiti definisanje API ruta.


// Ruta za dobijanje svih podataka o automobilima.
router.get('/', getAllCars); 
// Kada klijent pošalje GET zahtev na ovu rutu ('/'), pozvaće se funkcija `getAllCars` iz kontrolera.
// Ova funkcija bi trebalo da vraća listu svih automobila iz baze podataka.

module.exports = router; 
// Eksportujemo router kako bi mogao biti korišćen u drugim delovima aplikacije.
