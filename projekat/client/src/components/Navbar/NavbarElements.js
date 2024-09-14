import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

export const Nav = styled.div`
background: radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%);
  height: 5rem;
  display: flex;
  justify-content: space-between;
  z-index: 10;
`;

export const NavLink = styled(Link)`
  color: #00c6bd;
  display: flex;
  align-items: center;
  font-weight: bold;
  text-decoration: none;
  padding: 0 1rem;
  cursor: pointer;
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -1.5px;
`;

export const NavBtn = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
`;

export const NavBtnLink = styled(Link)`
  border-radius: 0.25rem;
  background: #ff5252;
  padding: 0.625rem 1.375rem;
  color: #000;
  outline: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  border: 1rem;
  border-radius: 2rem;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`;
export const Navlogo = styled.img`
  width: 100%;
`;

export const HandleLogo = styled.div`
  max-width: 10rem;
  color: #ff5252;
  font-weight: bold;
  font-size: 2rem;
  margin-left: 1.5rem;
  display: flex; // Set display to flex
  align-items: center; // Center items vertically
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
  img {
    height: 50px; // Adjust height as needed
    width: auto;
    margin-right: 5px; // Reduced space between the logo and text
  }
  span {
    white-space: nowrap; // Prevent text from wrapping
    margin-left: -40px;
    margin-bottom: -15px;
    font-family: Protest Guerrilla;
  }
`;
export const YellowColor = styled.span`
  color: #f9f871;
`;
