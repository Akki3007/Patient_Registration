import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiX, FiCheckCircle, FiFile, FiImage } from "react-icons/fi";
import "./Upload.css";

function Upload({ label, name, value = [], onChange, error, required = false, maxFiles = 5, maxSize = 5 * 1024 * 1024, accept = { "image/*": [".png", ".jpg", ".jpeg"], "application/pdf": [".pdf"] }, helperText }) {
  const [uploadError, setUploadError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setUploadError("");

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setUploadError(`File "${rejection.file.name}" exceeds ${maxSize / 1024 / 1024}MB limit`);
        } else if (rejection.errors[0]?.code === "too-many-files") {
          setUploadError(`Maximum ${maxFiles} files allowed`);
        } else {
          setUploadError(`"${rejection.file.name}" has an invalid format`);
        }
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        })
      );

      const updated = [...value, ...newFiles].slice(0, maxFiles);
      onChange(updated);
    },
    [value, onChange, maxFiles, maxSize]
  );

  const removeFile = (fileId) => {
    const updated = value.filter((f) => f.id !== fileId);
    updated.forEach((f) => {
      if (f.preview && f.preview.startsWith("blob:")) {
        URL.revokeObjectURL(f.preview);
      }
    });
    onChange(updated);
  };

  const getFileIcon = (file) => {
    if (file.type?.startsWith("image/")) return FiImage;
    return FiFile;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled: value.length >= maxFiles,
  });

  const inputId = `upload-${name}`;

  return (
    <div className={`upload-group ${error ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={inputId} className="upload-label">
          {label}
          {required && <span className="upload-required">*</span>}
        </label>
      )}

      <div
        {...getRootProps()}
        className={`upload-dropzone ${isDragActive ? "drag-active" : ""} ${
          value.length >= maxFiles ? "upload-full" : ""
        }`}
      >
        <input {...getInputProps()} id={inputId} />
        <FiUploadCloud className="upload-icon" />
        {isDragActive ? (
          <p className="upload-text">Drop files here...</p>
        ) : (
          <>
            <p className="upload-text">
              Drag & drop files here, or <span className="upload-browse">browse</span>
            </p>
            <p className="upload-hint">
              Supported formats: Images, PDF (Max {maxSize / 1024 / 1024}MB, up to {maxFiles} files)
            </p>
          </>
        )}
      </div>

      {(uploadError || error) && (
        <span className="upload-error-msg">{uploadError || error}</span>
      )}
      {helperText && !error && !uploadError && (
        <span className="upload-helper">{helperText}</span>
      )}

      {value.length > 0 && (
        <ul className="upload-files">
          {value.map((file) => {
            const FileIcon = getFileIcon(file);
            return (
              <li key={file.id} className="upload-file-item">
                {file.preview ? (
                  <img src={file.preview} alt={file.name} className="upload-file-preview" />
                ) : (
                  <div className="upload-file-icon">
                    <FileIcon />
                  </div>
                )}
                <div className="upload-file-info">
                  <span className="upload-file-name">{file.name}</span>
                  <span className="upload-file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <FiCheckCircle className="upload-file-success" />
                <button
                  type="button"
                  className="upload-file-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                >
                  <FiX />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Upload;
