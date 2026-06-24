import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { FiChevronDown, FiPhone, FiHeadphones } from "react-icons/fi";
import { useFormContext } from "../../context/FormContext";
import Button from "../../components/Button/Button";
import SearchableSelect from "../../components/SearchableSelect/SearchableSelect";
import "./AdditionalInfo.css";

const bpRegex = /^\d{2,3}\/\d{2,3}$/;

const schema = yup.object().shape({
  heightUnit: yup.string().required(),
  height: yup.number()
    .transform((val, orig) => orig === "" ? undefined : val)
    .required("Please enter height")
    .when("heightUnit", {
      is: "cm",
      then: (schema) => schema.min(50, "Height should be between 50 and 250 cm.").max(250, "Height should be between 50 and 250 cm."),
      otherwise: (schema) => schema.min(1.5, "Height should be between 1.5 and 8.5 ft.").max(8.5, "Height should be between 1.5 and 8.5 ft.")
    }),
  weightUnit: yup.string().required(),
  weight: yup.number()
    .transform((val, orig) => orig === "" ? undefined : val)
    .required("Please enter weight")
    .when("weightUnit", {
      is: "kg",
      then: (schema) => schema.min(2, "Weight should be between 2 and 500 kg.").max(500, "Weight should be between 2 and 500 kg."),
      otherwise: (schema) => schema.min(4, "Weight should be between 4 and 1100 lb.").max(1100, "Weight should be between 4 and 1100 lb.")
    }),
  bloodPressure: yup.string().required("Please enter blood pressure").matches(bpRegex, "Enter blood pressure in the format: 120/80 mmHg."),
  bloodSugar: yup.number().transform((val, orig) => orig === "" ? undefined : val).required("Please enter blood sugar").min(0, "Blood sugar cannot be negative."),
  physicalActivityLevel: yup.string().required("Please select your activity level."),
  dietaryPreference: yup.string().required("Please select a valid dietary preference."),
  smokingStatus: yup.string().required("Please select a valid smoking status."),
  alcoholConsumption: yup.string().required("Please select a valid alcohol consumption preference."),
  emergencyContactRelation: yup.string().required("Please select your relationship with the emergency contact."),
  emergencyContactPhone: yup.string().required("Emergency contact is required").matches(/^\+?\d{7,15}$/, "Please enter a valid phone number.")
});

const activityOptions = [
  { value: "sedentary", label: "Sedentary" },
  { value: "lightly-active", label: "Lightly Active" },
  { value: "moderately-active", label: "Moderately Active" },
  { value: "very-active", label: "Very Active" }
];

