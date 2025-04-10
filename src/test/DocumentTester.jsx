import { useState, useEffect } from "react";
import DocumentUpload from "./DocumentUpload";
import DocumentViewer from "./DocumentViewer";
import "./DocumentTester.css";
import axios from "axios";

function DocumentTester() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/document`);
        setDocuments(response.data.data);

        // Select the first document by default if available
        if (response.data.data.length > 0 && !selectedDocumentId) {
          setSelectedDocumentId(response.data.data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [API_BASE_URL, selectedDocumentId]);

  const handleDocumentUploadSuccess = (newDocument) => {
    setDocuments([newDocument, ...documents]);
    setSelectedDocumentId(newDocument._id);
    setShowUploadForm(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Document Management System</h1>
        <button
          className="new-document-button"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? "Cancel Upload" : "New Document"}
        </button>
      </header>

      {showUploadForm ? (
        <DocumentUpload onSuccess={handleDocumentUploadSuccess} />
      ) : (
        <div className="content-container">
          <aside className="document-list">
            <h2>Your Documents</h2>
            {loading ? (
              <p>Loading documents...</p>
            ) : documents.length === 0 ? (
              <p>No documents found. Create a new one!</p>
            ) : (
              <ul>
                {documents.map((doc) => (
                  <li
                    key={doc._id}
                    className={selectedDocumentId === doc._id ? "selected" : ""}
                    onClick={() => setSelectedDocumentId(doc._id)}
                  >
                    {doc.name}
                    <span className="document-date">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <main className="document-display">
            {selectedDocumentId ? (
              <DocumentViewer documentId={selectedDocumentId} />
            ) : (
              <div className="no-document-selected">
                <p>Select a document from the list or create a new one</p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default DocumentTester;
