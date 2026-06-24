import "./Card.css";

function Card({ children, title, icon: Icon, className = "" }) {
  return (
    <div className={`form-section-card ${className}`}>
      {(title || Icon) && (
        <div className="section-card-header">
          {Icon && (
            <div className="section-card-icon-wrapper">
              <Icon />
            </div>
          )}
          {title && <h3 className="section-card-title">{title}</h3>}
        </div>
      )}
      <div className="section-card-body">{children}</div>
    </div>
  );
}

export default Card;
