import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, Check, MapPin } from "lucide-react";
import { successToast } from "../utils/ToastNotfications";

const locationData = {
  Araria: [
    "Araria",
    "Bhargama",
    "Forbesganj",
    "Jokihat",
    "Kursakanta",
    "Narpatganj",
    "Palasi",
    "Raniganj",
    "Sikti",
  ],
  Arwal: ["Arwal", "Kaler", "Karpi", "Kurtha", "Sonbhadra Banshi Suryapur"],
  Aurangabad: [
    "Aurangabad",
    "Barun",
    "Daudnagar",
    "Deo",
    "Goh",
    "Haspura",
    "Kutumba",
    "Madanpur",
    "Nabinagar",
    "Obra",
    "Rafiganj",
  ],
  Banka: [
    "Amarpur",
    "Banka",
    "Barahat",
    "Belhar",
    "Bounsi",
    "Chandan",
    "Dhauraiya",
    "Fullidumar",
    "Katoria",
    "Rajoun",
    "Shambhuganj",
  ],
  Begusarai: [
    "Bachhwara",
    "Bakhri",
    "Ballia",
    "Barauni",
    "Begusarai",
    "Bhagwanpur",
    "Birpur",
    "Cheria Bariyarpur",
    "Chhaurahi",
    "Dandari",
    "Garhpura",
    "Khodawandpur",
    "Mansoorchak",
    "Matihani",
    "Nawkothi",
    "Sahebpur Kamal",
    "Shamho Akha Kurha",
    "Teghra",
  ],
  Bhagalpur: [
    "Bihpur",
    "Gopalpur",
    "Goradih",
    "Ismailpur",
    "Jagdishpur",
    "Kahalgaon",
    "Kharik",
    "Narayanpur",
    "Nathnagar",
    "Naugachhia",
    "Pirpainti",
    "Rangra Chowk",
    "Sabour",
    "Sanhaula",
    "Shahkund",
    "Sultanganj",
  ],
  Bhojpur: [
    "Agiaon",
    "Arrah",
    "Barhara",
    "Bihiyan",
    "Charpokhari",
    "Garhani",
    "Jagdishpur",
    "Koilwar",
    "Piro",
    "Sahar",
    "Sandesh",
    "Shahpur",
    "Tarari",
    "Udwantnagar",
  ],
  Buxar: [
    "Brahampur",
    "Buxar",
    "Chakki",
    "Chaugai",
    "Chausha",
    "Dumraon",
    "Itarhi",
    "Kesath",
    "Nawanagar",
    "Rajpur",
    "Simri",
  ],
  Darbhanga: [
    "Alinagar",
    "Bahadurpur",
    "Baheri",
    "Benipur",
    "Biraul",
    "Darbhanga",
    "Gaura Bauram",
    "Ghanshyampur",
    "Hanuman Nagar",
    "Hayaghat",
    "Jale",
    "Keoti",
    "Kiratpur",
    "Kusheshwar Asthan",
    "Kusheshwar Asthan Purbi",
    "Manigachhi",
    "Singhwara",
    "Tardih",
  ],
  "East Champaran": [
    "Adapur",
    "Areraj",
    "Banjaria",
    "Bankatwa",
    "Chakia",
    "Chhauradano",
    "Chiraiya",
    "Dhaka",
    "Ghorasahan",
    "Harsidhi",
    "Kalyanpur",
    "Kesaria",
    "Kotwa",
    "Madhuban",
    "Mehsi",
    "Motihari",
    "Paharpur",
    "Pakridayal",
    "Patahi",
    "Phenhara",
    "Piprakothi",
    "Ramgarhwa",
    "Raxaul",
    "Sangrampur",
    "Sugauli",
    "Tetaria",
    "Turkaulia",
  ],
  Gaya: [
    "Amas",
    "Atri",
    "BankeyBazar",
    "Barachatti",
    "Belaganj",
    "Bodhgaya",
    "Dobhi",
    "Dumaria",
    "Fatehpur",
    "Guraru",
    "Gurua",
    "Imamganj",
    "Khizarsarai",
    "Konch",
    "Manpur",
    "Mohanpur",
    "Mohra",
    "Nagar",
    "Neem Chak Bathani",
    "Paraiya",
    "Sherghati",
    "Tankuppa",
    "Tekari",
    "Wazirganj",
  ],
  Gopalganj: [
    "Baikunthpur",
    "Barauli",
    "Bhorey",
    "Bijaipur",
    "Gopalganj",
    "Hathua",
    "Katiya",
    "Kuchaikot",
    "Manjha",
    "Pachdeuri",
    "Phulwaria",
    "Sidhwalia",
    "Thawe",
    "Uchakagaon",
  ],
  Jamui: [
    "Barhat",
    "Chakai",
    "Gidhaur",
    "Islamnagar Aliganj",
    "Jamui",
    "Jhajha",
    "Khaira",
    "Lakshmipur",
    "Sikandra",
    "Sono",
  ],
  Jehanabad: [
    "Ghosi",
    "Hulasganj",
    "Jehanabad",
    "Kako",
    "Makhdumpur",
    "Modanganj",
    "Ratni Faridpur",
  ],
  Kaimur: [
    "Adhaura",
    "Bhabua",
    "Bhagwanpur",
    "Chainpur",
    "Chand",
    "Durgawati",
    "Kudra",
    "Mohania",
    "Nuaon",
    "Ramgarh",
    "Rampur",
  ],
  Katihar: [
    "Amdabad",
    "Azamnagar",
    "Balrampur",
    "Barari",
    "Barsoi",
    "Dandkhora",
    "Falka",
    "Hasanganj",
    "Kadwa",
    "Katihar",
    "Korha",
    "Kursela",
    "Manihari",
    "Mansahi",
    "Pranpur",
    "Sameli",
  ],
  Khagaria: [
    "Alauli",
    "Beldaur",
    "Chautham",
    "Gogri",
    "Khagaria",
    "Mansi",
    "Parbatta",
  ],
  Kishanganj: [
    "Bahadurganj",
    "Dighalbank",
    "Kishanganj",
    "Kochadhaman",
    "Pothia",
    "Terhagachh",
    "Thakurganj",
  ],
  Lakhisarai: [
    "Barahiya",
    "Chanan",
    "Halsi",
    "Lakhisarai",
    "Pipariya",
    "Ramgarh Chowk",
    "Surajgarha",
  ],
  Madhepura: [
    "Alamnagar",
    "Bihariganj",
    "Chausa",
    "Ghailadh",
    "Ghamharia",
    "Gualpara",
    "Kumarkhand",
    "Madhepura",
    "Murliganj",
    "Puraini",
    "Shankarpur",
    "Singheshwar",
    "Udakishunganj",
  ],
  Madhubani: [
    "Andhratharhi",
    "Babubarhi",
    "Basopatti",
    "Benipatti",
    "Bisfi",
    "Ghoghardiha",
    "Harlakhi",
    "Jainagar",
    "Jhanjharpur",
    "Kaluahi",
    "Khajauli",
    "Khutauna",
    "Ladaniya",
    "Lakhnaur",
    "Laukahi",
    "Madhepur",
    "Madhwapur",
    "Pandaul",
    "Phulparas",
    "Rahika",
    "Rajnagar",
  ],
  Munger: [
    "Asarganj",
    "Bariarpur",
    "Dharhara",
    "Haveli Kharagpur",
    "Jamalpur",
    "Sadar Munger",
    "Sangrampur",
    "Tarapur",
    "Tetiya Bambar",
  ],
  Muzaffarpur: [
    "Aurai",
    "Bandra",
    "Bochaha",
    "Gayghat",
    "Kanti",
    "Katra",
    "Kurhani",
    "Marwan",
    "Minapur",
    "Motipur",
    "Muraul",
    "Mushahari",
    "Paroo",
    "Sahebganj",
    "Sakra",
    "Saraiya",
  ],
  Nalanda: [
    "Asthawan",
    "Ben",
    "Biharsharif",
    "Bind",
    "Chandi",
    "Ekangarsarai",
    "Giriyak",
    "Harnaut",
    "Hilsa",
    "Islampur",
    "Karai Parsurai",
    "Katrisarai",
    "Nagar Nausa",
    "Noorsarai",
    "Parbalpur",
    "Rahui",
    "Rajgir",
    "Sarmera",
    "Silao",
    "Tharthari",
  ],
  Nawada: [
    "Akbarpur",
    "Gobindpur",
    "Hisua",
    "Kashichak",
    "Kawakol",
    "Meskaur",
    "Nardiganj",
    "Narhat",
    "Nawada",
    "Pakribarawan",
    "Rajauli",
    "Roh",
    "Sirdala",
    "Warisaliganj",
  ],
  Patna: [
    "Athmalgola",
    "Bakhtiarpur",
    "Barh",
    "Belchhi",
    "Bihta",
    "Bikram",
    "Danapur",
    "Daniawan",
    "Dhanarua",
    "Dulhin Bajar",
    "Fatuha",
    "Ghoswari",
    "Khusrupur",
    "Maner",
    "Masaurhi",
    "Mokama",
    "Naubatpur",
    "Paliganj",
    "Pandarak",
    "Patna Sadar",
    "Patna Sadar (City)",
    "Phulwari Sharif",
    "Punpun",
    "Sampatchak",
  ],
  Purnia: [
    "Amour",
    "Baisa",
    "Banmankhi",
    "Barahara Kothi",
    "Bhawanipur",
    "Dagarua",
    "Dhamdaha",
    "Jalalgarh",
    "Kasba",
    "Krityanand Nagar",
    "Purnia Purw",
    "Rupauli",
    "Srinagar",
    "Baisi",
  ],
  Rohtas: [
    "Akorhi Gola",
    "Bikramganj",
    "Chenari",
    "Dawath",
    "Dehri",
    "Dinara",
    "Karakat",
    "Kargahar",
    "Kochas",
    "Nasriganj",
    "Nauhatta",
    "Nokha",
    "Rajpur",
    "Rohtas",
    "Sanjhauli",
    "Sasaram",
    "Sheosagar",
    "Surajpura",
    "Tilouthu",
  ],
  Saharsa: [
    "Banma Itahri",
    "Kahara",
    "Mahishi",
    "Nauhatta",
    "Patarghat",
    "Salkhua",
    "Sattar Kataiya",
    "Simri Bakhtiarpur",
    "Sonbarsha",
    "Sour Bazar",
  ],
  Samastipur: [
    "Bibhutipur",
    "Bithan",
    "Dalsinghsarai",
    "Hasanpur",
    "Kalyanpur",
    "Khanpur",
    "Mohanpur",
    "Mohiuddinnagar",
    "Morwa",
    "Patori",
    "Pusa",
    "Rosera",
    "Samastipur",
    "Sarairanjan",
    "Shivajinagar",
    "Singhia",
    "Tajpur",
    "Ujiarpur",
    "Vidyapati Nagar",
    "Warisnagar",
  ],
  Saran: [
    "Amnour",
    "Baniapur",
    "Chapra",
    "Dariapur",
    "Dighwara",
    "Ekma",
    "Garkha",
    "Ishuapur",
    "Jalalpur",
    "Lahladpur",
    "Maker",
    "Manjhi",
    "Marhaura",
    "Mashrak",
    "Nagra",
    "Panapur",
    "Parsa",
    "Rivilganj",
    "Sonepur",
    "Taraiya",
  ],
  Sheikhpura: [
    "Ariyari",
    "Barbigha",
    "Chewara",
    "Ghatkusumbha",
    "Sheikhpura",
    "Shekhopur Saray",
  ],
  Sheohar: ["Dumri Katsari", "Piprarhi", "Purnahiya", "Sheohar", "Tariyani"],
  Sitamarhi: [
    "Bairgania",
    "Bajpatti",
    "Bathnaha",
    "Belsand",
    "Bokhara",
    "Charaut",
    "Dumra",
    "Mejorganj",
    "Nanpur",
    "Parihar",
    "Parsauni",
    "Pupri",
    "Riga",
    "Runnisaidpur",
    "Sonbarsha",
    "Suppi",
    "Sursand",
  ],
  Siwan: [
    "Andar",
    "Barharia",
    "Basantpur",
    "Bhagwanpur Hat",
    "Darauli",
    "Duraundha",
    "Goriakothi",
    "Guthani",
    "Hasanpura",
    "Hussainganj",
    "Lakri Nabiganj",
    "Maharajganj",
    "Mairwa",
    "Nautan",
    "Pachrukhi",
    "Raghunathpur",
    "Siswan",
    "Siwan sadar",
    "Ziradei",
  ],
  Supaul: [
    "Basantpur",
    "Chhatapur",
    "Kishanpur",
    "Marauna",
    "Nirmali",
    "Pipra",
    "Pratapganj",
    "Raghopur",
    "Saraigarh Bhaptiyahi",
    "Supaul",
    "Triveniganj",
  ],
  Vaishali: [
    "Bhagwanpur",
    "Bidupur",
    "Chehara Kala",
    "Desri",
    "Goraul",
    "Hajipur",
    "Jandaha",
    "Lalganj",
    "Mahnar",
    "Mahua",
    "Patepur",
    "Paterhi Belsar",
    "Raghopur",
    "Rajapakar",
    "Sahdei Buzurg",
    "Vaishali",
  ],
  "West Champaran": [
    "Bagaha - 2",
    "Bagha - 1",
    "Bairia",
    "Bettiah",
    "Bhitahan",
    "Chanpatiya",
    "Gaunaha",
    "Lauriya",
    "Madhubani",
    "Mainatand",
    "Mazauliya",
    "Narkatiyaganj",
    "Nautan",
    "Piprasi",
    "Ramnagar",
    "Sikta",
    "Thakaraha",
    "Yogapatti",
  ],
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    jila: "",
    prakhand: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Signup Mutation
  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: (data) => {
      setMessage(data.message);
      successToast("Signup successful. Redirecting to verification page !");
      setTimeout(() => {
        navigate("/verify-email", {
          state: {
            email: formData.email,
            name: formData.name,
            password: formData.password,
            jila: formData.jila,
            prakhand: formData.prakhand,
          },
        });
      }, 2000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Signup failed");
    },
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "jila") {
      // If Jila changes, update Jila and reset Prakhand
      setFormData({ ...formData, jila: value, prakhand: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    signupMutation.mutate(formData);
  };

  return (
    <Container>
      <ContentWrapper
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        <FormSection>
          <HeaderContainer>
            <Title>Create Your Account</Title>
            <Subtitle>Join our platform and start your journey</Subtitle>
          </HeaderContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {message && <SuccessMessage>{message}</SuccessMessage>}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <UserPlus size={20} />
                </InputIcon>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  onChange={handleChange}
                  style={{ paddingLeft: "2.5rem" }}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <Mail size={20} />
                </InputIcon>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  onChange={handleChange}
                />
              </InputWrapper>
            </InputGroup>

            {/* Jila Dropdown */}
            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <MapPin size={20} />
                </InputIcon>
                <Select
                  name="jila"
                  value={formData.jila}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Jila (District)
                  </option>
                  {Object.keys(locationData).map((jila) => (
                    <option key={jila} value={jila}>
                      {jila}
                    </option>
                  ))}
                </Select>
              </InputWrapper>
            </InputGroup>

            {/* Prakhand Dropdown */}
            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <MapPin size={20} />
                </InputIcon>
                <Select
                  name="prakhand"
                  value={formData.prakhand}
                  onChange={handleChange}
                  required
                  disabled={!formData.jila} // Disable until Jila is picked
                >
                  <option value="" disabled>
                    Select Prakhand (Block)
                  </option>
                  {/* Map based on selected Jila */}
                  {formData.jila &&
                    locationData[formData.jila]?.map((blk) => (
                      <option key={blk} value={blk}>
                        {blk}
                      </option>
                    ))}
                </Select>
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  required
                  onChange={handleChange}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <Check size={20} />
                </InputIcon>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  onChange={handleChange}
                />
              </InputWrapper>
            </InputGroup>

            <SubmitButton
              type="submit"
              disabled={signupMutation.isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {signupMutation.isLoading ? "Creating Account..." : "Sign Up"}
            </SubmitButton>

            <LoginPrompt>
              Already have an account?
              <LoginLink href="/login">Log In</LoginLink>
            </LoginPrompt>
          </Form>
        </FormSection>
      </ContentWrapper>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  width: 100%;
  padding: 1rem;

  @media (min-width: 768px) {
    height: 90vh;
    width: 100vw;
    padding: 0;
  }
`;
const ContentWrapper = styled(motion.div)`
  display: flex;
  width: 100%;
  max-width: 500px;
  overflow: hidden;

  @media (min-width: 768px) {
    width: 50%;
    /* max-width: 1200px; */
  }
`;

const FormSection = styled.div`
  flex: 1;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    padding: 4rem 3rem;
  }
`;

const HeaderContainer = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #2563eb;
  margin-bottom: 0.5rem;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;
const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    gap: 1.25rem;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;

  @media (min-width: 768px) {
    left: 12px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 14px 14px 14px 44px;
    font-size: 1rem;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 1rem;
  }

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  background-color: #fee2e2;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    padding: 10px;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
`;

const SuccessMessage = styled.p`
  color: #10b981;
  background-color: #d1fae5;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    padding: 10px;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  color: #6b7280;
  margin-top: 0.75rem;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    margin-top: 1rem;
    font-size: 1rem;
  }
`;

const LoginLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  margin-left: 0.5rem;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #d1d5db;
  color: var(--color-text);
  font-size: 1rem;
  cursor: pointer;

  &::placeholder {
    color: var(--color-text-secondary);
  }

  /* Style for the dropdown options */
  option {
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default Signup;
