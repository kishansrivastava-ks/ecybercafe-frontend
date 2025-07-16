import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  CardWrapper,
  Left,
  IconWrapper,
  ImageLabel,
  Right,
  Title,
  Price,
  Description,
  Form,
  Input,
  Select,
  Textarea,
  Label,
  BuyButton,
} from "./ProductStyles";

const AyushmanCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: "",
    aadhaar: "",
    rationCard: "",
    mobile: "",
    state: "",
    district: "",
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
    console.log("Ayushman Card Form Submitted:", formData);
    alert("Ayushman Card application submitted!");
    navigate("/dashboard");
  };

  return (
    <PageContainer>
      <CardWrapper>
        <Left>
          <IconWrapper>
            <Heart size={80} color="#fff" />
          </IconWrapper>
          <ImageLabel>Ayushman Card</ImageLabel>
        </Left>

        <Right>
          <Title>Ayushman Bharat Card</Title>
          <Price>₹80</Price>
          <Description>
            Apply for the Ayushman Bharat health insurance card to access ₹5
            lakh worth of medical care. Fill in your details to proceed.
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
              type="text"
              name="aadhaar"
              placeholder="Aadhaar Number"
              value={formData.aadhaar}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="rationCard"
              placeholder="Ration Card Number (optional)"
              value={formData.rationCard}
              onChange={handleChange}
            />
            <Input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
              required
            />
            <Select
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
            >
              <option value="new">New Application</option>
              <option value="update">Update Info</option>
              <option value="check">Eligibility Check</option>
            </Select>
            <Label>Upload Aadhaar or Ration Card (PDF/Image)</Label>
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

export default AyushmanCard;
