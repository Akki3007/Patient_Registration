import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeadphones, FiCheckCircle, FiXCircle, FiLock, FiEye, FiEyeOff, FiRefreshCw, FiCopy, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { useFormContext } from "../../context/FormContext";
import "./Review.css";

const ScallopedBadge = () => (
  <svg width="68" height="68" viewBox="0 0 24 24" fill="none" className="badge-svg">
    <path d="M12 2L13.89 3.51L16.29 2.92L17.3 5.17L19.72 5.51L19.82 7.96L21.84 9.35L20.93 11.64L22.2 13.75L20.51 15.42L20.91 17.85L18.57 18.66L18.11 21.07L15.72 20.89L14.43 22.88L12 21.89L9.57 22.88L8.28 20.89L5.89 21.07L5.43 18.66L3.09 17.85L3.49 15.42L1.8 13.75L3.07 11.64L2.16 9.35L4.18 7.96L4.28 5.51L6.7 5.17L7.71 2.92L10.11 3.51L12 2Z" fill="#007f6e" />
    <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const takenId = "7G3H81";
const generatedCodesPool = ["7G3H81", "9R2K5P", "2X4N1W", "5M8B9T", "3K7Z2L", "8J1Y4D"];

function Review() {
  const navigate = useNavigate();
  const { formData, prevStep, resetForm, goToStep } = useFormContext();
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const [patientId, setPatientId] = useState(takenId);
  const [suggestions, setSuggestions] = useState([]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  useEffect(() => {
    goToStep(5);
    handleRefreshSuggestions();
  }, [goToStep]);

  const handleRefreshSuggestions = () => {
    const list = Array.from({ length: 7 }, () => generatedCodesPool[Math.floor(Math.random() * generatedCodesPool.length)]);
    setSuggestions(list);
  };

  const handleApplySuggestion = (code) => {
    setPatientId(code);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`PAT-${patientId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numberOrSymbol: /[\d!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const checkStrength = () => {
    const validCount = Object.values(checks).filter(Boolean).length;
    if (password.length === 0) return { label: "", className: "", width: "0%" };
    if (validCount <= 2) return { label: "Weak", className: "weak", width: "33%" };
    if (validCount === 3) return { label: "Medium", className: "medium", width: "66%" };
    return { label: "Very Good", className: "strong", width: "100%" };
  };

  const strength = checkStrength();
  const passwordsMatch = password === confirmPassword;
  const isIdTaken = patientId === takenId;
  const isFormValid = Object.values(checks).every(Boolean) && passwordsMatch && !isIdTaken;

  const handleBack = () => {
    prevStep();
    navigate("/health-records");
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitted(true);
  };

  const handleNewRegistration = () => {
    resetForm();
    navigate("/");
  };

  if (submitted) {
    const registeredEmail = formData.personalInfo.email || "abcd123@gmail.com";
    return (
      <div className="success-panel-fullscreen fade-in">
        <div className="success-top-header">
          <div className="success-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007f6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 5v14M9 12h6" />
            </svg>
            <div className="success-brand-text">
              <h2>MediConnect</h2>
              <span>Healthcare Ecosystem</span>
            </div>
          </div>
        </div>
        <div className="success-modal-card">
          <div className="success-seal-container">
            <ScallopedBadge />
          </div>
          <h2 className="success-main-title">Account Created Successfully!</h2>
          <p className="success-desc">Your patient account has been created successfully. You can now access your healthcare dashboard and manage your records securely.</p>
          <div className="success-id-segment">
            <span className="success-id-label">Unique ID</span>
            <div className="id-card-display-row">
              <div className="id-segment-pat">PAT</div>
              {patientId.split("").map((char, index) => (
                <div key={index} className="id-segment-char">{char}</div>
              ))}
              <button type="button" className="id-copy-action-btn" onClick={handleCopyToClipboard} title="Copy to clipboard">
                {copied ? <FiCheck style={{ color: "#007f6e" }} /> : <FiCopy />}
              </button>
            </div>
          </div>
          <p className="success-notif-text">Your unique ID has also been sent to <span className="highlight-email">{registeredEmail}</span></p>
          <div className="note-alert-panel">
            <h4 className="note-alert-title">Note</h4>
            <p className="note-alert-content">Use this ID or your registered phone number to securely access your healthcare workspace.</p>
          </div>
          <div className="success-action-footer-grid">
            <button type="button" className="view-profile-link-btn" onClick={handleNewRegistration}>View Profile</button>
            <button type="button" className="go-dashboard-solid-btn" onClick={handleNewRegistration}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-review fade-in">
      <header className="review-main-header">
        <div className="review-title-block">
          <h2>Review & Complete</h2>
          <p>Configure your login credentials to securely manage your healthcare information.</p>
        </div>
        <div className="support-badge">
          <FiHeadphones className="support-icon" />
          <div className="support-text">
            <span className="support-label">Need Help?</span>
            <a href="#" className="support-link">Contact Support</a>
          </div>
        </div>
      </header>

      <form onSubmit={handleCreateProfile} className="review-credentials-form">
        <section className="credentials-sub-section">
          <div className="section-subtitle-container">
            <h3 className="section-headline">Create Your Unique Patient ID</h3>
            <p className="section-headline-hint">This ID will be used to access your health records and services securely</p>
          </div>

          <div className="patient-id-builder-block">
            <label className="custom-group-label">Patient Unique ID</label>
            <div className={`segmented-id-field-wrapper ${isIdTaken ? "has-taken-error" : ""}`}>
              <div className="segmented-pat-block">PAT</div>
              {patientId.split("").map((char, index) => (
                <div key={index} className="segmented-char-block">{char}</div>
              ))}
            </div>

            {isIdTaken ? (
              <div className="auto-generated-notice-row error-state">
                <FiAlertTriangle className="error-triangle-icon" />
                <p className="notice-text-msg">This ID is already taken</p>
              </div>
            ) : (
              <div className="auto-generated-notice-row success-state">
                <FiCheck className="success-check-icon" />
                <p className="notice-text-msg">PAT-{patientId} is available</p>
              </div>
            )}
          </div>

          <div className="suggestions-control-block">
            <div className="suggestions-header-row">
              <span className="suggestions-title-label">Suggestions</span>
              <button type="button" className="suggestions-refresh-btn" onClick={handleRefreshSuggestions}>
                <FiRefreshCw className="refresh-arrow-icon" />
                <span>Refresh</span>
              </button>
            </div>
            <div className="suggestions-cards-layout-grid">
              {suggestions.map((code, idx) => (
                <button key={idx} type="button" className={`suggestion-pill-card ${patientId === code ? "active" : ""}`} onClick={() => handleApplySuggestion(code)}>
                  PAT-{code}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="credentials-sub-section border-top">
          <div className="section-subtitle-container">
            <h3 className="section-headline">Create a strong password</h3>
            <p className="section-headline-hint">Create a strong password with a mix of letters, numbers and symbols</p>
          </div>

          <div className="password-inputs-row-grid">
            <div className="form-input-field-group">
              <label className="field-form-label">Create New Password</label>
              <div className="password-wrapper-input-container">
                <FiLock className="pass-prefix-lock-icon" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="password-custom-input-element"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="pass-suffix-eye-toggle-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="strength-progress-gauge-wrapper">
                  <div className="strength-progress-track">
                    <div className={`strength-progress-fill ${strength.className}`} style={{ width: strength.width }} />
                  </div>
                  <span className={`strength-label-text ${strength.className}`}>{strength.label}</span>
                </div>
              )}
            </div>

            <div className="form-input-field-group">
              <label className="field-form-label">Confirm Password</label>
              <div className={`password-wrapper-input-container ${confirmTouched && !passwordsMatch ? "has-confirm-error" : ""}`}>
                <FiLock className="pass-prefix-lock-icon" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Enter your password again"
                  className="password-custom-input-element"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmTouched(true);
                  }}
                  onBlur={() => setConfirmTouched(true)}
                  required
                />
                <button type="button" className="pass-suffix-eye-toggle-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {confirmTouched && !passwordsMatch && (
                <span className="confirm-validation-error-msg">Confirm password should be same as entered password!</span>
              )}
            </div>
          </div>

          <div className="password-criteria-checklist">
            <span className="checklist-heading">Should Contain:</span>
            <ul className="checklist-items-stack">
              <li className={`checklist-item ${checks.length ? "checked" : "failed"}`}>
                {checks.length ? <FiCheckCircle className="check-status-circle success-badge" /> : <FiXCircle className="check-status-circle failed-badge" />}
                <span>At least 8 Characters</span>
              </li>
              <li className={`checklist-item ${checks.lowercase ? "checked" : "failed"}`}>
                {checks.lowercase ? <FiCheckCircle className="check-status-circle success-badge" /> : <FiXCircle className="check-status-circle failed-badge" />}
                <span>At least one small letter</span>
              </li>
              <li className={`checklist-item ${checks.uppercase ? "checked" : "failed"}`}>
                {checks.uppercase ? <FiCheckCircle className="check-status-circle success-badge" /> : <FiXCircle className="check-status-circle failed-badge" />}
                <span>At least one capital letter</span>
              </li>
              <li className={`checklist-item ${checks.numberOrSymbol ? "checked" : "failed"}`}>
                {checks.numberOrSymbol ? <FiCheckCircle className="check-status-circle success-badge" /> : <FiXCircle className="check-status-circle failed-badge" />}
                <span>At least one number or symbol</span>
              </li>
            </ul>
          </div>
        </section>

        <footer className="credentials-action-control-panel">
          <div className="action-button-right-alignment-set">
            <button type="button" className="action-button-back-gray-text" onClick={handleBack}>Go Back</button>
            <button type="submit" className={`action-button-submit-teal-solid ${!isFormValid ? "disabled" : ""}`} disabled={!isFormValid}>
              Create Profile
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

export default Review;
