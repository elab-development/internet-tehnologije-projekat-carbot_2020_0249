import styled from "styled-components";

export const Head = styled.div`
  font-size: 2rem;
  text-align: center;
  color: #ff5252;
`;

export const Select = styled.select`
  margin-top: 0.3rem;
  min-width: 25em;
  background-color: #d3d3d3;
  height: 2.5rem;
  padding: 0rem 0.6rem;
  font-size: 1rem;
  margin-bottom: 0.2rem;
  border: none;
  outline: none;
  border-radius: 1rem;
  transition: all 250ms ease-in-out;

  /* Optional: Add a focus style to enhance user experience */
  &:focus {
    background-color: #c0c0c0;
  }
`;

export const Form = styled.form`
  margin-top: 1.5rem;
  display: flex;
  color: #00c6bd;
  flex-direction: column;
`;

export const Formgroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.938rem;
  label {
    font-size: 1rem;
    color: #ff5252;
  }
`;

export const Input = styled.input`
  margin-top: 0.3rem;
  min-width: 25em;
  background-color: #d3d3d3;
  height: 2.5rem;
  padding: 0rem 0.6rem;
  font-size: 1rem;
  margin-bottom: 0.2rem;
  border: none;
  outline: none;
  border-radius: 1rem;

  transition: all 250ms ease-in-out;
`;

export const Para = styled.p`
  color: #fff7d6;
  font-size: 0.7rem;
`;
export const Linkspan = styled.span`
  color: #ff5252;
  &:hover {
    cursor: pointer;
  }
`;
export const Footer = styled.div`
  color: #ffff;
  font-size: 0.8rem;
`;
