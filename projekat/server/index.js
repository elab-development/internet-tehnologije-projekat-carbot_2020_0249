// Ako aplikacija nije u produkciji, učitavamo .env fajl sa konfiguracijama
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); 
}

// Učitaj potrebne pakete
const fs = require('fs'); // Uvozimo 'fs' modul za rad sa fajlovima
const csv = require('csv-parser'); // Uvozimo 'csv-parser' za čitanje CSV fajlova
const Car = require('./models/Car'); // Uvozimo model 'Car' za rad sa automobilima u MongoDB bazi
const bcrypt = require("bcryptjs"); // Uvozimo bcryptjs za hashovanje lozinki
const express = require("express"); // Uvozimo Express za kreiranje aplikacije
const mongoose = require("mongoose"); // Uvozimo Mongoose za rad sa MongoDB bazom podataka
const morgan = require("morgan"); // Uvozimo morgan za logovanje HTTP zahteva
const bp = require("body-parser"); // Uvozimo body-parser za parsiranje tela HTTP zahteva
const jwt = require("jsonwebtoken"); // Uvozimo jsonwebtoken za rad sa JWT (JSON Web Tokens)
const cors = require("cors"); // Uvozimo cors za omogućavanje Cross-Origin Resource Sharing (CORS)
const User = require("./models/User"); // Uvozimo model User za rad sa korisnicima
const Message = require("./models/Message"); // Uvozimo model Message za rad sa porukama
const { get_response } = require("./handler/responseHandler"); // Uvozimo funkciju za generisanje odgovora iz 'responseHandler'

// Kreiramo Express aplikaciju
const app = express();

// Omogućavamo CORS za aplikaciju
app.use(cors());

// Kreiramo HTTP server koristeći Express aplikaciju
const http = require("http").createServer(app);

// Definišemo port na kojem aplikacija sluša (koristi PORT iz .env ili podrazumevani 5000)
const PORT = process.env.PORT || 5000;

// Definišemo URI za povezivanje sa MongoDB bazom podataka
const db = process.env.MONGO_URI;

// Funkcija za kreiranje admin korisnika
async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL; // Email admin korisnika iz .env fajla
    const existingAdmin = await User.findOne({ email: adminEmail }); // Proveravamo da li admin već postoji

    if (!existingAdmin) { // Ako admin ne postoji, kreiramo ga
      const salt = await bcrypt.genSalt(10); // Generišemo 'salt' za hashovanje lozinke
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt); // Hashujemo lozinku

      // Kreiramo novog admin korisnika
      const adminUser = new User({
        name: "Car Bot Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true, // Označavamo da je korisnik admin
      });

      await adminUser.save(); // Čuvamo admin korisnika u bazi
      console.log("Admin user created:", adminUser);
    } else {
      console.log("Admin user already exists"); // Ako admin korisnik već postoji
    }
  } catch (error) {
    console.error("Error creating admin user:", error); // U slučaju greške pri kreiranju admina
  }
}

// Funkcija za čitanje CSV fajla i unos podataka u bazu ako ne postoje
const insertCarDataFromCSV = async () => {
  const results = [];

  fs.createReadStream('./db/popular_car_data_500.csv') // Čitamo CSV fajl
    .pipe(csv()) // Koristimo 'csv-parser' da bi pročitali podatke
    .on('data', (data) => results.push(data)) // Dodajemo podatke u niz 'results'
    .on('end', async () => {
      for (const car of results) {
        const { brand, model, averageSellingPrice, fuelType, transmission, about } = car;  // Čitamo podatke o automobilu

        // Proveravamo da li automobil već postoji u bazi podataka
        const existingCar = await Car.findOne({ brand, model });
        if (!existingCar) {
          // Ako automobil ne postoji, unosimo ga u bazu
          const newCar = new Car({
            brand,
            model,
            averageSellingPrice: Number(averageSellingPrice),
            fuelType,
            transmission,
            about  // Dodajemo opis automobila
          });

          try {
            await newCar.save(); // Čuvamo novi automobil u bazi
            console.log(`Inserted car: ${brand} ${model}`);
          } catch (error) {
            console.error(`Error inserting ${brand} ${model}:`, error);
          }
        } else {
          console.log(`Car already exists: ${brand} ${model}`);
        }
      }
      console.log('CSV data processing completed.');
    });
};

// Konektovanje na bazu podataka
mongoose
  .connect(db) // Povezujemo se sa MongoDB bazom koristeći URI
  .then(async () => {
    console.log(`Database connected`);
    // Pozivamo funkciju za kreiranje admin korisnika
    await createAdminUser();
    // Unos podataka o automobilima iz CSV fajla
    await insertCarDataFromCSV();
    // Pokrećemo HTTP server na definisanom portu
    http.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
  })
  .catch((err) => console.log(err)); // U slučaju greške pri povezivanju sa bazom

// Inicijalizujemo Socket.io za komunikaciju u realnom vremenu
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000", // Dozvoljavamo CORS sa ove adrese (frontend adresa)
  },
});

// Rukovanje događajem kada se korisnik poveže
io.on("connection", (socket) => {
  console.log("User is connected");

  // Šaljemo poruku dobrodošlice kada se korisnik poveže
  socket.emit("message", "Welcome to the AI chatbot");

  // Osluškujemo dolazak poruka od klijenta
  socket.on("message", async (msg) => {
    try {
      const decoded = jwt.verify(msg.token, process.env.JWT_SECRET); // Verifikujemo JWT token
      const userId = decoded.id; // Dekodiramo ID korisnika iz tokena

      // Pozivamo funkciju 'get_response' da generiše odgovor koristeći Wit.ai
      const response = await get_response(msg.text);

      // Kreiramo objekat poruke za čuvanje u bazi
      const messageToAppend = { text: msg.text, response };

      // Čuvamo poruku i odgovor u bazi podataka
      const newMessage = new Message(messageToAppend);
      await newMessage.save();

      // Ažuriramo istoriju poruka korisnika u bazi
      await User.findByIdAndUpdate(userId, { $push: { messages: newMessage._id } });

      // Šaljemo odgovor nazad klijentu
      socket.emit("response", newMessage);
    } catch (error) {
      console.error("Error handling message:", error); // Logujemo grešku ako dođe do problema
      socket.emit("response", { text: "There was an error processing your request.", response: error.message });
    }
  });

  // Rukovanje događajem kada se korisnik diskonektuje
  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

// --- MIDDLEWARE ---
// Middleware za logovanje HTTP zahteva
app.use(morgan("dev"));

// Middleware za parsiranje JSON podataka
app.use(bp.json());
// Middleware za parsiranje URL enkodiranih podataka (form data)
app.use(bp.urlencoded({ extended: false }));

// Definisanje ruta za različite resurse
app.use("/users", require("./routes/userRoutes")); // Rute za korisnike
app.use("/chat", require("./routes/chatRoutes")); // Rute za chat
app.use("/messages", require("./routes/messageRoutes")); // Rute za poruke
app.use("/profiles", require("./routes/profileRoutes")); // Rute za profile
app.use('/cars', require('./routes/carRoutes')); // Rute za automobile
