import logo from "../../assets/images/main.png"; // Uvoz slike logotipa
import { StyledBtn } from "../../assets/styles/ButtonElements"; // Uvoz stilizovanog dugmeta
import { useForm } from "react-hook-form"; // Uvoz hook-a za rad sa formama
import { Head, Form, Input, Formgroup, Linkspan, Footer, Para, Select } from "./FormElements"; // Uvoz stilizovanih elemenata forme
import { Container, Wrapper } from "../../assets/styles"; // Uvoz stilizovanih komponenti za kontejner i obuhvat
import { HandleImg, Logo } from "../HeroSection/HeroSectionElements"; // Uvoz stilizovanih elemenata za slike
import api from "../../api/posts"; // Uvoz API-a za slanje zahteva

export default function SignUp({ setisLoggedIn }) {
  const {
    register, // Funkcija za registraciju input polja
    handleSubmit, // Funkcija za obradu slanja forme
    formState: { errors }, // Oprema za greške u formi
  } = useForm(); // Inicijalizacija hook-a za rad sa formama

  // Funkcija koja se poziva prilikom slanja forme
  const onSubmit = async formData => {
    try {
      // Slanje POST zahteva za registraciju korisnika
      const response = await api.post("/users/register", formData);
      // Ako je registracija uspešna, prebacujemo se na prijavljenog korisnika
      setisLoggedIn(true);
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
    <>
      <Container> {/* Glavni kontejner za stranicu */}
        <Wrapper> {/* Obuhvat koji se koristi za stilizaciju */}
          <div>
            <Head style={{marginTop: "30px"}}>Create a new account</Head > {/* Naslov stranice */}
            
            {/* Forma za registraciju */}
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

              <Formgroup> {/* Grupa formi za ime */}
                <label>Name</label> {/* Labela za polje ime */}
                <Input
                  type="text" // Tip inputa je text
                  name="name" // Naziv polja
                  placeholder="Enter your name" // Placeholder za input
                  {...register("name", { // Registracija polja sa validacijom
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "Name cannot exceed more than 30 characters",
                    },
                  })}
                />
                <Para>{errors.name?.message}</Para> {/* Prikaz greške za ime */}
              </Formgroup>

              <Formgroup> {/* Grupa formi za lozinku */}
                <label>Password</label> {/* Labela za polje lozinka */}
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

              <Formgroup> {/* Grupa formi za polje gender */}
                <label>Gender</label> {/* Labela za polje gender */}
                <Select {...register("gender", { required: "Gender is required" })}>
                  <option value="Other">Other</option> {/* Opcija za "Other" */}
                  <option value="Male">Male</option> {/* Opcija za "Male" */}
                  <option value="Female">Female</option> {/* Opcija za "Female" */}
                </Select>
                <Para>{errors.gender?.message}</Para> {/* Prikaz greške za gender */}
              </Formgroup>

              <Formgroup> {/* Grupa formi za biografiju */}
                <label>Bio</label> {/* Labela za polje bio */}
                <Input
                  type="text" // Tip inputa je text
                  name="bio" // Naziv polja
                  placeholder="Enter your bio" // Placeholder za input
                  {...register("bio", { // Registracija polja sa validacijom
                    required: "Bio is required",
                    maxLength: {
                      value: 150,
                      message: "Bio cannot exceed more than 150 characters",
                    },
                  })}
                />
                <Para>{errors.bio?.message}</Para> {/* Prikaz greške za biografiju */}
              </Formgroup>

              <Formgroup> {/* Grupa formi za URL avatara */}
                <label>Avatar URL</label> {/* Labela za polje avatar URL */}
                <Input
                  type="text" // Tip inputa je text
                  name="avatar" // Naziv polja
                  placeholder="Enter avatar URL" // Placeholder za input
                  {...register("avatar", { // Registracija polja sa validacijom
                    required: "Avatar URL is required",
                    pattern: {
                      value: /^(ftp|http|https):\/\/[^ "]+$/,
                      message: "This is not a valid URL",
                    },
                  })}
                />
                <Para>{errors.avatar?.message}</Para> {/* Prikaz greške za avatar URL */}
              </Formgroup>

              <StyledBtn>Register</StyledBtn> {/* Stilizovano dugme za registraciju */}
            </Form>

            <Footer style={{marginBottom: "30px"}}> {/* Footer deo sa linkom za prijavu */}
              Already have an account?{" "}
              <Linkspan
                onClick={() => {
                  setisLoggedIn(true); // Poziv funkcije za prebacivanje na ekran prijave
                }}
                
              >
                Sign in
              </Linkspan>
            </Footer>
          </div>

          <HandleImg> {/* Obuhvat za prikaz slike logotipa */}
            <Logo src={logo} /> {/* Prikaz logotipa */}
          </HandleImg>
        </Wrapper>
      </Container>
    </>
  );
}
