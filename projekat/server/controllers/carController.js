const Car = require('../models/Car');  // Importuj Car model

// Funkcija za vracanje svih kola iz baze
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();  // Vrati sva kola iz baze
    res.status(200).json(cars);  // Posalji sva kola u JSON formatu 
  } catch (error) {
    console.error('Error fetching car data:', error);
    res.status(500).json({ message: 'Error fetching car data' });
  }
};

module.exports = {
  getAllCars,
};

