import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Layers,
  Settings,
  Users,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import ThemeToggle from "../utils/ThemeToggle";
import { Button } from "../ui/UIComponents";
import useAuth from "../contexts/useAuth";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const {
    data: services,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminServices"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/admin/service/all-services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container>
      <Overlay isVisible={sidebarOpen} onClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen}>
        <LogoContainer>
          <Logo>Admin</Logo>
          {isMobile && (
            <CloseButton onClick={toggleSidebar}>
              <X size={24} />
            </CloseButton>
          )}
        </LogoContainer>

        <Navigation>
          <NavItem to="/admin-dashboard" end onClick={closeSidebarOnMobile}>
            <Home size={20} />
            <span>Dashboard</span>
          </NavItem>
          <NavItem to="/admin/services" onClick={closeSidebarOnMobile}>
            <Layers size={20} />
            <span>Services</span>
          </NavItem>
          <NavItem to="/admin/users" onClick={closeSidebarOnMobile}>
            <Users size={20} />
            <span>Users</span>
          </NavItem>
          <NavItem to="/admin/settings" onClick={closeSidebarOnMobile}>
            <Settings size={20} />
            <span>Settings</span>
          </NavItem>
        </Navigation>

        <SupportSection>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          <SupportButton>
            <HelpCircle size={20} />
            <span>Support</span>
          </SupportButton>
        </SupportSection>
      </Sidebar>

      <MainContent>
        <Header>
          {isMobile && (
            <MenuButton onClick={toggleSidebar}>
              <Menu size={24} />
            </MenuButton>
          )}
          <HeaderTitle>Admin Dashboard</HeaderTitle>
          <div style={{ marginLeft: "auto", marginRight: "2rem" }}>
            <ThemeToggle />
          </div>

          <UserProfile>
            <UserInitials>{user?.name[0].toUpperCase()}</UserInitials>
          </UserProfile>
        </Header>

        <OutletWrapper>
          <Outlet context={{ services, isLoading, error }} />
        </OutletWrapper>
      </MainContent>
    </Container>
  );
};

export default AdminDashboardLayout;

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: var(--color-bg);
  position: relative;
`;

const Overlay = styled.div`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};

  @media (min-width: 768px) {
    display: none;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  z-index: 10;

  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    left: ${(props) => (props.isOpen ? "0" : "-250px")};
    height: 100vh;
    transition: left 0.3s ease;
    box-shadow: ${(props) =>
      props.isOpen ? "0 0 15px rgba(0, 0, 0, 0.2)" : "none"};
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-right: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const LogoContainer = styled.div`
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  justify-content: center;
  position: relative;

  @media (max-width: 767px) {
    justify-content: space-between;
    align-items: center;
    padding-right: 1rem;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  color: var(--color-text);
  font-weight: 600;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 2rem 0 1rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  margin: 0.25rem 0;
  /* border-radius: 8px; */
  transition: all 0.3s ease;

  span {
    font-size: 1rem;
  }

  &:hover {
    background-color: var(--color-surface-secondary);
    color: var(--color-primary);
  }

  &.active {
    background-color: var(--color-primary-light);
    /* color: var(--color-primary-dark); */
    font-weight: 500;
    color: white;
  }

  svg {
    color: var(--color-text-muted);
  }

  &.active svg {
    color: var(--color-primary-dark);
    color: white;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);

  @media (max-width: 767px) {
    padding: 1rem 1.5rem;
  }
`;

const HeaderTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--color-text);
  font-weight: 600;

  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
`;

const UserInitials = styled.div`
  width: 40px;
  height: 40px;
  background-color: var(--color-primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 500;

  @media (max-width: 767px) {
    width: 35px;
    height: 35px;
  }
`;

const OutletWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  /* padding: 2rem; */
  background-color: var(--color-bg);
`;

const SupportSection = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--color-border-light);
`;

const SupportButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--color-surface-secondary);
  color: var(--color-text-secondary);
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-border-light);
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-secondary);
  color: var(--color-text-secondary);
  border: none;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    background-color: var(--color-border-light);
  }
`;
