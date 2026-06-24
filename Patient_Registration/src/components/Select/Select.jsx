import { forwardRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import "./Select.css";

const Select = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      onBlur,
      options = [],
      placeholder = "Select...",
      error,
      required = false,
      disabled = false,
      icon: Icon,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputId = `select-${name}`;

    return (
      <div className={`select-group ${error ? "has-error" : ""} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="select-label">
            {label}
            {required && <span className="select-required">*</span>}
          </label>
        )}
        <div className="select-wrapper">
          {Icon && (
            <span className="select-icon">
              <Icon />
            </span>
          )}
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`select-field ${Icon ? "has-icon" : ""} ${
              !value ? "placeholder-shown" : ""
            }`}
            ref={ref}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="select-chevron" />
        </div>
        {error && <span className="select-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
