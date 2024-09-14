import logo from "../../assets/images/main.png"; // Uvoz slike logotipa
import { StyledBtn } from "../../assets/styles/ButtonElements"; // Uvoz stilizovanog dugmeta
import { useForm } from "react-hook-form"; // Uvoz hook-a za rad sa formama
import { Container, Wrapper } from "../../assets/styles"; // Uvoz stilizovanih komponenti za kontejner i obuhvat
import { useNavigate } from "react-router-dom"; // Uvoz hook-a za navigaciju
import { HandleImg, Logo } from "../HeroSection/HeroSectionElements"; // Uvoz stilizovanih elemenata za slike
import { Head, Form, Input, Formgroup, Linkspan, Footer, Para } from "./FormElements"; // Uvoz stilizovanih elemenata forme
import { useAuth } from "../../hooks/useAuth"; // Uvoz hook-a za autentifikaciju
import api from "../../api/posts"; // Uvoz API-a za slanje zahteva

export default function Login({ setisLoggedIn }) {
  const { loginUser } = useAuth(); // Uzimanje funkcije za prijavu iz hook-a za autentifikaciju
  let navigate = useNavigate(); // Inicijalizacija hook-a za navigaciju
  const {
    register, // Funkcija za registraciju input polja
    handleSubmit, // Funkcija za obradu slanja forme
    formState: { errors }, // Oprema za greške u formi
  } = useForm(); // Inicijalizacija hook-a za rad sa formama

  // Funkcija koja se poziva prilikom slanja forme
  const onSubmit = async formData => {
    try {
      // Slanje POST zahteva za prijavu korisnika
      const response = await api.post("/users/login", formData);
      console.log(response.data); // Ispis odgovora sa servera u konzolu
      loginUser(response.data); // Poziv funkcije za prijavu korisnika
      navigate("/"); // Navigacija na početnu stranicu nakon uspešne prijave
    } catch (err) {
      // Rukovanje greškama
      if (err.response && err.response.status === 409) {
        // Ako je greška 409, prikaz poruke iz odgovora servera
        alert(err.response.data.msg || 'An error occurred. Please try again.');
      } else {
        // Za sve druge greške, ispis poruke u konzolu
        console.log(`Error : ${err.message}`);
      }
    }
  };

  return (
    <Container> {/* Glavni kontejner za stranicu */}
      <Wrapper> {/* Obuhvat koji se koristi za stilizaciju */}
        <div>
          <Head>Access your account</Head> {/* Naslov stranice */}
          
          {/* Forma za prijavu */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Formgroup> {/* Grupa formi za email */}
              <label>Email</label> {/* Labela za polje email */}
              <Input
                type="email" // Tip inputa je email
                name="email" // Naziv polja
                placeholder="Enter your email" // Placeholder za input
                {...register("email", { // Registracija polja sa validacijom
                  required: "Email is required",
                  pattern: {
                    value: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
                    message: "This is not a valid email address",
                  },
                })}
              />
              <Para>{errors.email?.message}</Para> {/* Prikaz greške za email */}
            </Formgroup>

            <Formgroup> {/* Grupa formi za lozinku */}
              <label>Password</label> {/* Labela za polje lozinke */}
              <Input
                type="password" // Tip inputa je password
                name="password" // Naziv polja
                placeholder="Enter your password" // Placeholder za input
                {...register("password", { // Registracija polja sa validacijom
                  required: "Password is required",
                  minLength: {
                    value: 7,
                    message: "Password must be at least 7 characters",
                  },
                  maxLength: {
                    value: 15,
                    message: "Password cannot exceed more than 15 characters",
                  },
                })}
              />
              <Para>{errors.password?.message}</Para> {/* Prikaz greške za lozinku */}
            </Formgroup>

            <StyledBtn>Log in</StyledBtn> {/* Stilizovano dugme za prijavu */}
          </Form>

          <Footer> {/* Footer deo sa linkom za registraciju */}
            Don't have an account?{" "}
            <Linkspan
              onClick={() => {
                setisLoggedIn(false); // Poziv funkcije za prebacivanje na ekran registracije
              }}
            >
              Sign up
            </Linkspan>
          </Footer>
        </div>
        <HandleImg> {/* Obuhvat za prikaz slike logotipa */}
          <Logo  src={logo} /> {/* Prikaz logotipa */}
        </HandleImg>
      </Wrapper>
    </Container>
  );
}
