import React from "react"; // Uvoz React-a
import { useAuth } from "../../hooks/useAuth"; // Uvoz hook-a za autentifikaciju
import { Nav, NavLink, NavMenu, NavBtn, NavBtnLink, HandleLogo } from "./NavbarElements"; // Uvoz stilizovanih elemenata za navigaciju
import  logo  from "../../assets/images/logo.png";


export default function Navbar() {
  const { logoutUser, token, user } = useAuth(); // Dohvatanje funkcija i informacija o korisniku iz hook-a useAuth

  return (
    <Nav>
      {/* Link za početnu stranicu */}
      <NavLink to="/">
        <HandleLogo><img  src={logo} style={{height:"150px", width:"auto"}}/> <span>Car Bot</span></HandleLogo> {/* Prikaz logotipa ili naziva aplikacije */}
      </NavLink>
      <NavMenu>
        {/* Link za dijagrame */}
        <NavBtn>
        {token && user?.isAdmin && (
        <NavBtnLink to="/graphs">Data Diagrams</NavBtnLink>
      )}
        </NavBtn>
        {/* Link za stranicu "About Us" */}
        <NavBtn>
        { !user?.isAdmin && (
          <NavBtnLink to="/about-us">About Us</NavBtnLink>
          )}
        </NavBtn>
        {/* Link za prikaz profila, vidljiv samo za prijavljene korisnike koji nisu administratori */}
        <NavBtn>
          {token && !user?.isAdmin && (
            <NavBtnLink to="/profile">
              View profile
            </NavBtnLink>
          )}
        </NavBtn>
        {/* Link za odjavu, vidljiv samo za prijavljene korisnike */}
        <NavBtn>
          {token && (
            <NavBtnLink
              onClick={() => {
                logoutUser(); // Poziva funkciju za odjavu korisnika
              }}
              to="/"
            >
              Log out
            </NavBtnLink>
          )}
          {/* Link za prijavu ili registraciju, vidljiv samo za neprijavljene korisnike */}
          {!token && <NavBtnLink to="/register">Sign in</NavBtnLink>}
        </NavBtn>
      </NavMenu>
    </Nav>
  );
}
