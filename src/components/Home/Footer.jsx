import React from "react";
import styled from "styled-components";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: "Home", url: "/" },
    { title: "Services", url: "/services" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" },
  ];

  const legalLinks = [
    { title: "Privacy Policy", url: "/privacy" },
    { title: "Terms of Service", url: "/terms" },
    { title: "Cookies Policy", url: "/cookies" },
    { title: "Refunds", url: "/refunds" },
  ];

  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <LogoTitle>Digital Services</LogoTitle>
          <Tagline>
            Transforming citizen experiences through innovative digital
            solutions
          </Tagline>
          <SocialLinks>
            <SocialIcon href="#" target="_blank" aria-label="Facebook">
              <Facebook size={24} />
            </SocialIcon>
            <SocialIcon href="#" target="_blank" aria-label="Twitter">
              <Twitter size={24} />
            </SocialIcon>
            <SocialIcon href="#" target="_blank" aria-label="LinkedIn">
              <Linkedin size={24} />
            </SocialIcon>
            <SocialIcon href="#" target="_blank" aria-label="Instagram">
              <Instagram size={24} />
            </SocialIcon>
          </SocialLinks>
        </FooterColumn>

        <FooterColumn>
          <FooterColumnTitle>Quick Links</FooterColumnTitle>
          <FooterLinks>
            {quickLinks.map((link) => (
              <FooterLink key={link.title} href={link.url}>
                {link.title}
              </FooterLink>
            ))}
          </FooterLinks>
        </FooterColumn>

        <FooterColumn>
          <FooterColumnTitle>Legal</FooterColumnTitle>
          <FooterLinks>
            {legalLinks.map((link) => (
              <FooterLink key={link.title} href={link.url}>
                {link.title}
              </FooterLink>
            ))}
          </FooterLinks>
        </FooterColumn>

        <FooterColumn>
          <FooterColumnTitle>Contact Info</FooterColumnTitle>
          <ContactInfo>
            <ContactDetail>Gaya, Bihar </ContactDetail>
            <ContactDetail>helpecybercafe@gmail.com</ContactDetail>
            <ContactDetail>+91 7091361502</ContactDetail>
          </ContactInfo>
        </FooterColumn>
      </FooterContent>

      <CopyrightSection>
        © {currentYear} Digital Services. All Rights Reserved.
      </CopyrightSection>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: var(--color-surface);
  padding: 4rem 2rem 2rem;
  border-top: 1px solid var(--color-border-light);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LogoTitle = styled.h2`
  font-size: 1.75rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const Tagline = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  color: var(--color-text-secondary);
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const FooterColumnTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--color-text);
  margin-bottom: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled.a`
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactDetail = styled.p`
  color: var(--color-text-secondary);
`;

const CopyrightSection = styled.div`
  text-align: center;
  padding: 1.5rem 0;
  border-top: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
`;

export default Footer;
