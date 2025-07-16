import React from "react";
import styled from "styled-components";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AadharCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    address: "",
    aadharNumber: "",
    requestType: "new",
    document: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later this will be integrated with backend
    console.log("Submitting Aadhar Application:", formData);
    alert("Submitted Aadhar card application!");
    navigate("/dashboard");
  };

  return (
    <PageContainer>
      <CardWrapper>
        <Left>
          <IconWrapper>
            <CreditCard size={80} color="#fff" />
          </IconWrapper>
          <ImageLabel>Aadhar Card Service</ImageLabel>
        </Left>

        <Right>
          <Title>Aadhar Card Application</Title>
          <Price>₹50</Price>
          <Description>
            Apply for a new Aadhar card or update existing details. Fill out the
            required form and upload supporting documents.
          </Description>

          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <Input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <Textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number (if updating)"
              value={formData.aadharNumber}
              onChange={handleChange}
            />
            <Select
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
            >
              <option value="new">New Aadhar</option>
              <option value="update">Update Existing</option>
            </Select>
            <Label>Upload Document (PDF, JPG)</Label>
            <Input
              type="file"
              name="document"
              accept="application/pdf,image/*"
              onChange={handleChange}
              required
            />

            <BuyButton type="submit">Buy Now</BuyButton>
          </Form>
        </Right>
      </CardWrapper>
    </PageContainer>
  );
};

export default AadharCard;

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
`;

const CardWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const Left = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  background-color: #6366f1;
  padding: 2rem;
  border-radius: 50%;
`;

const ImageLabel = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Right = styled.div`
  flex: 2;
  min-width: 300px;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const Price = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 1.5rem;
  color: #6b7280;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
`;

const Label = styled.label`
  font-weight: 500;
`;

const BuyButton = styled.button`
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
