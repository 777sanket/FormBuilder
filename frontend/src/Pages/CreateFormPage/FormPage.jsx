import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createForm, viewForm, editForm } from "../../services/formApi";
import DelIcon from "../../assets/del.png";
import styles from "./FormPage.module.css";

export default function FormPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!formId;

  const [formData, setFormData] = useState({
    title: "",
    formElements: [],
  });
  const [viewTitleEditor, setViewTitleEditor] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [viewInputEditor, setViewInputEditor] = useState(false);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);

  const inputTypes = [
    "Text",
    "Number",
    "Email",
    "Password",
    "Date",
    "Textarea",
    "File",
    "Color",
  ];

  useEffect(() => {
    const loadFormData = async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const response = await viewForm(formId);
          const data = await response.json();

          const formattedData = {
            ...data,
            formElements: data.formElements.map((element) => ({
              ...element,
              id: Date.now() + Math.random(),
              type: element.type.toUpperCase(),
            })),
          };

          setFormData(formattedData);
        } catch (error) {
          console.error("Error loading form:", error);
          alert("Failed to load form data. Redirecting to home page.");
          navigate("/");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadFormData();
  }, [formId, isEditMode, navigate]);

  const handleSubmit = async () => {
    if (formData.formElements.length === 0) {
      alert("Please add at least one form element before saving");
      return;
    }

    const cleanedData = {
      title: formData.title,
      formElements: formData.formElements.map(({ id, _id, ...rest }) => ({
        ...rest,
        type: rest.type.toLowerCase(),
      })),
    };

    console.log("cleanedData", cleanedData);

    setIsSubmitting(true);
    try {
      let response;

      if (isEditMode) {
        response = await editForm(formId, cleanedData);
      } else {
        response = await createForm(cleanedData);
      }

      setSuccessMessage(
        isEditMode ? "Form updated successfully!" : "Form saved successfully!"
      );
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error saving form:", error);
      alert(
        `Failed to ${isEditMode ? "update" : "save"} form. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditTitle = () => {
    setViewTitleEditor(true);
    setViewInputEditor(false);
    setCurrentElementId(null);
  };

  const handleEditElement = (id) => {
    setViewInputEditor(true);
    setViewTitleEditor(false);
    setCurrentElementId(id);
  };

  const handleEditInput = (type) => {
    setViewInputEditor(false);
    setViewTitleEditor(false);
    const tempId = Date.now();

    const newElement = {
      id: tempId,
      type: type,
      label: "Title",
      // placeholder: "Enter Placeholder",
      placeholder: `Enter ${type} Here`,
    };

    setFormData((prev) => ({
      ...prev,
      formElements: [...(prev.formElements || []), newElement],
    }));

    setCurrentElementId(null);
  };

  const handleUpdateElement = (e) => {
    const { name, value } = e.target;
    const updatedElements = formData.formElements.map((element) => {
      if (element.id === currentElementId) {
        return {
          ...element,
          [name]: value,
        };
      }
      return element;
    });

    setFormData({
      ...formData,
      formElements: updatedElements,
    });
  };

  const currentElement = formData.formElements.find(
    (element) => element.id === currentElementId
  );

  const handleDeleteElement = (id) => {
    if (id === currentElementId) {
      setViewInputEditor(false);
      setCurrentElementId(null);
    }

    const elementToRemove = document.getElementById(`element-${id}`);
    if (elementToRemove) {
      elementToRemove.classList.add(styles.removing);

      setTimeout(() => {
        const updatedElements = formData.formElements.filter(
          (element) => element.id !== id
        );

        setFormData({
          ...formData,
          formElements: updatedElements,
        });
      }, 300);
    } else {
      const updatedElements = formData.formElements.filter(
        (element) => element.id !== id
      );

      setFormData({
        ...formData,
        formElements: updatedElements,
      });
    }
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newElements = [...formData.formElements];

    const draggedItem = newElements[dragIndex];
    newElements.splice(dragIndex, 1);

    newElements.splice(index, 0, draggedItem);

    setFormData({
      ...formData,
      formElements: newElements,
    });

    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading form data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{isEditMode ? "Edit Form" : "Create New Form"}</h1>
        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update Form"
              : "Save Form"}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <div className={styles.main}>
        <div className={styles.formPreview}>
          <div className={styles.formNameContainer}>
            <div className={styles.formName}>
              <h2>{formData.title ? formData.title : "Untitled Form"}</h2>
              <button
                className={styles.editTitleButton}
                onClick={handleEditTitle}
                aria-label="Edit form title"
              >
                ✎
              </button>
            </div>
          </div>

          <div className={styles.formElements}>
            {formData.formElements.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Your form is empty. Add elements from the panel below.</p>
              </div>
            ) : (
              formData.formElements.map((element, index) => (
                <div
                  key={element.id}
                  id={`element-${element.id}`}
                  className={`${styles.formElement} ${
                    element.id === currentElementId ? styles.activeElement : ""
                  } ${dragIndex === index ? styles.dragging : ""}`}
                  draggable={true}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className={styles.dragHandle}>⠿</div>
                  <div className={styles.elementContent}>
                    <div className={styles.elementHeader}>
                      <h3>{element.label || `${element.type}`}</h3>
                      <span className={styles.elementType}>{element.type}</span>
                    </div>
                    {element.placeholder && (
                      <p className={styles.placeholder}>
                        Placeholder: {element.placeholder}
                      </p>
                    )}
                    {element.required && (
                      <div className={styles.requiredBadge}>Required</div>
                    )}
                    <div className={styles.elementActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditElement(element.id)}
                      >
                        {/* Edit */} ✎
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteElement(element.id)}
                      >
                        {/* Delete  */}
                        <img src={DelIcon} alt="delete" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.inputSelector}>
            {!showInput ? (
              <button
                className={styles.addButton}
                onClick={() => setShowInput(true)}
              >
                + Add Element
              </button>
            ) : (
              <div className={styles.inputTypeSelector}>
                <div className={styles.inputTypeSelectorHeader}>
                  <h3>Choose Element Type</h3>
                  <button
                    className={styles.closeButton}
                    onClick={() => setShowInput(false)}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.inputTypeButtons}>
                  {inputTypes.map((type) => (
                    <button
                      key={type}
                      className={styles.inputTypeButton}
                      onClick={() => handleEditInput(type)}
                    >
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${styles.formEditor} ${
            viewTitleEditor || viewInputEditor ? styles.editorActive : ""
          }`}
        >
          <div className={styles.formEditorHeader}>
            <h2>Form Editor</h2>
            {(viewTitleEditor || viewInputEditor) && (
              <button
                className={styles.closeEditorButton}
                onClick={() => {
                  setViewTitleEditor(false);
                  setViewInputEditor(false);
                  setCurrentElementId(null);
                }}
              >
                ×
              </button>
            )}
          </div>

          {viewTitleEditor && (
            <div className={`${styles.titleEditor} ${styles.editorSection}`}>
              <h3>Form Title</h3>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter form title"
                autoFocus
                className={styles.titleInput}
              />
              <p className={styles.editorHelp}>
                Give your form a clear, descriptive title so users understand
                its purpose.
              </p>
            </div>
          )}

          {viewInputEditor && currentElement && (
            <div className={`${styles.elementEditor} ${styles.editorSection}`}>
              <h3>Edit {currentElement.type} Element</h3>

              <div className={styles.formGroup}>
                <label htmlFor="element-label">Title:</label>
                <input
                  id="element-label"
                  type="text"
                  placeholder="Enter field label"
                  name="label"
                  value={currentElement.label}
                  onChange={handleUpdateElement}
                  autoFocus
                  className={styles.editorInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="element-placeholder">Placeholder:</label>
                <input
                  id="element-placeholder"
                  type="text"
                  placeholder="Enter placeholder text"
                  name="placeholder"
                  value={currentElement.placeholder}
                  onChange={handleUpdateElement}
                  className={styles.editorInput}
                />
              </div>
            </div>
          )}

          {!viewTitleEditor && !viewInputEditor && (
            <div className={styles.noEditorMessage}>
              <div className={styles.emptyEditorIcon}>🖋️</div>
              <p>Select a form element or the title to edit properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
