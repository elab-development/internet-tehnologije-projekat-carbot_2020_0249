import React from "react"; // Uvozimo React biblioteku koja nam omogućava korišćenje JSX sintakse i pravljenje komponenti.

import "./AboutUsGUI.css"; // Uvozimo CSS fajl sa stilovima specifičnim za ovu komponentu.
import gif from "../../assets/images/gif.gif"; // Uvozimo sliku (gif) koja će biti korišćena unutar komponente.

const AboutUsGUI = () => { // Definišemo funkcionalnu komponentu pod imenom AboutUsGUI.
  
  return (
    <section className="about-us"> 
     {/* Vraćamo JSX strukturu koja prikazuje sadržaj ove komponente unutar HTML 
    section elementa sa klasom "about-us".*/}
       <img style={{height:"500px", width:"1300px", borderRadius:"10%"}} src={gif} alt="Car Bot Interactive Model"></img> 
       {/* Prikazujemo sliku (gif) koja je uvezena ranije, sa zadatim stilovima za visinu, širinu i zaobljenost ivica. */}
      <header className="about-us-header"> 
        {/* HTML element <header> sa klasom "about-us-header", koji sadrži naslov sekcije. */}
        <h1 className="header">About Us</h1> 
        {/* Naslov "About Us" prikazan unutar <h1> elementa sa klasom "header". */}
      </header>

      <main className="about-us-content"> 
      {/* Glavni sadržaj stranice, unutar <main> elementa sa klasom "about-us-content". */}
     
        <div className="text-and-quote" > 
        {/* Div sa klasom "text-and-quote", verovatno za tekst i neki citat u okviru stranice. */}
          
            <span className="subheading"> Car Bot: First AI car picking assistant </span><br />
            {/* Tekstualni podnaslov koji opisuje Car Bot kao prvog AI asistenta za odabir automobila. */}
            </div>
           
            
            Car Bot is an innovative web application designed to revolutionize the way users access information about automobiles. Tailored specifically for car enthusiasts, buyers, and sellers, Car Bot leverages advanced artificial intelligence to provide immediate, accurate responses to a wide array of queries. Whether it's detailed specifications about car models, insights on vehicle maintenance, or the latest updates in the automotive industry, Car Bot ensures that all information is just a query away. Its user-friendly interface and responsive design make it accessible on a variety of devices, enhancing user experience by delivering pertinent
             information through a simple conversational format.<br /><br />
            {/* Opis aplikacije Car Bot, napisan u tekstualnom formatu. Objašnjava kako aplikacija koristi veštačku inteligenciju da pruži korisnicima informacije o automobilima. */}
        
      </main>
    </section>
  );
};
// Eksportujemo AboutUsGUI komponentu da bi mogla da bude korišćena u drugim delovima aplikacije.
export default AboutUsGUI; 

