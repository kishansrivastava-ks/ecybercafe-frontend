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
import { Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PanCardPVC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: "",
    panNumber: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    panFile: null,
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
    console.log("PVC PAN Print Form Submitted:", formData);
    alert("PVC Print request submitted!");
    navigate("/dashboard");
  };

  return (
    <PageContainer>
      <CardWrapper>
        <Left>
          <IconWrapper>
            <Printer size={80} color="#fff" />
          </IconWrapper>
          <ImageLabel>PAN PVC Print</ImageLabel>
        </Left>

        <Right>
          <Title>PAN Card PVC Print</Title>
          <Price>₹60</Price>
          <Description>
            Get your PAN card printed on high-quality PVC material for durable,
            wallet-friendly use. Submit your PAN and delivery details below.
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
              name="panNumber"
              placeholder="PAN Number"
              value={formData.panNumber}
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

            <Label>Upload PAN Card (PDF/Image)</Label>
            <Input
              type="file"
              name="panFile"
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

export default PanCardPVC;
