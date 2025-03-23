// const URL = "http://localhost:3000/api/form";
const URL = "https://formbuilder-3um8.onrender.com/api/form";

export const getAllForm = async () => {
  return fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteForm = async (formId) => {
  return fetch(`${URL}/deleteForm/${formId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const viewForm = async (formId) => {
  return fetch(`${URL}/${formId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createForm = async (formData) => {
  try {
    const res = await fetch(`${URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Form creation failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Error creating form:", error.message);
    throw error;
  }
};

export const editForm = async (formId, formData) => {
  try {
    const res = await fetch(`${URL}/${formId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Form edit failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Error editing form:", error.message);
    throw error;
  }
};
