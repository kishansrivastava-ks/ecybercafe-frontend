import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
`;

export const CardWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

export const Left = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const IconWrapper = styled.div`
  background-color: #6366f1;
  padding: 2rem;
  border-radius: 50%;
`;

export const ImageLabel = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

export const Right = styled.div`
  flex: 2;
  min-width: 300px;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

export const Price = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 1rem;
`;

export const Description = styled.p`
  margin-bottom: 1.5rem;
  color: #6b7280;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export const Textarea = styled.textarea`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
`;

export const Label = styled.label`
  font-weight: 500;
`;

export const BuyButton = styled.button`
  padding: 0.9rem;
  background-color: #6366f1;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background-color: #4f46e5;
  }
`;
