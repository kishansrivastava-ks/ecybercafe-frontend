import styled, { css } from "styled-components";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Button = styled.button`
  padding: 0.5rem;
  border-radius: 50%;
  background-color: ${({ theme }) =>
    theme === "light" ? "#f3f4f6" : "#1f2937"};
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: ${({ theme }) =>
      theme === "light" ? "#e5e7eb" : "#374151"};
  }
  /* border: 2px solid white; */
`;

const IconContainer = styled.div`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
`;

const IconStyles = css`
  position: absolute;
  transform: ${({ isActive }) => (isActive ? "rotate(0)" : "rotate(90deg)")};
  opacity: ${({ isActive }) => (isActive ? "1" : "0")};
  transition: all 0.5s;
`;

const SunIcon = styled(Sun)`
  ${IconStyles}
  color: #fbbf24;
`;

const MoonIcon = styled(Moon)`
  ${IconStyles}
  color: #60a5fa;
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      theme={theme}
    >
      <IconContainer className="flex-center">
        <SunIcon isActive={theme === "light"} size={24} />
        <MoonIcon isActive={theme === "dark"} size={24} />
      </IconContainer>
    </Button>
  );
};

export default ThemeToggle;
