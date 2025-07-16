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
import { FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const A4Paper = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: "",
    mobile: "",
    quantity: 1,
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("A4 Paper Order Submitted:", formData);
    alert("A4 paper order placed successfully!");
    navigate("/dashboard");
  };

  return (
    <PageContainer>
      <CardWrapper>
        <Left>
          <IconWrapper>
            <FileSpreadsheet size={80} color="#fff" />
          </IconWrapper>
          <ImageLabel>A4 Paper</ImageLabel>
        </Left>

        <Right>
          <Title>Computer Paper A4 Size</Title>
          <Price>₹150 / Packet</Price>
          <Description>
            High-quality A4 size printing paper ideal for all documentation
            needs. Enter your details below to place an order.
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
              type="number"
              name="quantity"
              placeholder="Quantity (Packets)"
              min={1}
              value={formData.quantity}
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

            <BuyButton type="submit">Buy Now</BuyButton>
          </Form>
        </Right>
      </CardWrapper>
    </PageContainer>
  );
};

export default A4Paper;
