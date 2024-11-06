import "./ChatGUI.css"; // Uvozimo CSS fajl za stilizaciju ove komponente.
import React, { Fragment, useState, useEffect } from "react"; // Uvozimo React biblioteku i korišćenje Fragmenta, useState i useEffect hookova.
import { io } from "socket.io-client"; // Uvozimo socket.io-client za real-time komunikaciju sa serverom putem WebSocket-a.
import { useAuth } from "../../hooks/useAuth"; // Uvozimo custom hook za autentifikaciju da bismo dobili korisnikov token.
import api from "../../api/posts"; // Uvozimo API instance za slanje HTTP zahteva.
import MessageList from "../MessageList"; // Uvozimo komponentu za prikazivanje liste poruka.
import { FaMicrophone, FaStopCircle } from "react-icons/fa"; // Uvozimo ikone za mikrofon i stop iz react-icons biblioteke.

let socket; // Globalna promenljiva za socket konekciju.

export default function ChatGUI() { // Definišemo funkcionalnu komponentu ChatGUI.

  const [messages, setMessages] = useState([]); // State za čuvanje liste poruka.
  const [inputMessage, setInputMessage] = useState(""); // State za unos korisničke poruke.
  const [isRecording, setIsRecording] = useState(false); // State za praćenje da li je trenutno u toku snimanje glasa.
  const [transcript, setTranscript] = useState(""); // State za čuvanje rezultata transkripcije govora u tekst.
  const { token } = useAuth(); // Izvlčimo token iz useAuth hook-a za autentifikaciju.

  let recognition; // Promenljiva koja će se koristiti za govor u tekst konverziju.

  const getMessages = async () => { 
    // Asinhrona funkcija koja dohvaća poruke sa servera.
    const response = await api.get("/chat", { 
      headers: {
        "x-auth-token": token, // Koristimo token iz autentifikacije za autorizaciju zahteva.
      },
    });
    const messageDetails = await Promise.all(
      response.data.messages.map(async (messageId) => { 
        // Za svaku poruku dohvaćamo njen detalj.
        const messageResponse = await api.get(`/messages/${messageId}`);
        return messageResponse.data; // Vraćamo podatke o poruci.
      })
    );
    setMessages(messageDetails); // Postavljamo listu poruka u state.
  };

  useEffect(() => { 
    // useEffect hook za inicijalnu postavku pri montaži komponente.
    socket = io("http://localhost:5000"); // Povezujemo se na WebSocket server na lokalnom hostu.
    getMessages(); // Pozivamo funkciju za dohvaćanje poruka.

    socket.on("response", (message) => { 
      // Kada server pošalje poruku nazad, ažuriramo listu poruka.
      setMessages((prevMessages) => [...prevMessages, message]); 
    });

    return () => { 
      // Funkcija za čišćenje kada se komponenta demontira.
      if (socket) {
        socket.disconnect(); // Diskonektujemo socket da sprečimo curenje memorije.
      }
    };
  }, []); // Prazan niz zavisnosti znači da se ovaj efekat pokreće samo jednom, pri montaži komponente.

  const handleSubmit = (e) => { 
    // Funkcija za rukovanje slanjem poruka.
    e.preventDefault(); // Sprečavamo podrazumevano ponašanje forme.
    const text = inputMessage || transcript; // Ako je transkript dostupan, koristi ga, inače koristi ručni unos.
    const userdata = { text, token }; // Kreiramo objekat sa tekstom poruke i korisničkim tokenom.
    socket.emit("message", userdata); // Emitujemo poruku putem socket-a.
    setInputMessage(""); // Resetujemo unos.
    setTranscript(""); // Resetujemo transkript.
  };

  const startRecording = () => { 
    // Funkcija za pokretanje snimanja glasa.
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) { 
      // Proveravamo da li browser podržava Web Speech API.
      alert("Your browser doesn't support speech recognition. Please use Chrome.");
      return;
    }

    setIsRecording(true); // Postavljamo state da je snimanje počelo.
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)(); // Inicijalizujemo API za prepoznavanje govora.
    recognition.continuous = true; // Omogućavamo kontinuirano slušanje govora.
    recognition.interimResults = true; // Omogućavamo prikaz privremenih rezultata.
    recognition.lang = 'en-US'; // Postavljamo jezik na engleski.

    recognition.onresult = (event) => { 
      // Funkcija za rukovanje rezultatima govorne transkripcije.
      let finalTranscript = ""; 
      for (let i = event.resultIndex; i < event.results.length; ++i) { 
        // Iteriramo kroz rezultate transkripcije.
        const transcript = event.results[i][0].transcript; 
        if (event.results[i].isFinal) { 
          // Ako je transkript konačan, dodajemo ga u finalTranscript.
          finalTranscript += transcript;
        }
      }
      setTranscript(finalTranscript); // Postavljamo konačan transkript u state.
      setInputMessage(finalTranscript); // Postavljamo transkript u input polje.
    };

    recognition.start(); // Pokrećemo prepoznavanje govora.
  };

  const stopRecording = () => { 
    setIsRecording(false); // Postavljamo da snimanje nije aktivno.
    if (recognition) {
      recognition.stop(); // Zaustavljamo prepoznavanje govora.
    }
  
  // Resetovanje mikrofon permisije pomoću reload-a
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      stream.getTracks().forEach(track => track.stop()); // Prekinite sve audio streamove
    })
    .catch((err) => {
      console.error('Failed to stop microphone', err);
    });

  };

  return (
    <Fragment>
      <section className="msger"> 
        {/* Sekcija za chat interfejs */}
        <header className="msger-header"></header> 
        {/* Prazan header za chat */}

        <main className="msger-chat">
          {messages && <MessageList messages={messages} />} 
          {/* Prikazujemo listu poruka koristeći komponentu MessageList */}
        </main>

        <form className="msger-inputarea" onSubmit={handleSubmit}> 
          {/* Forma za unos poruke */}
          <input
            type="text"
            name="text"
            className="msger-input"
            placeholder="Enter your message or start recording..."
            onChange={(e) => setInputMessage(e.target.value)} 
            // Ažuriramo state inputMessage kada korisnik unese tekst.
            value={inputMessage || transcript} 
            // Prikazujemo uneti tekst ili transkript.
          />

          {isRecording ? ( 
            // Ako je snimanje aktivno, prikazujemo dugme za zaustavljanje.
            <button
              type="button"
              className="msger-stop-btn"
              onClick={stopRecording} 
              // Dugme za zaustavljanje snimanja.
              style={{
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "red",
                border: "none",
              }}
            >
              <FaStopCircle color="#fff" size={50} /> 
              {/* Ikona za stop dugme */}
            </button>
          ) : (
            <button
              type="button"
              className="msger-microphone-btn"
              onClick={startRecording} 
              // Dugme za pokretanje snimanja.
              style={{
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ff5252",
                border: "none",
              }}
            >
              <FaMicrophone color="#000" size={50} /> 
              {/* Ikona za mikrofon */}
            </button>
          )}

          <button
            type="submit"
            className="msger-send-btn"
            disabled={!inputMessage && !transcript} 
            // Onemogućavamo dugme ako nema unosa ni transkripta.
          >
            Send
          </button>
        </form>

        {isRecording && ( 
          // Prikazujemo animaciju linija kada je snimanje aktivno.
          <div className="voice-visualizer">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        )}
      </section>
    </Fragment>
  );
}
