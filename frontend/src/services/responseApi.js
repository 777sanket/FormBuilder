const URL = "http://localhost:3000/api/response";

// Submit form response
export const submitFormResponse = async (formId, responses) => {
  try {
    const res = await fetch(`${URL}/submit/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ responses }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to submit form");
    }

    return await res.json();
  } catch (error) {
    console.error("Error submitting form:", error.message);
    throw error;
  }
};

// Get all responses for a form
export const getFormResponses = async (formId) => {
  try {
    const res = await fetch(`${URL}/${formId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch responses");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching responses:", error.message);
    throw error;
  }
};
