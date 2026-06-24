import { FiLoader } from "react-icons/fi";
import "./Button.css";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? "btn-full" : ""} ${
        loading ? "btn-loading" : ""
      } ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <FiLoader className="btn-spinner" />}
      {!loading && Icon && iconPosition === "left" && (
        <Icon className="btn-icon" />
      )}
      <span className={loading ? "btn-text-hidden" : ""}>{children}</span>
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="btn-icon btn-icon-right" />
      )}
    </button>
  );
}

export default Button;
