import { useEffect, useState } from "react";
import axios from "axios";
import "./DocumentUpload.css";

const DocumentUpload = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignature(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError("Document name is required");
      return false;
    }

    if (!photo) {
      setError("Photo is required");
      return false;
    }

    if (!signature) {
      setError("Signature is required");
      return false;
    }

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (
      !allowedTypes.includes(photo.type) ||
      !allowedTypes.includes(signature.type)
    ) {
      setError("Only JPEG, PNG and WebP files are allowed");
      return false;
    }

    // Validate file sizes (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (photo.size > maxSize || signature.size > maxSize) {
      setError("File size cannot exceed 5MB");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("photo", photo);
    formData.append("signature", signature);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/document/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
      setName("");
      setPhoto(null);
      setSignature(null);
      setPhotoPreview(null);
      setSignaturePreview(null);

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(response.data.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      if (signaturePreview) URL.revokeObjectURL(signaturePreview);
    };
  }, [photoPreview, signaturePreview]);

  return (
    <div className="document-upload">
      <h2>Upload New Document</h2>

      {error && <div className="upload-error">{error}</div>}
      {success && (
        <div className="upload-success">Document uploaded successfully!</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Document Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="photo">Photo</label>
            <input
              type="file"
              id="photo"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              disabled={loading}
              required
            />
            {photoPreview && (
              <div className="preview-container">
                <img
                  src={photoPreview}
                  alt="Photo Preview"
                  className="file-preview"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="signature">Signature</label>
            <input
              type="file"
              id="signature"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleSignatureChange}
              disabled={loading}
              required
            />
            {signaturePreview && (
              <div className="preview-container">
                <img
                  src={signaturePreview}
                  alt="Signature Preview"
                  className="file-preview"
                />
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;
