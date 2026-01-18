import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  X,
  Trash2,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { successToast, errorToast } from "../../utils/ToastNotfications";
import CreditWalletModal from "../../components/modals/CreditWalletModal";

// --- Location Data for Filtering ---
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

// --- Fetch Users ---
const fetchAllUsers = async () => {
  const { data } = await axiosInstance.get("/admin/users/all-users");
  return data.users;
};

// Delete API Call
const deleteUserApi = async (userId) => {
  const res = await axiosInstance.delete(`/admin/users/${userId}`);
  return res.data;
};

const Users = () => {
  const queryClient = useQueryClient();

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJila, setSelectedJila] = useState("All");
  const [selectedPrakhand, setSelectedPrakhand] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [creditModalUser, setCreditModalUser] = useState(null);
  const ITEMS_PER_PAGE = 10;

  // --- Query ---
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: fetchAllUsers,
  });

  const [userToDelete, setUserToDelete] = useState(null);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      successToast("User deactivated successfully");
      queryClient.invalidateQueries(["allUsers"]);
      setUserToDelete(null);
    },
    onError: (err) => {
      errorToast(err.response?.data?.message || "Failed to delete user");
    },
  });

  // --- Filtering Logic ---
  const filteredUsers = users.filter((user) => {
    // 0. Exclude Deleted Users (New Check)
    if (user.isDeleted) return false;

    // 1. Search Filter (Name or Email)
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Jila Filter
    const matchesJila = selectedJila === "All" || user.jila === selectedJila;

    // 3. Prakhand Filter
    const matchesPrakhand =
      selectedPrakhand === "All" || user.prakhand === selectedPrakhand;

    return matchesSearch && matchesJila && matchesPrakhand;
  });
  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedJila, selectedPrakhand]);

  // Handle Jila Change (Reset Prakhand)
  const handleJilaChange = (e) => {
    setSelectedJila(e.target.value);
    setSelectedPrakhand("All");
  };

  // Handle Reset Filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedJila("All");
    setSelectedPrakhand("All");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HeaderContainer>
        <div>
          <Title>Registered Users</Title>
          <Subtitle>Manage and view all platform users</Subtitle>
        </div>
        <UserCount>{filteredUsers.length} Users Found</UserCount>
      </HeaderContainer>

      {/* --- Controls Section: Search & Filters --- */}
      <ControlsContainer>
        <SearchWrapper>
          {/* <SearchIcon size={18} /> */}
          <SearchInput
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>

        <FiltersWrapper>
          <FilterGroup>
            <FilterIcon>
              <MapPin size={16} />
            </FilterIcon>
            <Select value={selectedJila} onChange={handleJilaChange}>
              <option value="All">All Jilas (Districts)</option>
              {Object.keys(locationData).map((jila) => (
                <option key={jila} value={jila}>
                  {jila}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterIcon>
              <MapPin size={16} />
            </FilterIcon>
            <Select
              value={selectedPrakhand}
              onChange={(e) => setSelectedPrakhand(e.target.value)}
              disabled={selectedJila === "All"}
            >
              <option value="All">All Prakhands (Blocks)</option>
              {selectedJila !== "All" &&
                locationData[selectedJila]?.map((blk) => (
                  <option key={blk} value={blk}>
                    {blk}
                  </option>
                ))}
            </Select>
          </FilterGroup>

          <ResetButton onClick={resetFilters} title="Reset Filters">
            <RefreshCw size={18} />
          </ResetButton>
        </FiltersWrapper>
      </ControlsContainer>

      {/* --- Content Area --- */}
      {isLoading ? (
        <LoadingState>
          <Spinner />
          <p>Loading user data...</p>
        </LoadingState>
      ) : isError ? (
        <ErrorState>
          <p>Failed to load users.</p>
          <button onClick={() => refetch()}>Try Again</button>
        </ErrorState>
      ) : filteredUsers.length === 0 ? (
        <EmptyState>
          <User size={48} />
          <p>No users found matching your criteria.</p>
          <button onClick={resetFilters}>Clear Filters</button>
        </EmptyState>
      ) : (
        <>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Email</th>
                  <th>Location (Jila / Prakhand)</th>
                  <th>Status</th>
                  <th>Joined On</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    whileHover={{
                      backgroundColor: "var(--color-surface-secondary)",
                    }}
                  >
                    <td>
                      <UserInfo>
                        <UserName>{user.name}</UserName>
                      </UserInfo>
                    </td>
                    <td>
                      <EmailWrapper>
                        <Mail size={14} />
                        {user.email}
                      </EmailWrapper>
                    </td>
                    <td>
                      <LocationInfo>
                        <MapPin size={14} />
                        {user.jila || "N/A"}
                        {user.prakhand ? `, ${user.prakhand}` : ""}
                      </LocationInfo>
                    </td>
                    <td>
                      <StatusBadge verified={user.isVerified}>
                        {user.isVerified ? "Verified" : "Unverified"}
                      </StatusBadge>
                    </td>
                    <td>
                      <DateInfo>
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </DateInfo>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <CreditBtn
                          onClick={() => setCreditModalUser(user)}
                          title="Add Funds Manually"
                        >
                          <IndianRupee size={16} />
                        </CreditBtn>
                        {user.role !== "admin" && (
                          <DeleteBtn
                            onClick={() => setUserToDelete(user)}
                            title="Deactivate User"
                          >
                            <Trash2 size={16} />
                          </DeleteBtn>
                        )}
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>

          {/* --- Pagination --- */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PageButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {`<`}
              </PageButton>
              <PageInfo>
                Page {currentPage} of {totalPages}
              </PageInfo>
              <PageButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {`>`}
              </PageButton>
            </PaginationContainer>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalHeader>
                <h3>Confirm User Deactivation</h3>
                <CloseBtn onClick={() => setUserToDelete(null)}>
                  <X size={20} />
                </CloseBtn>
              </ModalHeader>
              <ModalBody>
                <WarningIcon>
                  <AlertTriangle size={48} />
                </WarningIcon>
                <ConfirmText>
                  Are you sure you want to deactivate{" "}
                  <strong>{userToDelete.name}</strong>?
                </ConfirmText>
                <SubText>
                  They will no longer be able to log in. Their transaction
                  history and service applications will be preserved.
                </SubText>
              </ModalBody>
              <ModalFooter>
                <CancelBtn onClick={() => setUserToDelete(null)}>
                  Cancel
                </CancelBtn>
                <ConfirmBtn
                  onClick={() => deleteMutation.mutate(userToDelete._id)}
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading
                    ? "Processing..."
                    : "Yes, Deactivate"}
                </ConfirmBtn>
              </ModalFooter>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Credit Wallet Modal */}
      <AnimatePresence>
        {creditModalUser && (
          <CreditWalletModal
            user={creditModalUser}
            onClose={() => setCreditModalUser(null)}
            onSuccess={() => {
              setCreditModalUser(null);
              queryClient.invalidateQueries(["allUsers"]);
            }}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Users;

// --- Styled Components ---

const Container = styled(motion.div)`
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.95rem;
`;

const UserCount = styled.div`
  background: var(--color-surface-secondary);
  color: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ControlsContainer = styled.div`
  background-color: var(--color-surface);
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  position: relative;
  min-width: 200px;
`;

const FilterIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.25rem;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  appearance: none; /* Hides default arrow */

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--color-surface-secondary);
  }
`;

const ResetButton = styled.button`
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-error-light);
    color: var(--color-error);
    border-color: var(--color-error);
  }
`;

const TableContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  thead {
    background-color: var(--color-surface-secondary);
    border-bottom: 1px solid var(--color-border-light);
  }

  th {
    text-align: left;
    padding: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    letter-spacing: 0.05em;
  }
`;

const TableRow = styled(motion.tr)`
  border-bottom: 1px solid var(--color-border-light);
  transition: background-color 0.1s ease;

  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  padding-left: 1rem;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
`;

const UserName = styled.span`
  font-weight: 500;
  color: var(--color-text);
`;

const EmailWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 500;
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(props) =>
    props.verified
      ? "var(--color-success-light, #e6f9e6)"
      : "var(--color-warning-light, #fff8e1)"};
  color: ${(props) =>
    props.verified
      ? "var(--color-success, #2ecc71)"
      : "var(--color-warning, #f1c40f)"};
  border: 1px solid
    ${(props) =>
      props.verified ? "var(--color-success)" : "var(--color-warning)"};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-bottom: 2rem;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border-light);
  background-color: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-surface-secondary);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--color-text-secondary);
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background-color: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  color: var(--color-text-muted);
  text-align: center;
  gap: 1rem;

  button {
    color: var(--color-primary);
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const ErrorState = styled(EmptyState)`
  color: var(--color-error);

  button {
    color: var(--color-text);
    background-color: var(--color-surface-secondary);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    border: 1px solid var(--color-border-light);

    &:hover {
      background-color: var(--color-border-light);
    }
  }
`;

const DeleteBtn = styled.div`
  background: #fee2e2;
  color: #ef4444;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  &:hover {
    background: #fecaca;
  }
`;

/* Modal Styles */
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Modal = styled(motion.div)`
  background: white;
  width: 400px;
  border-radius: 12px;
  overflow: hidden;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
const ModalBody = styled.div`
  padding: 2rem;
  text-align: center;
`;
const WarningIcon = styled.div`
  color: #ef4444;
  margin-bottom: 1rem;
`;
const ConfirmText = styled.p`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: #333;
`;
const SubText = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;
const ModalFooter = styled.div`
  padding: 1rem;
  background: #f9f9f9;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`;
const CancelBtn = styled.button`
  padding: 0.6rem 1.2rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: black;
`;
const ConfirmBtn = styled.button`
  padding: 0.6rem 1.2rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:disabled {
    opacity: 0.7;
  }
`;

const CreditBtn = styled.div`
  background: #dcfce7;
  color: #166534;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #bbf7d0;
  }
`;
