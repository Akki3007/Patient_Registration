import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import { useCallback, useState, useEffect } from "react";
import { FiCreditCard, FiHeadphones, FiX } from "react-icons/fi";
import { useFormContext } from "../../context/FormContext";
import SearchableSelect from "../../components/SearchableSelect/SearchableSelect";
import "./Insurance.css";

const schema = yup.object().shape({
  provider: yup.string().optional(),
  policyNumber: yup.string().optional()
});

const ProviderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="input-prefix-icon">
    <path d="M3 21h18" />
    <path d="M3 10h18" />
    <path d="m5 6 7-3 7 3" />
    <path d="M4 10v11" />
    <path d="M20 10v11" />
    <path d="M8 14v3" />
    <path d="M12 14v3" />
    <path d="M16 14v3" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="dropzone-cloud-icon">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m9 15 3-3 3 3" />
  </svg>
);

const insuranceProviders = [
  { value: "unitedhealth", label: "UnitedHealth Group" },
  { value: "anthem", label: "Anthem Blue Cross" },
  { value: "aetna", label: "Aetna Health Care" },
  { value: "cigna", label: "Cigna Health Insurance" },
  { value: "humana", label: "Humana Insurance" },
  { value: "star-health", label: "Star Health Insurance" },
  { value: "hdfc-ergo", label: "HDFC ERGO General Insurance" }
];

function Insurance() {
  const navigate = useNavigate();
  const { formData, updateFormData, prevStep, goToStep } = useFormContext();

  // Set initial state to empty array instead of utilizing mock default cards
  const [uploadedFiles, setUploadedFiles] = useState(
    formData.insurance.documents?.length > 0 ? formData.insurance.documents : []
  );
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    goToStep(3);
  }, [goToStep]);

  const { register, handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      provider: formData.insurance.provider,
      policyNumber: formData.insurance.policyNumber
    }
  });

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadError("");
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === "file-too-large") {
        setUploadError(`File exceeds 5MB limit`);
      } else {
        setUploadError(`Unsupported file format`);
      }
      return;
    }

    // Process actual uploaded files and generate live local object previews
    const newFiles = acceptedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      status: "Uploaded Successfully",
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80"
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"]
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024
  });

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => {
      const target = prev.find((f) => f.id === fileId);
      if (target?.preview && target.preview.startsWith("blob:")) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const onSubmit = (data) => {
    updateFormData("insurance", { ...data, documents: uploadedFiles });
    navigate("/health-records");
  };

  const handleSkip = () => {
    navigate("/health-records");
  };

  const handleBack = () => {
    prevStep();
    navigate("/medical-history");
  };

  return (
    <div className="page-insurance fade-in">
      <header className="insurance-header-section">
        <div className="insurance-title-block">
          <h2>Insurance Details</h2>
          <p>Add your insurance information for seamless coverage and claims processing.</p>
        </div>
        <div className="support-badge">
          <FiHeadphones className="support-icon" />
          <div className="support-text">
            <span className="support-label">Need Help?</span>
            <a href="#" className="support-link">Contact Support</a>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="insurance-main-form">
        <Controller
          name="provider"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Insurance Provider"
              options={insuranceProviders}
              placeholder="Select insurance provider (Optional)"
              searchPlaceholder="Search Insurance Provider"
              icon={ProviderIcon}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className="form-input-field-group">
          <label className="field-form-label">Customer ID / Policy Number</label>
          <div className="field-input-container-wrapper">
            <FiCreditCard className="input-prefix-icon" />
            <input
              type="text"
              placeholder="Enter Customer ID or Policy Number (Optional)"
              className="field-custom-input-element"
              {...register("policyNumber")}
            />
          </div>
        </div>

        <div className="form-input-field-group">
          <label className="field-form-label">Upload Insurance Card (Optional)</label>
          <div {...getRootProps()} className={`insurance-file-dropzone ${isDragActive ? "active" : ""}`}>
            <input {...getInputProps()} />
            <CloudUploadIcon />
            <p className="dropzone-primary-info-text">Drag and drop your insurance cards here, or <span className="text-highlight-teal">browse</span></p>
            <p className="dropzone-secondary-info-text">JPG, PNG or PDF (Max. 5MB, multiple cards supported)</p>
          </div>
          {uploadError && <span className="upload-validation-error">{uploadError}</span>}
          <div className="insurance-clarity-warning-alert">
            <span className="clarity-info-icon">ⓘ</span>
            <span className="clarity-text-message">Make sure all card fields are clearly visible before submitting</span>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="insurance-uploaded-cards-grid">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="insurance-uploaded-card">
                  <div className="insurance-card-media">
                    <img src={file.preview} alt={file.name} className="insurance-card-img-preview" />
                  </div>
                  <div className="insurance-card-details">
                    <div className="insurance-card-row-title">
                      <span className="insurance-card-name-label">{file.name}</span>
                      <span className="insurance-card-type-badge">{file.type?.includes("pdf") ? "PDF" : "Image"}</span>
                    </div>
                    <span className="insurance-card-size-label">{(file.size / 1024).toFixed(1)} KB</span>
                    <div className="insurance-card-footer">
                      <span className="insurance-card-status-flag">{file.status}</span>
                      <button type="button" className="insurance-card-cancel-btn" onClick={() => removeFile(file.id)}>
                        <FiX className="insurance-cancel-icon" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="insurance-action-control-panel">
          <button type="button" className="action-button-skip-teal" onClick={handleSkip}>Skip for now</button>
          <div className="action-button-right-alignment-set">
            <button type="button" className="action-button-back-gray" onClick={handleBack}>Go Back</button>
            <button type="submit" className="action-button-submit-teal">Upload Health Records</button>
          </div>
        </footer>
      </form>
    </div>
  );
}

export default Insurance;
