import React from "react";
import { Vote } from "lucide-react";
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

const VoterCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    address: "",
    voterIdNumber: "",
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
    console.log("Submitting Voter ID Application:", formData);
    alert("Submitted Voter ID card application!");
    navigate("/dashboard");
  };

  return (
    <PageContainer>
      <CardWrapper>
        <Left>
          <IconWrapper>
            <Vote size={80} color="#fff" />
          </IconWrapper>
          <ImageLabel>Voter ID Service</ImageLabel>
        </Left>

        <Right>
          <Title>Voter ID Card Application</Title>
          <Price>₹60</Price>
          <Description>
            Register for a new voter ID or update your existing details. Fill
            out the form and upload valid documents.
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
              name="voterIdNumber"
              placeholder="Voter ID Number (if updating)"
              value={formData.voterIdNumber}
              onChange={handleChange}
            />
            <Select
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
            >
              <option value="new">New Registration</option>
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

export default VoterCard;
