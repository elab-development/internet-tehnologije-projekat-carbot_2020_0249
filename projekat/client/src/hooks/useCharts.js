import { useState, useEffect } from 'react'; 
// Uvozimo React-ove hookove `useState` i `useEffect` koji omogućavaju rad sa state-om i efektima u funkcionalnim komponentama.

import api from '../api/posts'; 
// Uvozimo `api` koji je pretpostavljeno lokalna postavka za pravljenje API zahteva.

const useCharts = () => { 
  // Definišemo custom hook pod nazivom `useCharts` koji će dohvatati podatke za grafikone.

  const [chartData, setChartData] = useState({}); 
  // Kreiramo state za čuvanje podataka o grafikonima, početna vrednost je prazan objekat.
  const [loading, setLoading] = useState(true); 
  // State za praćenje da li se podaci učitavaju (početna vrednost je `true` jer učitavanje počinje odmah).
  const [error, setError] = useState(null); 
  // State za čuvanje eventualne greške prilikom učitavanja podataka.

  useEffect(() => { 
    // Koristimo `useEffect` da bi funkcija bila pozvana kada se komponenta montira.

    const fetchData = async () => { 
      // Definišemo asinhronu funkciju za dohvaćanje podataka.
      setLoading(true); 
      // Postavljamo `loading` na `true` dok podaci nisu učitani.
      setError(null); 
      // Resetujemo eventualne greške pre svakog novog učitavanja.

      try {
        // Dohvatamo podatke o korisnicima za postojeće grafikone.
        const userResponse = await api.get(`/users`); 
        // API zahtev za dobijanje liste korisnika.
        const users = userResponse.data; 
        // Čuvamo dobijene korisnike u promenljivu `users`.
        
        // Računamo broj korisnika po polu koristeći `reduce`.
        const genderCounts = users.reduce((acc, user) => {
          acc[user.gender] = (acc[user.gender] || 0) + 1; 
          // Dodajemo pol korisnika u brojač, ako već postoji, uvećavamo vrednost.
          return acc;
        }, {});
        
        // Kreiramo podatke za `Pie` grafikon o raspodeli polova.
        const pieData = {
          labels: Object.keys(genderCounts), 
          // Oznake su različiti polovi.
          datasets: [{
            label: 'Gender Distribution', 
            // Labela grafika.
            data: Object.values(genderCounts), 
            // Podaci su broj korisnika po polovima.
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#36a2cc'], 
            // Boje za različite polove.
            hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#36a2cc'] 
            // Boje kada se pređe mišem preko grafikona.
          }]
        };

        // Kreiramo podatke za `Bar` grafikon koji prikazuje broj poruka po korisnicima.
        const barData = {
          labels: users.map(user => user.name), 
          // Korisnici su oznake na x-osi.
          datasets: [{
            label: 'Number of Messages', 
            // Labela grafikona.
            data: users.map(user => user.messages.length), 
            // Podaci su broj poruka po korisnicima.
            backgroundColor: '#ff5252', 
            // Boja grafikona.
            borderColor: 'rgba(186, 177, 177, 0.3)', 
            // Boja ivica.
            borderWidth: 1 
            // Debljina ivica.
          }]
        };

        // Dohvatamo podatke o automobilima sa servera.
        const carResponse = await api.get(`/cars`); 
        const cars = carResponse.data; 
        // Čuvamo podatke o automobilima u promenljivu `cars`.

        // Računamo broj modela po brendu koristeći `reduce`.
        const modelCountPerBrand = cars.reduce((acc, car) => {
          acc[car.brand] = (acc[car.brand] || 0) + 1; 
          // Dodajemo automobil brenda u brojač, ako već postoji, uvećavamo vrednost.
          return acc;
        }, {});
        
        // Kreiramo podatke za `Bar` grafikon o broju modela po brendu.
        const carModelsBarData = {
          labels: Object.keys(modelCountPerBrand), 
          // Oznake su različiti brendovi.
          datasets: [{
            label: 'Number of Models per Brand', 
            // Labela grafikona.
            data: Object.values(modelCountPerBrand), 
            // Podaci su broj modela po brendu.
            backgroundColor: '#ff5252', 
            // Boja grafikona.
            borderColor: 'rgba(186, 177, 177, 0.3)', 
            // Boja ivica.
            borderWidth: 1 
            // Debljina ivica.
          }]
        };

        const carBrands = ['TM', 'TSLA', 'F', 'HYMTF', 'BMWYY', 'HMC', 'NSANY', 'VWAGY', 'MBGYY']; 
        // Lista berzanskih oznaka za automobilske brendove.

        // Dohvatamo podatke o akcijama koristeći Finnhub API.
        const stockData = await Promise.all(
          carBrands.map(async (ticker) => {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINHUB_API_KEY}`);
            // Pravimo API zahtev za dobijanje trenutne cene akcija za svaki brend.
            const data = await response.json();
            
            const latestPrice = data.c; 
            // `c` sadrži trenutnu cenu akcija u Finnhub API-ju.
            return { ticker, price: parseFloat(latestPrice) }; 
            // Vraćamo berzansku oznaku i cenu akcija.
          })
        );

        // Kreiramo podatke za `Bar` grafikon o cenama akcija automobila.
        const stockBarData = {
          labels: stockData.map(stock => stock.ticker), 
          // Oznake su berzanske oznake brendova.
          datasets: [{
            label: 'Stock Prices (USD)', 
            // Labela grafikona.
            data: stockData.map(stock => stock.price), 
            // Podaci su cene akcija za svaki brend.
            backgroundColor: '#ff5252', 
            // Boja grafikona.
            borderColor: 'rgba(54, 162, 235, 1)', 
            // Boja ivica.
            borderWidth: 1 
            // Debljina ivica.
          }]
        };

        setChartData({ pieData, barData, carModelsBarData, stockBarData }); 
        // Postavljamo podatke o grafikonu u state.
        setLoading(false); 
        // Postavljamo `loading` na `false` nakon što su podaci učitani.
      } catch (error) {
        console.error("Error fetching data:", error); 
        // Logujemo grešku ako dođe do problema sa dobijanjem podataka.
        setError("Failed to load data"); 
        // Postavljamo grešku u state.
        setLoading(false); 
        // Završavamo učitavanje.
      }
    };

    fetchData(); 
    // Pozivamo `fetchData` da dohvatimo podatke prilikom učitavanja komponente.
  }, []);

  return { chartData, loading, error }; 
  // Vraćamo `chartData`, `loading` i `error` iz hook-a.
};

export default useCharts; 
// Eksportujemo `useCharts` kako bi mogao biti korišćen u drugim delovima aplikacije.
