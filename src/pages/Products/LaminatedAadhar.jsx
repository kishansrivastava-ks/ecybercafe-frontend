import React from "react";
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
import { BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LaminatedAadhar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: "",
    mobile: "",
    aadharNumber: "",
    file: null,
    address: "",
    city: "",
    state: "",
    pincode: "",
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
    console.log("Laminated Aadhar Request:", formData);
    alert("Laminated Aadhar Card request submitted successfully!");
    navigate("/dashboard");
  };

  return (
    <PageContainer>
      <CardWrapper>
        <Left>
          <IconWrapper>
            <BadgeCheck size={80} color="#fff" />
          </IconWrapper>
          <ImageLabel>Laminated Aadhar Card</ImageLabel>
        </Left>

        <Right>
          <Title>Laminated Aadhar Card</Title>
          <Price>₹50</Price>
          <Description>
            Get your Aadhar card printed and laminated for durability. Upload
            your Aadhar PDF or just enter your Aadhar number for us to download
            it for you.
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
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number"
              value={formData.aadharNumber}
              onChange={handleChange}
              required
            />
            <FileInput>
              <label htmlFor="file">Upload Aadhar PDF (optional)</label>
              <input
                type="file"
                name="file"
                id="file"
                accept="application/pdf"
                onChange={handleChange}
              />
            </FileInput>
            <Input
              type="text"
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
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
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
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

export default LaminatedAadhar;
