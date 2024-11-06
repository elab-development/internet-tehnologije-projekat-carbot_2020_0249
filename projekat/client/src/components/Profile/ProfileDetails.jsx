import React, { useState, useEffect } from "react"; // Uvozimo React biblioteku i hook-ove useState i useEffect.
import { useAuth } from "../../hooks/useAuth"; // Uvozimo custom hook za autentifikaciju korisnika.
import api from "../../api/posts"; // Uvozimo API instance za komunikaciju sa serverom.
import "./ProfileDetails.css"; // Uvozimo CSS fajl za stilizaciju ProfileDetails komponente.

export default function ProfileDetails() {
  const [profile, setProfile] = useState({ bio: "", avatar: "" }); 
  // State za čuvanje trenutnog profila korisnika sa biografijom i avatarom.
  const [updatedProfile, setUpdatedProfile] = useState({ bio: "", avatar: "" }); 
  // State za ažurirane podatke o profilu.
  const [showModal, setShowModal] = useState(false); 
  // State za kontrolisanje prikaza modala (popup-a) za uređivanje profila.
  const { user } = useAuth(); 
  // Izvlačimo podatke o trenutnom korisniku koristeći useAuth hook.

  // Funkcija za dohvaćanje profila korisnika sa servera.
  const getProfile = async () => {
    try {
      const response = await api.get(`/profiles/${user.id}`); 
      // Dohvaćamo podatke o profilu korisnika koristeći njegov ID.
      setProfile(response.data); 
      // Postavljamo dobijene podatke o profilu u state.
    } catch (error) {
      console.error("Error fetching profile:", error); 
      // Logujemo grešku ako dođe do problema prilikom dohvaćanja podataka.
    }
  };

  // useEffect se koristi za pozivanje getProfile funkcije kada se komponenta montira.
  useEffect(() => {
    getProfile(); // Pozivamo funkciju za dohvaćanje podataka o profilu kada se komponenta učita.
  }, []);

  // Funkcija koja se poziva kada korisnik klikne na dugme za uređivanje profila.
  const handleEditClick = () => {
    setUpdatedProfile({ ...profile }); 
    // Postavljamo trenutne podatke o profilu u state za ažuriranje.
    setShowModal(true); 
    // Prikazujemo modal za uređivanje profila.
  };

  // Funkcija za rukovanje promenom vrednosti u input poljima za uređivanje.
  const handleInputChange = (e) => {
    const { name, value } = e.target; 
    // Dohvaćamo ime polja i vrednost iz događaja.
    setUpdatedProfile({ ...updatedProfile, [name]: value }); 
    // Ažuriramo odgovarajuću vrednost u state-u.
  };

  // Funkcija za čuvanje promena u profilu korisnika.
  const handleSave = async () => {
    try {
      await api.put(`/profiles/${user.id}`, updatedProfile); 
      // Šaljemo ažurirane podatke na server koristeći PUT zahtev.
      setProfile(updatedProfile); 
      // Postavljamo ažurirane podatke u state za prikazivanje.
      setShowModal(false); 
      // Zatvaramo modal nakon čuvanja promena.
    } catch (error) {
      console.error("Error updating profile:", error); 
      // Logujemo grešku ako dođe do problema prilikom ažuriranja podataka.
    }
  };

  return (
    <div className="profile-container"> 
      {/* Glavni kontejner za prikazivanje detalja o profilu korisnika. */}
      <div className="profile-avatar-container"> 
        {/* Kontejner za prikaz avatara korisnika. */}
        <img
          src={profile.avatar || "default-avatar.png"} 
          // Prikazujemo avatar korisnika ili podrazumevanu sliku ako avatar nije postavljen.
          alt="Avatar"
          className="profile-avatar" 
          // Stilizujemo sliku koristeći CSS klasu.
        />
      </div>

      <div className="profile-info"> 
        {/* Kontejner za prikaz informacija o korisniku. */}
        <div className="profile-name">{user.name}</div> 
        {/* Prikazujemo ime korisnika. */}

        <div className="details-container">
          <div className="detail-email">
            <div className="profile-label">Email</div> 
            {/* Labela za email korisnika. */}
            <p className="profile-email">{user.email}</p> 
            {/* Prikazujemo email korisnika. */}
          </div>
          <div className="detail-gender">
            <div className="profile-label">Gender</div> 
            {/* Labela za pol korisnika. */}
            <p className="profile-bio">{user.gender}</p> 
            {/* Prikazujemo pol korisnika. */}
          </div>
          <div className="detail-bio">
            <div className="profile-label">Bio</div> 
            {/* Labela za biografiju korisnika. */}
            <p className="profile-bio">{profile.bio}</p> 
            {/* Prikazujemo biografiju korisnika. */}
          </div>
        </div>

        <button style={{marginLeft: "-50px"}} className="edit-profile-info-button" onClick={handleEditClick}>
          Edit Profile Info
        </button> 
        {/* Dugme za uređivanje informacija o profilu. Kada se klikne, otvara se modal. */}

        {showModal && ( 
          // Ako je showModal true, prikazujemo modal za uređivanje profila.
          <div className="modal-background"> 
            {/* Pozadinska senka iza modala. */}
            <div className="modal-content"> 
              {/* Kontejner za sadržaj modala. */}
              <div className="modal-field">
                <label>Avatar URL:</label> 
                {/* Labela za unos URL-a avatara. */}
                <input
                  type="text"
                  name="avatar"
                  value={updatedProfile.avatar} 
                  // Vrednost je trenutni avatar koji korisnik uređuje.
                  onChange={handleInputChange} 
                  // Pozivamo funkciju za ažuriranje vrednosti kada korisnik unese tekst.
                  placeholder="Enter new avatar URL" 
                  // Placeholder za unos avatara.
                  style={{width:'350px', height:'50px', fontSize:'18px'}} 
                  // Stilizujemo input polje.
                />
              </div>
              <div className="modal-field">
                <label>Bio:</label> 
                {/* Labela za unos biografije. */}
                <textarea
                  name="bio"
                  value={updatedProfile.bio} 
                  // Vrednost je trenutna biografija koja se uređuje.
                  onChange={handleInputChange} 
                  // Ažuriramo vrednost biografije kada korisnik unosi tekst.
                  placeholder="Enter your bio" 
                  // Placeholder za unos biografije.
                  style={{width:'350px', height:'200px', fontSize:'18px'}} 
                  // Stilizujemo textarea polje.
                />
              </div>
              <div className="modal-buttons">
                <button onClick={handleSave}>Save Changes</button> 
                {/* Dugme za čuvanje promena u profilu. */}
                <button onClick={() => setShowModal(false)}>Cancel</button> 
                {/* Dugme za zatvaranje modala bez čuvanja promena. */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
