import { useState, useRef, useEffect, forwardRef } from "react";
import { FiChevronDown, FiSearch, FiCheck } from "react-icons/fi";
import "./SearchableSelect.css";

const SearchableSelect = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search options...",
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className = ""
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`searchable-select-group ${error ? "has-error" : ""} ${className}`} ref={dropdownRef}>
      {label && (
        <label className="select-label">
          {label} {required && <span className="select-required">*</span>}
        </label>
      )}
      <div className="select-relative-wrapper">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`select-trigger-btn ${Icon ? "has-icon" : ""} ${!selectedOption ? "placeholder-shown" : ""}`}
        >
          {Icon && <span className="select-icon-left"><Icon /></span>}
          <span className="trigger-text-value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <FiChevronDown className={`select-chevron-arrow ${isOpen ? "open" : ""}`} />
        </button>

        {isOpen && (
          <div className="select-dropdown-container">
            <div className="dropdown-search-wrapper">
              <FiSearch className="dropdown-search-icon" />
              <input
                type="text"
                className="dropdown-search-input"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="dropdown-options-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`dropdown-option-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <FiCheck className="option-check-icon" />}
                    </button>
                  );
                })
              ) : (
                <div className="no-options-found">No options match your search</div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
});

SearchableSelect.displayName = "SearchableSelect";
export default SearchableSelect;
