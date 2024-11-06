import React from "react"; // Uvozimo React biblioteku za kreiranje komponente.
import "./HeroSection.css"; // Uvozimo CSS stilove specifične za HeroSection komponentu.
import { Head, Para, Subs, CapsLetter } from "./HeroSectionElements"; 
// Uvozimo stilizovane komponente koje se koriste u HeroSection-u.
import image1 from "../../assets/images/courasel1.png"; 
import image2 from "../../assets/images/courasel2.png"; 
import image3 from "../../assets/images/courasel3.png"; 
import image4 from "../../assets/images/courasel4.png"; 
import image5 from "../../assets/images/courasel5.png"; 
// Uvozimo slike koje će se koristiti u karuselu.

import { StyledBtn } from "../../assets/styles/ButtonElements"; 
// Uvozimo stilizovano dugme.
import { useAuth } from "../../hooks/useAuth"; 
// Uvozimo custom hook za autentifikaciju kako bismo proverili da li je korisnik ulogovan i da li je admin.
import { Link } from "react-router-dom"; 
// Uvozimo komponentu Link iz react-router-dom za navigaciju između stranica.
import Slider from "react-slick"; 
// Uvozimo Slider komponentu iz slick-carousel za pravljenje karusela.
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
// Uvozimo stilove koji su potrebni za slick-carousel.

export default function HeroSection() { 
  // Definišemo funkcionalnu komponentu HeroSection.

  const { token, user } = useAuth(); 
  // Koristimo useAuth hook da dobijemo token i podatke o korisniku (npr. da li je admin).

  // Podesavanja za Slick karusel.
  const settings = {
    dots: false, // Isključujemo tačkice ispod karusela.
    infinite: true, // Omogućavamo beskonačno skrolovanje slika.
    speed: 500, // Brzina prelaza između slika.
    slidesToShow: 3, // Prikazujemo tri slike u isto vreme.
    centerMode: true, // Postavljamo središnji slajd u fokus.
    centerPadding: "0%", // Centriramo sliku bez dodatnih margina.
    slidesToScroll: 1, // Skrolujemo po jednu sliku.
    autoplay: true, // Karusel se automatski vrti.
    autoplaySpeed: 3000, // Brzina automatskog prelaza između slika je 3000ms (3 sekunde).
  };

  return (
    <>
      {user?.isAdmin ? ( 
        // Ako je korisnik admin, prikazujemo admin sekciju.
        <div>
          <Head>Welcome, <CapsLetter>Administrator</CapsLetter></Head> 
          {/* Naslov sa pozdravom za admina, koristeći stilizovanu komponentu CapsLetter za reč 'Administrator'. */}
          <Subs>Admin Dashboard</Subs> 
          {/* Podnaslov za admin stranicu. */}
          <Para>Manage users and view Data Analytics.</Para> 
          {/* Kratki opis opcija za admina. */}
          <Link to="/dashboard">
            <StyledBtn zero>Manage Users</StyledBtn> 
            {/* Dugme koje vodi admina ka dashboard-u za upravljanje korisnicima. */}
          </Link>
        </div>
      ) : (
        // Ako korisnik nije admin, prikazujemo korisničku sekciju.
        <div>
          <Head>Welcome to the <CapsLetter>Car Bot</CapsLetter></Head> 
          {/* Naslov koji pozdravlja korisnika, ističući reč 'Car Bot'. */}
          <Subs>Your Ultimate Automotive Assistant</Subs> 
          {/* Podnaslov koji opisuje Car Bot kao asistenta za automobile. */}
          <Para>
          Welcome to Car Bot, the innovative chatbot designed to transform your car ownership experience. Car Bot leverages cutting-edge AI technology to provide instant, accurate answers to all your automotive queries.
          </Para> 
          {/* Opis Car Bot-a koji koristi veštačku inteligenciju za pomoć korisnicima u vezi sa automobilima. */}
          <Link to={token ? "/chat" : "/register"}>
            <StyledBtn zero>Find the right car for you</StyledBtn> 
            {/* Dugme koje vodi korisnika ka chat-u ako je ulogovan, ili ka registraciji ako nije. */}
          </Link>
        </div>
      )}

      <div className="carousel-container"> 
        {/* Kontejner za karusel slika. */}
        <Slider {...settings}> 
          {/* Prikazujemo karusel koristeći Slick Slider sa podešavanjima. */}
          { [image1, image2, image3, image4, image5].map(img => (
            <div>
              <img src={img} alt="Carousel" className="carousel-image"/> 
              {/* Za svaku sliku iz niza, prikazujemo je unutar karusela. */}
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
