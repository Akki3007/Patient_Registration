import { forwardRef } from "react";
import "./Input.css";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      icon: Icon,
      rightIcon: RightIcon,
      helperText,
      maxLength,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputId = `input-${name}`;

    return (
      <div className={`input-group ${error ? "has-error" : ""} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}
        <div className="input-wrapper">
          {Icon && (
            <span className="input-icon-left">
              <Icon />
            </span>
          )}
          {type === "textarea" ? (
            <textarea
              id={inputId}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              maxLength={maxLength}
              className={`input-field input-textarea ${Icon ? "has-icon" : ""}`}
              ref={ref}
              {...props}
            />
          ) : (
            <input
              id={inputId}
              type={type}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              maxLength={maxLength}
              className={`input-field ${Icon ? "has-icon" : ""}`}
              ref={ref}
              {...props}
            />
          )}
          {RightIcon && (
            <span className="input-icon-right">
              <RightIcon />
            </span>
          )}
        </div>
        {error && <span className="input-error">{error}</span>}
        {helperText && !error && (
          <span className="input-helper">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
