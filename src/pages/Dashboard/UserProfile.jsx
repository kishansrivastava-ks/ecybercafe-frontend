import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../contexts/useAuth";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit2,
  X,
  Save,
  Shield,
} from "lucide-react";
import { successToast, errorToast } from "../../utils/ToastNotfications";

// --- Location Data (Same as used in Signup/Users) ---
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

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    jila: "",
    prakhand: "",
  });

  // Populate form when modal opens
  useEffect(() => {
    if (isEditModalOpen && user) {
      setEditFormData({
        name: user.name || "",
        jila: user.jila || "",
        prakhand: user.prakhand || "",
      });
    }
  }, [isEditModalOpen, user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put("/user/profile", data);
      return res.data;
    },
    onSuccess: (data) => {
      successToast("Profile updated successfully!");
      if (updateUser) updateUser(data); // Update local user context
      setIsEditModalOpen(false);
    },
    onError: (err) => {
      errorToast(err.response?.data?.message || "Failed to update profile");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "jila") {
      setEditFormData({ ...editFormData, jila: value, prakhand: "" });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(editFormData);
  };

  return (
    <PageWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileContainer>
        {/* Header Section */}
        <ProfileHeader>
          <AvatarWrapper>
            <AvatarPlaceholder>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarPlaceholder>
            {user?.role === "admin" && (
              <RoleBadge>
                <Shield size={12} fill="white" /> Admin
              </RoleBadge>
            )}
          </AvatarWrapper>
          <HeaderTextContent>
            <UserName>{user?.name}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </HeaderTextContent>
        </ProfileHeader>

        {/* Content Section */}
        <ContentSection>
          <SectionHeader>
            <SectionTitle>Personal Information</SectionTitle>
            <EditButton
              onClick={() => setIsEditModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit2 size={16} /> Edit Profile
            </EditButton>
          </SectionHeader>

          <InfoTable>
            <tbody>
              <tr>
                <LabelCell>
                  <User size={16} /> Full Name
                </LabelCell>
                <ValueCell>{user?.name}</ValueCell>
              </tr>
              <tr>
                <LabelCell>
                  <Mail size={16} /> Email Address
                </LabelCell>
                <ValueCell>{user?.email}</ValueCell>
              </tr>
              <tr>
                <LabelCell>
                  <MapPin size={16} /> Location
                </LabelCell>
                <ValueCell>
                  {user?.jila || "N/A"}
                  {user?.prakhand ? `, ${user?.prakhand}` : ""}
                </ValueCell>
              </tr>
              <tr>
                <LabelCell>
                  <Calendar size={16} /> Joined On
                </LabelCell>
                <ValueCell>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not available"}
                </ValueCell>
              </tr>
            </tbody>
          </InfoTable>
        </ContentSection>
      </ProfileContainer>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalHeader>
                <h3>Edit Profile</h3>
                <CloseButton onClick={() => setIsEditModalOpen(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <ModalBody onSubmit={handleUpdate}>
                <FormGroup>
                  <label>Full Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Jila (District)</label>
                  <Select
                    name="jila"
                    value={editFormData.jila}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select Jila
                    </option>
                    {Object.keys(locationData).map((jila) => (
                      <option key={jila} value={jila}>
                        {jila}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <label>Prakhand (Block)</label>
                  <Select
                    name="prakhand"
                    value={editFormData.prakhand}
                    onChange={handleInputChange}
                    required
                    disabled={!editFormData.jila}
                  >
                    <option value="" disabled>
                      Select Prakhand
                    </option>
                    {editFormData.jila &&
                      locationData[editFormData.jila]?.map((blk) => (
                        <option key={blk} value={blk}>
                          {blk}
                        </option>
                      ))}
                  </Select>
                </FormGroup>

                <ModalActions>
                  <CancelButton
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </CancelButton>
                  <SaveButton
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                  >
                    {updateProfileMutation.isLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </SaveButton>
                </ModalActions>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default UserProfile;

// --- Styled Components ---

const PageWrapper = styled(motion.div)`
  min-height: 80vh;
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.background};
`;

const ProfileContainer = styled.div`
  width: 100%;
  /* max-width: 800px; */
  background-color: ${({ theme }) => theme.surface || "#fff"};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border || "#e0e0e0"};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 2.5rem;
  /* background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-dark, #2980b9)
  ); */
  color: white;
  gap: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const AvatarPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: 600;
  border: 1px solid black;
  backdrop-filter: blur(5px);
  color: black;
`;

const RoleBadge = styled.div`
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-secondary, #f39c12);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 3px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const HeaderTextContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
`;

const UserEmail = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.25rem;
`;

const ContentSection = styled.div`
  padding: 2.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#eee"};
  padding-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text || "#333"};
  font-weight: 600;
  margin: 0;
`;

const EditButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-primary);
    color: white;
  }
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr {
    border-bottom: 1px solid ${({ theme }) => theme.border || "#f0f0f0"};
  }

  tr:last-child {
    border-bottom: none;
  }
`;

const LabelCell = styled.td`
  padding: 1rem 0;
  width: 40%;
  color: ${({ theme }) => theme.textLight || "#777"};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ValueCell = styled.td`
  padding: 1rem 0;
  color: ${({ theme }) => theme.text || "#333"};
  font-weight: 500;
  text-align: right;

  @media (max-width: 480px) {
    text-align: left;
    display: block;
    padding-top: 0;
  }
`;

/* --- Modal Styles --- */

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
  padding: 5px;

  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: #555;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: 1px solid #ddd;
  background-color: white;
  color: #555;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: var(--color-primary);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-dark, #2980b9);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
