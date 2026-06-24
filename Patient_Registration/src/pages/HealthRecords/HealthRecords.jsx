import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { FiHeadphones, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useFormContext } from "../../context/FormContext";
import "./HealthRecords.css";

const PrescriptionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="doc-icon"><path d="M9.5 21a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" /><path d="M14.5 15.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" /><path d="M12 12V2h4" /></svg>
);
const LabIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="doc-icon"><path d="M10 2v7.5L4 21a1 1 0 0 0 .9 1.5h14.2a1 1 0 0 0 .9-1.5L14 9.5V2" /><path d="M8.5 2h7" /><path d="M7.5 17h9" /></svg>
);
const ScanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="doc-icon"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M8 12h8" /></svg>
);
const DischargeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="doc-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
);

function HealthRecords() {
  const navigate = useNavigate();
  const { formData, updateFormData, prevStep, nextStep, goToStep } = useFormContext();

  // Set initial state strictly to previously uploaded form files (empty array if first visit)
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    return formData.healthRecords.documents || [];
  });
  const [uploadError, setUploadError] = useState("");
  const [editingFileId, setEditingFileId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    goToStep(4);
  }, [goToStep]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadError("");
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === "file-too-large") {
        setUploadError("Files must be smaller than 20MB.");
      } else {
        setUploadError("Unsupported file format.");
      }
      return;
    }

    // Instantly process actual multiple files and present clean loaded previews
    const newFiles = acceptedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      type: file.type,
      size: file.size,
      progress: 100, // Mark immediately complete to prevent fake background ticking
      isSuccessful: true,
      thumbnail: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80"
    }));

    const updated = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updated);
    updateFormData("healthRecords", { documents: updated });
  }, [uploadedFiles, updateFormData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"]
    },
    maxSize: 20 * 1024 * 1024
  });

  const removeFile = (fileId) => {
    const target = uploadedFiles.find((f) => f.id === fileId);
    if (target?.thumbnail && target.thumbnail.startsWith("blob:")) {
      URL.revokeObjectURL(target.thumbnail);
    }
    const updated = uploadedFiles.filter((f) => f.id !== fileId);
    setUploadedFiles(updated);
    updateFormData("healthRecords", { documents: updated });
  };

  const startEditing = (file) => {
    setEditingFileId(file.id);
    setEditName(file.name);
  };

  const saveEdit = (fileId) => {
    const updated = uploadedFiles.map((f) => f.id === fileId ? { ...f, name: editName } : f);
    setUploadedFiles(updated);
    updateFormData("healthRecords", { documents: updated });
    setEditingFileId(null);
  };

  const handleSkip = () => {
    nextStep();
    navigate("/review");
  };

  const handleBack = () => {
    prevStep();
    navigate("/insurance");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
    navigate("/review");
  };

  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const getFormatLabel = (type) => {
    if (type?.includes("pdf")) return "PDF";
    if (type?.includes("png")) return "PNG";
    return "JPG";
  };

  return (
    <div className="page-health fade-in">
      <header className="health-section-header">
        <div className="header-text-container">
          <h2>Upload Health Records</h2>
          <p>Keep all your medical documents in one secure and convenient place.</p>
        </div>
        <div className="support-badge">
          <FiHeadphones className="support-icon" />
          <div className="support-text">
            <span className="support-label">Need Help?</span>
            <a href="#" className="support-link">Contact Support</a>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="health-records-container-form">
        <div className="upload-interactive-wrapper">
          <label className="input-group-label">Upload your health records</label>
          <div {...getRootProps()} className={`health-records-dropzone ${isDragActive ? "active" : ""}`}>
            <input {...getInputProps()} />
            <svg className="cloud-upload-illustration" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m9 15 3-3 3 3" />
            </svg>
            <p className="dropzone-guide-primary">drag and drop your health records here, or <span className="highlight-browse">browse</span></p>
            <p className="dropzone-guide-secondary">JPG, PNG or PDF (Max. 20MB, multiple files supported)</p>
          </div>
          {uploadError && <span className="upload-inline-error">{uploadError}</span>}
        </div>

        <div className="supported-formats-strip">
          <span className="strip-title">Supported Documents</span>
          <div className="strip-items-list">
            <div className="strip-item"><PrescriptionIcon /><span>Prescription</span></div>
            <div className="strip-item"><LabIcon /><span>Lab reports</span></div>
            <div className="strip-item"><ScanIcon /><span>Scan</span></div>
            <div className="strip-item"><DischargeIcon /><span>Discharge summary</span></div>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="records-scroller-viewport">
            <div className="records-cards-row">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="record-preview-card">
                  <div className="card-thumbnail-container">
                    <img src={file.thumbnail} alt={file.name} className="card-thumbnail-image" />
                  </div>
                  <div className="card-info-pane">
                    <div className="card-title-row">
                      {editingFileId === file.id ? (
                        <input
                          type="text"
                          className="card-title-editor"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => saveEdit(file.id)}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit(file.id)}
                          autoFocus
                        />
                      ) : (
                        <div className="card-title-lockup">
                          <span className="card-display-title">{file.name}</span>
                          <FiEdit2 className="title-edit-icon" onClick={() => startEditing(file)} />
                        </div>
                      )}
                    </div>
                    <span className="card-meta-details">{getFormatLabel(file.type)} • {formatSize(file.size)}</span>
                    <div className="card-status-track">
                      <div className="card-upload-finished-row">
                        <span className="upload-success-text">Uploaded Successfully!</span>
                        <button type="button" className="trash-action-btn" onClick={() => removeFile(file.id)}>
                          <FiTrash2 className="trash-icon" /> <span className="trash-label-text">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="scroller-indicator-line"></div>
          </div>
        )}

        <footer className="health-records-action-strip">
          <button type="button" className="action-skip-btn" onClick={handleSkip}>Skip for now</button>
          <div className="right-action-buttons-group">
            <button type="button" className="action-back-btn" onClick={handleBack}>Go Back</button>
            <button type="submit" className="action-submit-btn">Create Unique ID</button>
          </div>
        </footer>
      </form>
    </div>
  );
}

export default HealthRecords;
