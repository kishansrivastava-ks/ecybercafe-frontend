import React from "react";
import { Share2 } from "lucide-react";
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

const EShareCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: "",
    pan: "",
    aadhaar: "",
    email: "",
    mobile: "",
    demat: "",
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
    console.log("E-Share Card Submitted:", formData);
    alert("E-Share Card application submitted!");
    navigate("/dashboard");
  };

  return (
    <PageContainer>
      <CardWrapper>
        <Left>
          <IconWrapper>
            <Share2 size={80} color="#fff" />
          </IconWrapper>
          <ImageLabel>E-Share Card</ImageLabel>
        </Left>

        <Right>
          <Title>E Share Card Application</Title>
          <Price>₹120</Price>
          <Description>
            Apply for a digital E-Share card for secure and verified
            shareholding. Submit PAN, Aadhaar and Demat account details.
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
              name="pan"
              placeholder="PAN Number"
              value={formData.pan}
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
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
              name="demat"
              placeholder="Demat Account Number"
              value={formData.demat}
              onChange={handleChange}
              required
            />
            <Select
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
            >
              <option value="new">New Issuance</option>
              <option value="update">Update Existing</option>
            </Select>
            <Label>Upload PAN & Aadhaar (PDF or Image)</Label>
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

export default EShareCard;
