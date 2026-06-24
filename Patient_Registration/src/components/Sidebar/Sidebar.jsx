import { useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiFileText, FiHeart, FiShield, FiFolder, FiCheckCircle, FiClock, FiCheck } from "react-icons/fi";
import { useFormContext, steps } from "../../context/FormContext";
import "./Sidebar.css";

const iconMap = {
  "Personal Details": FiUser,
  "Additional Information": FiHeart,
  "Medical History": FiFileText,
  "Insurance Information": FiShield,
  "Health Records": FiFolder,
  "Review & Complete": FiCheckCircle,
};

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentStep, goToStep } = useFormContext();

  const handleStepClick = (index) => {
    if (index <= currentStep + 1) {
      goToStep(index);
      navigate(steps[index].path);
    }
  };

  const activeStepMeta = steps[currentStep] || steps[0];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            <path d="M12 5v14M9 12h6"/>
          </svg>
        </div>
        <div className="sidebar-header-text">
          <h2>MediConnect</h2>
          <span>Healthcare Ecosystem</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="timeline-line"></div>
        {steps.map((step, index) => {
          const Icon = iconMap[step.label] || FiUser;
          const isActive = location.pathname === step.path;
          const isCompleted = index < currentStep;
          const isAccessible = index <= currentStep + 1;

          return (
            <button
              key={step.id}
              className={`sidebar-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${!isAccessible ? "locked" : ""}`}
              onClick={() => handleStepClick(index)}
              disabled={!isAccessible}
            >
              <div className="sidebar-item-icon-container">
                <div className="sidebar-item-icon">
                  {isCompleted ? <FiCheck className="checkmark-icon" /> : <Icon />}
                </div>
              </div>
              <span className="sidebar-item-label">{step.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-progress-card">
          <span className="progress-title">Profile Progress</span>
          <h3 className="progress-percentage">{activeStepMeta.percentage}% Complete</h3>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${activeStepMeta.percentage}%` }}
            />
          </div>
          <div className="estimated-time">
            <FiClock className="time-icon" />
            <span>Estimated Time: {activeStepMeta.time}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
