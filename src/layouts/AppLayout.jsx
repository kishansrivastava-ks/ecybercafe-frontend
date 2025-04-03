import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import styled from "styled-components";
import Animated from "../components/common/Animated";

const AppLayout = () => {
  return (
    <Container>
      <Navbar />
      <Main>
        <Animated animation="fadeIn" duration={0.5}>
          <Outlet />
        </Animated>
      </Main>
    </Container>
  );
};

export default AppLayout;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text);
  overflow-x: hidden; /* Prevent horizontal scrolling on mobile */
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-medium),
    color var(--transition-medium);
  width: 100%;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;