const dietaryOptions = [
  { value: "no-preference", label: "No Preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "non-vegetarian", label: "Non-Vegetarian" }
];

const smokingOptions = [
  { value: "never", label: "Never Smoked" },
  { value: "former", label: "Former Smoker" },
  { value: "occasional", label: "Occasional Smoker" },
  { value: "regular", label: "Regular Smoker" }
];

const alcoholOptions = [
  { value: "never", label: "Never" },
  { value: "occasionally", label: "Occasionally" },
  { value: "regular", label: "Regularly" }
];

const relationOptions = [
  { value: "relative", label: "Relative" },
  { value: "spouse", label: "Spouse" },
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Friend" }
];

function AdditionalInfo() {
  const navigate = useNavigate();
  const { formData, updateFormData, prevStep, goToStep } = useFormContext();

  const [heightDropdownOpen, setHeightDropdownOpen] = useState(false);
  const [weightDropdownOpen, setWeightDropdownOpen] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: formData.additionalInfo,
    mode: "all"
  });

  const heightUnit = watch("heightUnit") || "cm";
  const weightUnit = watch("weightUnit") || "kg";

  useEffect(() => {
    goToStep(1);
  }, [goToStep]);

  // Handle clicks outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".height-unit-container")) {
        setHeightDropdownOpen(false);
      }
      if (!e.target.closest(".weight-unit-container")) {
        setWeightDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = (data) => {
    updateFormData("additionalInfo", data);
    navigate("/medical-history");
  };

  const handleSkip = () => {
    navigate("/medical-history");
  };

  const handleBack = () => {
    prevStep();
    navigate("/");
  };

  return (
    <div className="page-additional fade-in">
      <header className="additional-header">
        <div className="header-left">
          <h2>Additional Information</h2>
          <p>Enhance your profile with optional details for a more personalized healthcare journey.</p>
        </div>
        <div className="support-badge">
          <FiHeadphones className="support-icon" />
          <div className="support-text">
            <span className="support-label">Need Help?</span>
            <a href="#" className="support-link">Contact Support</a>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="additional-form">
        <div className="form-grid">
          {/* HEIGHT FIELD */}
          <div className={`input-group ${errors.height ? "has-error" : ""}`}>
            <label className="input-label">Height</label>
            <div className="input-wrapper-suffix">
              <input
                type="number"
                step="any"
                placeholder={heightUnit === "cm" ? "180" : "5.9"}
                className="custom-field-input"
                {...register("height")}
              />
              <input type="hidden" {...register("heightUnit")} />

              <div
                className="field-suffix-container height-unit-container"
                onClick={() => setHeightDropdownOpen(!heightDropdownOpen)}
              >
                <div className="suffix-trigger-inner">
                  <FiChevronDown className={`suffix-chevron ${heightDropdownOpen ? "rotated" : ""}`} />
                  <span className="unit-text">{heightUnit}</span>
                </div>

                {heightDropdownOpen && (
                  <div className="unit-dropdown-menu">
                    <button
                      type="button"
                      className={`unit-dropdown-item ${heightUnit === "cm" ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("heightUnit", "cm", { shouldValidate: true });
                        setHeightDropdownOpen(false);
                      }}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      className={`unit-dropdown-item ${heightUnit === "ft" ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("heightUnit", "ft", { shouldValidate: true });
                        setHeightDropdownOpen(false);
                      }}
                    >
                      ft
                    </button>
                  </div>
                )}
              </div>
            </div>
            {errors.height && <span className="field-error-message">{errors.height.message}</span>}
          </div>

          {/* WEIGHT FIELD */}
          <div className={`input-group ${errors.weight ? "has-error" : ""}`}>
            <label className="input-label">Weight</label>
            <div className="input-wrapper-suffix">
              <input
                type="number"
                step="any"
                placeholder={weightUnit === "kg" ? "75" : "165"}
                className="custom-field-input"
                {...register("weight")}
              />
              <input type="hidden" {...register("weightUnit")} />

              <div
                className="field-suffix-container weight-unit-container"
                onClick={() => setWeightDropdownOpen(!weightDropdownOpen)}
              >
                <div className="suffix-trigger-inner">
                  <FiChevronDown className={`suffix-chevron ${weightDropdownOpen ? "rotated" : ""}`} />
                  <span className="unit-text">{weightUnit}</span>
                </div>

                {weightDropdownOpen && (
                  <div className="unit-dropdown-menu">
                    <button
                      type="button"
                      className={`unit-dropdown-item ${weightUnit === "kg" ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("weightUnit", "kg", { shouldValidate: true });
                        setWeightDropdownOpen(false);
                      }}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      className={`unit-dropdown-item ${weightUnit === "lb" ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("weightUnit", "lb", { shouldValidate: true });
                        setWeightDropdownOpen(false);
                      }}
                    >
                      lb
                    </button>
                  </div>
                )}
              </div>
            </div>
            {errors.weight && <span className="field-error-message">{errors.weight.message}</span>}
          </div>

          {/* BLOOD PRESSURE */}
          <div className={`input-group ${errors.bloodPressure ? "has-error" : ""}`}>
            <label className="input-label">Blood Pressure (If Known)</label>
            <div className="input-wrapper-suffix no-chevron">
              <input type="text" placeholder="120/80" className="custom-field-input" {...register("bloodPressure")} />
              <div className="field-suffix-container">
                <span className="unit-text">mmHg</span>
              </div>
            </div>
            {errors.bloodPressure && <span className="field-error-message">{errors.bloodPressure.message}</span>}
          </div>

          {/* BLOOD SUGAR */}
          <div className={`input-group ${errors.bloodSugar ? "has-error" : ""}`}>
            <label className="input-label">Blood Sugar (If Known)</label>
            <div className="input-wrapper-suffix no-chevron">
              <input type="number" placeholder="100" className="custom-field-input" {...register("bloodSugar")} />
              <div className="field-suffix-container">
                <span className="unit-text">mg/dL</span>
              </div>
            </div>
            {errors.bloodSugar && <span className="field-error-message">{errors.bloodSugar.message}</span>}
          </div>

          <Controller
            name="physicalActivityLevel"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Physical Activity Level"
                options={activityOptions}
                placeholder="Select Activity"
                error={errors.physicalActivityLevel?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="dietaryPreference"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Dietary Preference"
                options={dietaryOptions}
                placeholder="Select Dietary Preference"
                error={errors.dietaryPreference?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="smokingStatus"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Smoking Status"
                options={smokingOptions}
                placeholder="Select Smoking Status"
                error={errors.smokingStatus?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="alcoholConsumption"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Alcohol Consumption"
                options={alcoholOptions}
                placeholder="Select Alcohol Consumption"
                error={errors.alcoholConsumption?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="emergencyContactRelation"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Emergency Contact Relationship *"
                options={relationOptions}
                placeholder="Select Relationship"
                error={errors.emergencyContactRelation?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div className={`input-group ${errors.emergencyContactPhone ? "has-error" : ""}`}>
            <label className="input-label">Emergency Contact Number *</label>
            <div className="phone-input-wrapper">
              <FiPhone className="phone-prefix-icon" />
              <input type="tel" placeholder="+91 98765 43210" className="custom-field-input phone-padded" {...register("emergencyContactPhone")} />
            </div>
            {errors.emergencyContactPhone && <span className="field-error-message">{errors.emergencyContactPhone.message}</span>}
          </div>
        </div>

        <div className="action-button-row">
          <button type="button" className="skip-for-now-btn" onClick={handleSkip}>Skip for now</button>
          <div className="action-button-right-group">
            <button type="button" className="go-back-text-btn" onClick={handleBack}>Go Back</button>
            <Button type="submit" size="lg" className="add-medical-history-btn">Add Medical History</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdditionalInfo;
