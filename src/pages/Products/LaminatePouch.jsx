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
import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LaminatePouch = () => {
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
    console.log("Laminate Pouch Order:", formData);
    alert("Order for Laminate A4 Pouch placed successfully!");
    navigate("/dashboard");
  };

  return (
    <PageContainer>
      <CardWrapper>
        <Left>
          <IconWrapper>
            <Layers size={80} color="#fff" />
          </IconWrapper>
          <ImageLabel>Laminate A4 Pouch</ImageLabel>
        </Left>

        <Right>
          <Title>Laminate A4 Pouch</Title>
          <Price>₹80 / Packet</Price>
          <Description>
            Transparent A4-size lamination pouches, perfect for preserving
            documents. Fill in your details to place an order.
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

export default LaminatePouch;
