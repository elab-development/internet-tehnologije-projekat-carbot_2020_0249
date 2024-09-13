const Car = require('../models/Car');  // Uvozimo model Car iz MongoDB kolekcije koristeći Mongoose.
const axios = require('axios');  // Uvozimo Axios biblioteku za pravljenje HTTP zahteva.
require('dotenv').config();  // Uvozimo dotenv kako bismo pristupili promenljivama iz .env fajla.

// Wit.ai Bearer Token iz .env fajla.
const WIT_AI_TOKEN = process.env.WIT_AI_TOKEN;
// Unsplash API Access Key iz .env fajla.
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Funkcija za dobijanje podataka o automobilima direktno iz baze podataka koristeći Mongoose.
const fetchCarDataFromDB = async () => {
  try {
    const cars = await Car.find();  // Dohvatamo sve automobile iz MongoDB-a.
    return cars;
  } catch (error) {
    console.error('Error fetching car data from database:', error);  // U slučaju greške ispisujemo grešku.
    return [];  // Vraćamo prazan niz u slučaju greške.
  }
};

// Funkcija za formatiranje cene automobila sa dodatkom simbola evra (€).
const formatPrice = (price) => {
  return `${price} €`;  // Dodajemo simbol evra na kraj cene.
};

// Pomoćna funkcija za fleksibilno poređenje stringova (ignoriše velika i mala slova i uklanja prazne prostore).
const compareStrings = (str1, str2) => {
  return str1?.trim().toLowerCase() === str2?.trim().toLowerCase();
};

// Pomoćna funkcija za čišćenje naziva modela automobila uklanjanjem neželjenih karaktera.
const cleanCarModel = (model) => {
  return model.replace(/[?.]/g, '').trim().toLowerCase();  // Uklanjamo znakove "?" i ".", te prazne prostore.
};

// Funkcija za dobijanje slike automobila sa Unsplash API-ja.
const fetchCarImageFromUnsplash = async (carBrand, carModel) => {
  try {
    // Modifikujemo upit kako bismo uključili brend automobila.
    const searchQuery = `${carBrand} car`;

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: searchQuery,  // Koristimo modifikovani upit.
        client_id: UNSPLASH_ACCESS_KEY,
        per_page: 1  // Ograničavamo broj rezultata na jedan.
      }
    });

    const imageUrl = response.data.results[0]?.urls?.regular;  // Dohvatamo URL slike.
    return imageUrl ? imageUrl : null;  // Vraćamo URL slike ili null ako nije pronađena.
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);  // Ispisujemo grešku u slučaju neuspeha.
    return null;
  }
};

// Funkcija za procesiranje korisničke poruke i dobijanje odgovora koristeći Wit.ai i podatke iz baze.
const get_response = async (message) => {
  const url = `https://api.wit.ai/message?v=20240909&q=${encodeURIComponent(message)}`;
  try {
    // Korak 1: Pozivamo Wit.ai API da bismo dobili intent i entitete iz poruke.
    const witResponse = await axios.get(url, {
      headers: { Authorization: `Bearer ${WIT_AI_TOKEN}` }
    });

    console.log("Wit.ai Full Response:", JSON.stringify(witResponse.data, null, 2));

    const witData = witResponse.data;  // Podaci dobijeni od Wit.ai.
    const intent = witData.intents?.[0]?.name;  // Dohvatamo prvi prepoznati intent.
    let carBrand = witData.entities?.["car_brand:car_brand"]?.[0]?.value || null;  // Brend automobila.
    let carModel = witData.entities?.["car_model:car_model"]?.[0]?.value || null;  // Model automobila.

    // Čistimo naziv modela automobila uklanjanjem neželjenih karaktera.
    if (carModel) {
      carModel = cleanCarModel(carModel);  // Čistimo string modela automobila.
    }

    // Korak 2: Obrada 'car_image' intent-a.
    if (intent === 'car_image' && carBrand) {
      const imageUrl = await fetchCarImageFromUnsplash(carBrand, carModel);
      if (imageUrl) {
        // Vraćamo HTML img tag sa slikom automobila.
        return `<img src="${imageUrl}" alt="${carBrand} car" style="max-width:100%; height:auto;">`;
      } else {
        return `Sorry, I couldn't find an image for the ${carBrand}.`;
      }
    }

    // Korak 3: Dohvatanje podataka o automobilima direktno iz baze pomoću Mongoose-a za ostale intente.
    const cars = await fetchCarDataFromDB();

    // Obrada 'car_info', 'car_price' i deskriptivnih intente-a.
    if (carBrand && carModel) {
      // Pokušavamo da pronađemo odgovarajući automobil.
      const foundCar = cars.find(car =>
        compareStrings(car.brand, carBrand) &&
        compareStrings(car.model, carModel)
      );

      if (foundCar) {
        // Obrada 'car_price' intente-a (informacije o ceni).
        if (intent === 'car_price') {
          const formattedPrice = formatPrice(foundCar.averageSellingPrice);
          return `The price of the ${foundCar.brand} ${foundCar.model} is ${formattedPrice}.`;
        }

        // Obrada 'car_info' ili 'car_description' intente-a (informacije o automobilu).
        if (intent === 'car_info' || intent === 'car_description') {
          return `The ${foundCar.brand} ${foundCar.model} is a ${foundCar.fuelType} car with ${foundCar.transmission} transmission. ${foundCar.about}`;
        }
      }

      // Ako automobil nije pronađen, dajemo jasnu povratnu informaciju.
      return `Sorry, I don't have information about the ${carBrand} ${carModel}.`;
    }

    return "I'm not sure I understood that. Could you clarify?";
  } catch (error) {
    console.error("Error in Wit.ai API call:", error);  // Ispisujemo grešku u slučaju neuspešnog API poziva.
    return "Sorry, there was an error processing your request.";
  }
};

module.exports = { get_response }; 
// Eksportujemo funkciju get_response kako bi bila dostupna u drugim delovima aplikacije.
