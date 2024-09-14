import "./DashboardGUI.css"; // Uvozimo CSS fajl za stilizaciju komponente DashboardGUI.
import React, { Fragment, useState, useEffect } from "react"; // Uvozimo React biblioteku i hookove Fragment, useState i useEffect.
import api from "../../api/posts"; // Uvozimo API instance za slanje HTTP zahteva ka serveru (prilagodite putanju prema vašem projektu).

export default function DashboardGUI() { 
  // Definišemo funkcionalnu komponentu DashboardGUI.

  // Definišemo state-ove za korisnike, pretragu, sortiranje, filtriranje, uređivanje i paginaciju.
  const [users, setUsers] = useState([]); // Lista korisnika.
  const [searchTerm, setSearchTerm] = useState(""); // Tekst za pretragu korisnika po imenu.
  const [sortOrder, setSortOrder] = useState("ascending"); // Poredak korisnika prema broju poruka.
  const [genderFilter, setGenderFilter] = useState(""); // Filter za pol korisnika.
  const [editUserId, setEditUserId] = useState(null); // ID korisnika koji se trenutno uređuje.
  const [editUserData, setEditUserData] = useState({ name: "", email: "" }); // Podaci o korisniku koji se uređuju.
  const [currentPage, setCurrentPage] = useState(1); // Trenutna stranica za paginaciju.
  const usersPerPage = 2; // Broj korisnika po stranici.

  // Funkcija za dobijanje korisnika sa servera.
  const getUsers = async () => {
    try {
      const response = await api.get("/users"); // API zahtev za dobijanje liste korisnika.
      setUsers(response.data); // Postavljamo korisnike u state.
    } catch (error) {
      console.error("Error fetching users:", error); // Logujemo grešku ako dođe do problema prilikom dobijanja korisnika.
    }
  };

  // Funkcija za brisanje korisnika.
  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`); // API zahtev za brisanje korisnika.
      setUsers(users.filter((user) => user._id !== userId)); // Ažuriramo listu korisnika bez obrisanog korisnika.
    } catch (error) {
      console.error("Error deleting user:", error); // Logujemo grešku ako dođe do problema prilikom brisanja korisnika.
    }
  };

  // Funkcija za promenu podataka korisnika koji se uređuje.
  const handleEditChange = (e) => {
    const { name, value } = e.target; // Izvlačimo ime i vrednost iz polja koje se menja.
    setEditUserData({ ...editUserData, [name]: value }); // Ažuriramo podatke korisnika koji se uređuje.
  };

  // Funkcija za ažuriranje korisnika.
  const handleUpdate = async () => {
    try {
      await api.put(`/users/${editUserId}`, editUserData); // API zahtev za ažuriranje podataka korisnika.
      getUsers(); // Ponovo dobijamo ažuriranu listu korisnika.
      setEditUserId(null); // Resetujemo ID korisnika koji se uređuje.
      setEditUserData({ name: "", email: "" }); // Resetujemo formu za uređivanje korisnika.
    } catch (error) {
      console.error("Error updating user:", error); // Logujemo grešku ako dođe do problema prilikom ažuriranja korisnika.
    }
  };

  // useEffect za inicijalno dobijanje korisnika.
  useEffect(() => {
    getUsers(); // Pozivamo funkciju za dobijanje korisnika prilikom učitavanja komponente.
  }, []);

  // Filtriranje korisnika prema pretrazi po imenu i filtriranju po polu.
  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()); // Proveravamo da li ime korisnika sadrži tekst pretrage.
    const matchesGender = genderFilter === "" || user.gender === genderFilter; // Proveravamo da li pol odgovara filtriranju.
    return matchesSearchTerm && matchesGender; // Vraćamo samo korisnike koji zadovoljavaju oba uslova.
  });

  // Sortiranje korisnika prema broju poruka.
  const sortedUsers = filteredUsers.sort((a, b) => {
    const aMessages = a.messages.length; // Broj poruka za prvog korisnika.
    const bMessages = b.messages.length; // Broj poruka za drugog korisnika.
    if (sortOrder === "ascending") {
      return aMessages - bMessages; // Sortiranje uzlazno po broju poruka.
    } else {
      return bMessages - aMessages; // Sortiranje silazno po broju poruka.
    }
  });

  // Paginaranje korisnika.
  const indexOfLastUser = currentPage * usersPerPage; // Indeks poslednjeg korisnika na trenutnoj stranici.
  const indexOfFirstUser = indexOfLastUser - usersPerPage; // Indeks prvog korisnika na trenutnoj stranici.
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser); // Dobijamo korisnike za trenutnu stranicu.

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage); // Ukupan broj stranica.

  // Funkcija za konvertovanje podataka u CSV format.
  const convertToCSV = (data) => {
    const header = ['User Name', 'User Email', 'Gender', 'Number of Messages']; // Definišemo zaglavlje CSV fajla.
    const rows = data.map(user => [user.name, user.email, user.gender, user.messages.length]); // Kreiramo redove sa podacima korisnika.
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n'); // Spajamo redove u CSV format.
    return csvContent;
  };

  // Funkcija za eksportovanje podataka u CSV fajl.
  const exportToCSV = () => {
    const csvContent = convertToCSV(sortedUsers); // Pozivamo funkciju za konvertovanje podataka u CSV.
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); // Kreiramo Blob objekat sa CSV sadržajem.
    const link = document.createElement('a'); // Kreiramo link element.
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob); // Kreiramo URL za Blob.
      link.setAttribute('href', url); // Postavljamo href atribut za link.
      link.setAttribute('download', 'users.csv'); // Postavljamo ime fajla za preuzimanje.
      link.style.visibility = 'hidden'; // Sakrivamo link na stranici.
      document.body.appendChild(link); // Dodajemo link u DOM.
      link.click(); // Simuliramo klik za preuzimanje fajla.
      document.body.removeChild(link); // Uklanjamo link iz DOM-a nakon preuzimanja.
    }
  };

  return (
    <Fragment>
      <section className="dashboard">
        <header className="dashboard-header">
          <h1 className="header">Dashboard</h1>
        </header>

        <main className="dashboard-content">
          {/* Pretraga, sortiranje i filteri */}
          <div className="filter-bar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by user name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Ažuriramo pretragu po imenu.
                className="search-input"
              />
            </div>

            <div className="sort-bar">
              <label htmlFor="sortOrder" className="sortLabel">Sort by number of messages:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)} // Ažuriramo poredak korisnika.
                className="sort-select"
              >
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>

            <div className="gender-filter-bar">
              <label htmlFor="genderFilter" className="genderLabel">Filter by gender:</label>
              <select
                id="genderFilter"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)} // Ažuriramo filter po polu.
                className="gender-select"
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button onClick={exportToCSV} className="export-btn">Export to CSV</button> 
            {/* Dugme za izvoz korisnika u CSV fajl. */}
          </div>

          {/* Popup za uređivanje korisnika */}
          {editUserId && (
            <div className="edit-popup">
              <div className="edit-form">
                <h2 style={{marginBottom: "30px", color:"#fff"}}>Edit User</h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editUserData.name} // Polje za uređivanje imena korisnika.
                  onChange={handleEditChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editUserData.email} // Polje za uređivanje email-a korisnika.
                  onChange={handleEditChange}
                />
                <button onClick={handleUpdate}>Update User</button> 
                {/* Dugme za ažuriranje korisnika */}
                <button onClick={() => setEditUserId(null)}>Cancel</button> 
                {/* Dugme za otkazivanje uređivanja */}
              </div>
            </div>
          )}

          {/* Tabela sa korisnicima */}
          <table className="user-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Gender</th>
                <th>Number of Messages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-users-message">
                    No Data
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.messages.length}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditUserId(user._id); // Postavljamo ID korisnika za uređivanje.
                          setEditUserData({
                            name: user.name,
                            email: user.email
                          }); // Postavljamo podatke korisnika u formu za uređivanje.
                        }}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)} 
                        // Pozivamo funkciju za brisanje korisnika.
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Kontrole za paginaciju */}
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              // Dugme za prethodnu stranicu.
              disabled={currentPage === 1} 
              // Onemogućavamo dugme ako smo na prvoj stranici.
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-label">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              // Dugme za sledeću stranicu.
              disabled={currentPage === totalPages} 
              // Onemogućavamo dugme ako smo na poslednjoj stranici.
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </main>
      </section>
    </Fragment>
  );
}
