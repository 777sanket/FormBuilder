import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { viewForm } from "../../services/formApi";
import { submitFormResponse } from "../../services/responseApi";
import styles from "./ViewPage.module.css";

export default function ViewPage() {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { formId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await viewForm(formId);
        const data = await res.json();
        setFormData(data);

        const initialValues = {};
        data.formElements.forEach((element) => {
          initialValues[element._id] = "";
        });
        setFormValues(initialValues);
      } catch (error) {
        console.error("Error fetching form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  const handleInputChange = (id, value) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    formData.formElements.forEach((element) => {
      if (element.required && !formValues[element._id]) {
        newErrors[element._id] = "This field is required";
        isValid = false;
      }

      if (element.type === "email" && formValues[element._id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues[element._id])) {
          newErrors[element._id] = "Please enter a valid email address";
          isValid = false;
        }
      }

      if (element.type === "number" && formValues[element._id]) {
        if (isNaN(Number(formValues[element._id]))) {
          newErrors[element._id] = "Please enter a valid number";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedResponses = {};

    formData.formElements.forEach((element) => {
      formattedResponses[element.label] = formValues[element._id];
    });

    setIsSubmitting(true);
    try {
      await submitFormResponse(formId, formattedResponses);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const initialValues = {};
    formData.formElements.forEach((element) => {
      initialValues[element._id] = "";
    });
    setFormValues(initialValues);

    setErrors({});
  };

  const renderFormInput = (element) => {
    const { _id, type, label, placeholder } = element;
    const inputType = type.toUpperCase();
    const hasError = errors[_id];

    switch (inputType) {
      case "TEXT":
        return (
          <>
            <input
              type="text"
              id={_id}
              value={formValues[_id] || ""}
              onChange={(e) => handleInputChange(_id, e.target.value)}
              placeholder={placeholder || "Enter text"}
              className={`${styles.formInput} ${
                hasError ? styles.inputError : ""
              }`}
            />
            {hasError && (
              <div className={styles.errorMessage}>{errors[_id]}</div>
            )}
          </>
        );
      case "NUMBER":
        return (
          <>
            <input
              type="number"
              id={_id}
              value={formValues[_id] || ""}
              onChange={(e) => handleInputChange(_id, e.target.value)}
              placeholder={placeholder || "Enter number"}
              className={`${styles.formInput} ${
                hasError ? styles.inputError : ""
              }`}
            />
            {hasError && (
              <div className={styles.errorMessage}>{errors[_id]}</div>
            )}
          </>
        );
      case "EMAIL":
        return (
          <>
            <input
              type="email"
              id={_id}
              value={formValues[_id] || ""}
              onChange={(e) => handleInputChange(_id, e.target.value)}
              placeholder={placeholder || "Enter email"}
              className={`${styles.formInput} ${
                hasError ? styles.inputError : ""
              }`}
            />
            {hasError && (
              <div className={styles.errorMessage}>{errors[_id]}</div>
            )}
          </>
        );
      case "PASSWORD":
        return (
          <>
            <input
              type="password"
              id={_id}
              value={formValues[_id] || ""}
              onChange={(e) => handleInputChange(_id, e.target.value)}
              placeholder={placeholder || "Enter password"}
              className={`${styles.formInput} ${
                hasError ? styles.inputError : ""
              }`}
            />
            {hasError && (
              <div className={styles.errorMessage}>{errors[_id]}</div>
            )}
          </>
        );
      case "DATE":
        return (
          <>
            <input
              type="date"
              id={_id}
              value={formValues[_id] || ""}
              onChange={(e) => handleInputChange(_id, e.target.value)}
              className={`${styles.formInput} ${
                hasError ? styles.inputError : ""
              }`}
            />
            {hasError && (
              <div className={styles.errorMessage}>{errors[_id]}</div>
            )}
          </>
        );

      case "TEXTAREA":
        return (
          <>
            <textarea
              id={_id}
              value={formValues[_id] || ""}
              onChange={(e) => handleInputChange(_id, e.target.value)}
              placeholder={placeholder || "Enter text here"}
              rows="4"
              className={`${styles.formTextArea} ${
                hasError ? styles.inputError : ""
              }`}
            ></textarea>
            {hasError && (
              <div className={styles.errorMessage}>{errors[_id]}</div>
            )}
          </>
        );
      case "FILE":
        return (
          <>
            <div className={styles.fileInputWrapper}>
              <input
                type="file"
                id={_id}
                onChange={(e) =>
                  handleInputChange(_id, e.target.files[0]?.name || "")
                }
                className={styles.fileInput}
              />
              <label
                htmlFor={_id}
                className={`${styles.fileInputLabel} ${
                  hasError ? styles.inputError : ""
                }`}
              >
                {formValues[_id] || "Choose file"}
              </label>
            </div>
            {hasError && (
              <div className={styles.errorMessage}>{errors[_id]}</div>
            )}
          </>
        );
      case "COLOR":
        return (
          <>
            <input
              type="color"
              id={_id}
              value={formValues[_id] || "#000000"}
              onChange={(e) => handleInputChange(_id, e.target.value)}
              className={styles.colorInput}
            />
            {hasError && (
              <div className={styles.errorMessage}>{errors[_id]}</div>
            )}
          </>
        );
      default:
        return (
          <>
            <input
              type="text"
              id={_id}
              value={formValues[_id] || ""}
              onChange={(e) => handleInputChange(_id, e.target.value)}
              placeholder={placeholder || "Enter value"}
              className={`${styles.formInput} ${
                hasError ? styles.inputError : ""
              }`}
            />
            {hasError && (
              <div className={styles.errorMessage}>{errors[_id]}</div>
            )}
          </>
        );
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading form...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>Could not load the form. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={styles.viewPageContainer}>
      <div className={styles.formHeader}>
        <h1>{formData.title || "Untitled Form"}</h1>
        <p className={styles.formDescription}>Please fill out the form below</p>
      </div>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          {formData.formElements.map((element, index) => (
            <div key={element._id} className={styles.formElement}>
              <label htmlFor={element._id} className={styles.formLabel}>
                {element.label}
                {element.required && (
                  <span className={styles.requiredStar}>*</span>
                )}
              </label>
              {renderFormInput(element)}
            </div>
          ))}
        </div>

        <div className={styles.formActionButtons}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
