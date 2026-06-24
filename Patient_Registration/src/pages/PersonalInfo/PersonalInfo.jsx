import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { FiUser, FiPhone, FiMail, FiCalendar, FiDroplet, FiMapPin, FiHeadphones } from "react-icons/fi";
import { useFormContext, steps } from "../../context/FormContext";
import Input from "../../components/Input/Input";
import SearchableSelect from "../../components/SearchableSelect/SearchableSelect";
import Button from "../../components/Button/Button";
import "./PersonalInfo.css";

const schema = yup.object().shape({
  fullName: yup.string().required("Please enter your full name!").min(3, "Minimum 3 characters"),
  dateOfBirth: yup.string().required("Please select your date of birth!"),
  gender: yup.string().required("Please select your gender!"),
  bloodGroup: yup.string().required("Please select your blood group!"),
  phone: yup.string().required("Please enter your phone number!").matches(/^\+?\d{7,15}$/, "Enter a valid phone number"),
  email: yup.string().email("Enter a valid email address!").optional().nullable(),
  state: yup.string().required("Please select your state!"),
  city: yup.string().required("Please select your current city!")
});

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" }
];

const bloodGroupOptions = [
  { value: "O+", label: "O+" },
  { value: "A+", label: "A+" },
  { value: "B+", label: "B+" },
  { value: "AB+", label: "AB+" },
  { value: "O-", label: "O-" },
  { value: "A-", label: "A-" },
  { value: "B-", label: "B-" },
  { value: "AB-", label: "AB-" }
];

const stateOptions = [
  { value: "andhra-pradesh", label: "Andhra Pradesh" },
  { value: "delhi", label: "Delhi" },
  { value: "karnataka", label: "Karnataka" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" }
];

const cityData = {
  "andhra-pradesh": [{ value: "visakhapatnam", label: "Visakhapatnam" }, { value: "vijayawada", label: "Vijayawada" }],
  "delhi": [{ value: "new-delhi", label: "New Delhi" }, { value: "dwarka", label: "Dwarka" }],
  "karnataka": [{ value: "bangalore", label: "Bangalore" }, { value: "mysore", label: "Mysore" }],
  "maharashtra": [{ value: "mumbai", label: "Mumbai" }, { value: "pune", label: "Pune" }],
  "tamil-nadu": [{ value: "chennai", label: "Chennai" }, { value: "coimbatore", label: "Coimbatore" }],
  "telangana": [{ value: "hyderabad", label: "Hyderabad" }, { value: "warangal", label: "Warangal" }]
};

function PersonalInfo() {
  const navigate = useNavigate();
  const { formData, updateFormData, goToStep } = useFormContext();
  const [cities, setCities] = useState([]);

  const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: formData.personalInfo,
    mode: "all"
  });

  const selectedState = watch("state");

  useEffect(() => {
    goToStep(0);
  }, [goToStep]);

  useEffect(() => {
    if (selectedState && cityData[selectedState]) {
      setCities(cityData[selectedState]);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const onSubmit = (data) => {
    updateFormData("personalInfo", data);
    navigate("/additional-info");
  };

  return (
    <div className="page-personal fade-in">
      <div className="personal-header">
        <div className="header-left">
          <h2>Personal Information</h2>
          <p>Add your basic information to complete your profile and personalize your healthcare journey.</p>
        </div>
        <div className="support-badge">
          <FiHeadphones className="support-icon" />
          <div className="support-text">
            <span className="support-label">Need Help?</span>
            <a href="#" className="support-link">Contact Support</a>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="personal-form">
        <div className="form-grid">
          <Input
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            required
            icon={FiUser}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            required
            icon={FiCalendar}
            error={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+91 9876 543 210"
            required
            icon={FiPhone}
            error={errors.phone?.message}
            {...register("phone")}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email (optional)"
            icon={FiMail}
            error={errors.email?.message}
            {...register("email")}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Gender"
                required
                options={genderOptions}
                placeholder="Select your gender"
                icon={FiUser}
                error={errors.gender?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="bloodGroup"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Blood Group"
                required
                options={bloodGroupOptions}
                placeholder="Select your blood group"
                searchPlaceholder="Search Blood Group"
                icon={FiDroplet}
                error={errors.bloodGroup?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="State"
                required
                options={stateOptions}
                placeholder="Select state"
                searchPlaceholder="Search State"
                icon={FiMapPin}
                error={errors.state?.message}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("city", "");
                }}
              />
            )}
          />

          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Current City"
                required
                options={cities}
                placeholder="Select your current city"
                searchPlaceholder='Search "City"'
                disabled={!selectedState}
                icon={FiMapPin}
                error={errors.city?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="required-fields-banner">
          <span className="banner-asterisk">★</span> These fields are required!
        </div>

        <div className="personal-actions">
          <Button type="submit" size="lg" className="add-info-btn">
            Add Additional Information
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalInfo;
