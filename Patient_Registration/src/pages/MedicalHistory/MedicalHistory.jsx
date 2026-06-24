import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { FiHeadphones } from "react-icons/fi";
import { useFormContext } from "../../context/FormContext";
import Button from "../../components/Button/Button";
import "./MedicalHistory.css";

const schema = yup.object().shape({
  allergiesText: yup.string().max(500, "Limit is 500 characters").optional(),
  currentMedications: yup.string().max(500, "Limit is 500 characters").optional(),
  existingConditionsText: yup.string().max(500, "Limit is 500 characters").optional(),
  pastSurgeries: yup.string().max(500, "Limit is 500 characters").optional()
});

function MedicalHistory() {
  const navigate = useNavigate();
  const { formData, updateFormData, prevStep, goToStep } = useFormContext();

  const [allergies, setAllergies] = useState(
    formData.medicalHistory?.allergies || []
  );

  const [existingConditions, setExistingConditions] = useState(
    formData.medicalHistory?.existingConditions || []
  );

  const { register, handleSubmit, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      allergiesText: formData.medicalHistory?.allergiesText || "",
      currentMedications: formData.medicalHistory?.currentMedications || "",
      existingConditionsText: formData.medicalHistory?.existingConditionsText || "",
      pastSurgeries: formData.medicalHistory?.pastSurgeries || ""
    },
    mode: "all"
  });

  useEffect(() => {
    goToStep(2);
  }, [goToStep]);

  const currentMedicationsText = watch("currentMedications") || "";
  const pastSurgeriesText = watch("pastSurgeries") || "";

  // Dynamic tag generation for allergies on pressing Enter or Comma
  const handleAllergiesKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = e.target.value.trim().replace(/,$/, "");
      if (val && !allergies.includes(val)) {
        const updatedAllergies = [...allergies, val];
        setAllergies(updatedAllergies);
        setValue("allergiesText", ""); // Clear the entry field
      }
    }
  };

  // Dynamic tag generation for existing conditions on pressing Enter or Comma
  const handleConditionsKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = e.target.value.trim().replace(/,$/, "");
      if (val && !existingConditions.includes(val)) {
        const updatedConditions = [...existingConditions, val];
        setExistingConditions(updatedConditions);
        setValue("existingConditionsText", ""); // Clear the entry field
      }
    }
  };

  const handleRemoveAllergy = (indexToRemove) => {
    setAllergies(allergies.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveCondition = (indexToRemove) => {
    setExistingConditions(existingConditions.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = (data) => {
    updateFormData("medicalHistory", {
      ...data,
      allergies,
      existingConditions
    });
    navigate("/insurance");
  };

  const handleSkip = () => {
    navigate("/insurance");
  };

  const handleBack = () => {
    prevStep();
    navigate("/additional-info");
  };

  return (
    <div className="page-medical fade-in">
      <header className="medical-header">
        <div className="header-left">
          <h2>Medical History</h2>
          <p>Add information about your past treatments, medications, and health conditions.</p>
        </div>
        <div className="support-badge">
          <FiHeadphones className="support-icon" />
          <div className="support-text">
            <span className="support-label">Need Help?</span>
            <a href="#" className="support-link">Contact Support</a>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="medical-form">
        {/* Allergies Block */}
        <div className="medical-field-group">
          <label className="medical-field-label">Allergies</label>
          <div className="medical-composite-container">
            <textarea
              className="medical-borderless-textarea"
              placeholder="Type any allergy (e.g. Peanuts, Penicillin) and press Enter or Comma to add tag"
              onKeyDown={handleAllergiesKeyDown}
              {...register("allergiesText")}
            />
            {allergies.length > 0 && (
              <div className="composite-pills-row">
                {allergies.map((allergy, index) => (
                  <div key={index} className="composite-pill">
                    <span className="pill-text">{allergy}</span>
                    <button
                      type="button"
                      className="composite-pill-remove"
                      onClick={() => handleRemoveAllergy(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Current Medications Block */}
        <div className="medical-field-group">
          <label className="medical-field-label">Current Medications</label>
          <div className="medical-composite-container with-counter">
            <textarea
              className="medical-borderless-textarea dynamic-textarea"
              placeholder="List your current medications with dosage (e.g., Metformin 500mg daily)"
              maxLength={500}
              {...register("currentMedications")}
            />
            <div className="composite-character-counter">
              {500 - currentMedicationsText.length}/500 Characters left
            </div>
          </div>
        </div>

        {/* Existing Conditions Block */}
        <div className="medical-field-group">
          <label className="medical-field-label">Existing Conditions</label>
          <div className="medical-composite-container">
            <textarea
              className="medical-borderless-textarea"
              placeholder="Type any condition (e.g. Diabetes, Asthma) and press Enter or Comma to add tag"
              onKeyDown={handleConditionsKeyDown}
              {...register("existingConditionsText")}
            />
            {existingConditions.length > 0 && (
              <div className="composite-pills-row">
                {existingConditions.map((condition, index) => (
                  <div key={index} className="composite-pill">
                    <span className="pill-text">{condition}</span>
                    <button
                      type="button"
                      className="composite-pill-remove"
                      onClick={() => handleRemoveCondition(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Previous Surgeries Block */}
        <div className="medical-field-group">
          <label className="medical-field-label">Previous Surgeries</label>
          <div className="medical-composite-container with-counter">
            <textarea
              className="medical-borderless-textarea dynamic-textarea"
              placeholder="Enter details of any past surgeries and corresponding years (e.g., Appendectomy - 2019)"
              maxLength={500}
              {...register("pastSurgeries")}
            />
            <div className="composite-character-counter">
              {500 - pastSurgeriesText.length}/500 Characters left
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="action-button-row">
          <button type="button" className="skip-for-now-btn" onClick={handleSkip}>
            Skip for now
          </button>
          <div className="action-button-right-group">
            <button type="button" className="go-back-text-btn" onClick={handleBack}>
              Go Back
            </button>
            <Button type="submit" size="lg" className="add-insurance-info-btn">
              Add Insurance Information
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MedicalHistory;
