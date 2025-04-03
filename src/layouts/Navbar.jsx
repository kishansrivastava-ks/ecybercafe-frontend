import { Link } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../contexts/useAuth";
// import { motion } from "framer-motion";
import Animated from "../components/common/Animated";
import ThemeToggle from "../utils/ThemeToggle";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  // console.log(user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Nav>
      <Animated animation="fadeIn">
        <Logo>E-Cybercafe</Logo>
      </Animated>
      <NavLinks className={isMenuOpen ? "show" : ""}>
        <Animated animation="slideDown" delay={0.1}>
          <ThemeToggle />
        </Animated>
        <Animated animation="slideDown" delay={0.1}>
          <StyledLink to="/">Home</StyledLink>
        </Animated>
        <Animated animation="slideDown" delay={0.2}>
          <StyledLink to="/services">Services</StyledLink>
        </Animated>
        {user ? (
          <>
            <Animated animation="slideDown" delay={0.3}>
              <StyledLink to="/dashboard">Dashboard</StyledLink>
            </Animated>
            <Animated animation="slideDown" delay={0.4}>
              <StyledLink onClick={logout}>Logout</StyledLink>
            </Animated>
          </>
        ) : (
          <Animated animation="slideDown" delay={0.3}>
            <StyledLink to="/login">Login / Signup</StyledLink>
          </Animated>
        )}
      </NavLinks>

      <MenuToggle onClick={toggleMenu}>{isMenuOpen ? "✕" : "☰"}</MenuToggle>
    </Nav>
  );
};

export default Navbar;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-bg);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const Logo = styled.h1`
  font-size: var(--text-xl);
  font-weight: bold;
  color: var(--color-primary);
  cursor: pointer;

  @media (min-width: 768px) {
    font-size: var(--text-2xl);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  @media (max-width: 767px) {
    position: fixed;
    flex-direction: column;
    top: 70px;
    right: -100%;
    background: var(--color-surface);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    transition: right 0.3s ease-in-out;
    width: 200px;

    /* Show menu when nav is toggled (you'll need to add a className prop) */
    &.show {
      right: 0;
    }
  }

  @media (min-width: 768px) {
    gap: var(--spacing-lg);
  }
`;

const StyledLink = styled(Link)`
  color: var(--color-text);
  font-size: var(--text-base);
  text-decoration: none;
  transition: color var(--transition-medium);
  width: 100%;
  padding: 0.5rem 0;

  @media (max-width: 767px) {
    text-align: center;
    border-bottom: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));

    &:last-child {
      border-bottom: none;
    }
  }

  &:hover {
    color: var(--color-primary);
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: var(--text-base);
  cursor: pointer;
  transition: color var(--transition-medium);
  padding: 0;

  &:hover {
    color: var(--color-danger);
  }
  /* border: 2px solid red; */
`;

const MenuToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 767px) {
    display: block;
  }
  /* edit the active state */
  &:focus {
    /* outline: none; */
    color: white;
  }
`;
