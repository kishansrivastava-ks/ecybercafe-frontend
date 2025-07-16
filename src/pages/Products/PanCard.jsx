import React from "react";
import { FileText } from "lucide-react";
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

const PanCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: "",
    fatherName: "",
    dob: "",
    aadhaar: "",
    mobile: "",
    email: "",
    requestType: "new",
    aadhaarDoc: null,
    photo: null,
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
    console.log("PAN Card Form Submitted:", formData);
    alert("PAN Card application submitted!");
    navigate("/dashboard");
  };

  return (
    <PageContainer>
      <CardWrapper>
        <Left>
          <IconWrapper>
            <FileText size={80} color="#fff" />
          </IconWrapper>
          <ImageLabel>PAN Card</ImageLabel>
        </Left>

        <Right>
          <Title>PAN Card Application</Title>
          <Price>₹120</Price>
          <Description>
            Apply for a new PAN card or update your existing details. Submit
            valid Aadhaar and photo to begin.
          </Description>

          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name (as per Aadhaar)"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="fatherName"
              placeholder="Father’s Name"
              value={formData.fatherName}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={formData.dob}
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
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
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
            <Select
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
            >
              <option value="new">New PAN</option>
              <option value="update">Update Existing PAN</option>
            </Select>

            <Label>Upload Aadhaar Card (PDF/Image)</Label>
            <Input
              type="file"
              name="aadhaarDoc"
              accept="application/pdf,image/*"
              onChange={handleChange}
              required
            />

            <Label>Upload Passport Size Photo</Label>
            <Input
              type="file"
              name="photo"
              accept="image/*"
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

export default PanCard;
