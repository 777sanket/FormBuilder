import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFormResponses } from "../../services/responseApi";
import styles from "./Response.module.css";

export default function Response() {
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const { formId } = useParams();

  useEffect(() => {
    const fetchResponses = async () => {
      setIsLoading(true);
      try {
        const data = await getFormResponses(formId);
        setResponseData(data);

        if (data.responses && data.responses.length > 0) {
          setSelectedResponse(data.responses[0]);
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading responses...</p>
      </div>
    );
  }

  if (!responseData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>Could not load form responses. Please try again later.</p>
      </div>
    );
  }

  if (responseData.responses.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>No Responses Yet</h2>
        <p>This form has not received any submissions yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.responsePageContainer}>
      <div className={styles.responseHeader}>
        <h1>Responses for: {responseData.form.title}</h1>
        <p className={styles.responseCount}>
          {responseData.responses.length}{" "}
          {responseData.responses.length === 1 ? "response" : "responses"}{" "}
          received
        </p>
      </div>

      <div className={styles.responseContent}>
        <div className={styles.responseList}>
          <h2>All Submissions</h2>
          <div className={styles.responseCards}>
            {responseData.responses.map((response) => (
              <div
                key={response._id}
                className={`${styles.responseCard} ${
                  selectedResponse && selectedResponse._id === response._id
                    ? styles.selectedCard
                    : ""
                }`}
                onClick={() => setSelectedResponse(response)}
              >
                <div className={styles.responseCardHeader}>
                  <h3>
                    Submission #{responseData.responses.indexOf(response) + 1}
                  </h3>
                  <span className={styles.responseDate}>
                    {formatDate(response.createdAt)}
                  </span>
                </div>
                <div className={styles.responseSummary}>
                  {Object.keys(response.responses)
                    .slice(0, 2)
                    .map((label) => (
                      <div key={label} className={styles.responseLine}>
                        <strong>{label}:</strong>{" "}
                        {typeof response.responses[label] === "boolean"
                          ? response.responses[label]
                            ? "Yes"
                            : "No"
                          : response.responses[label] || "N/A"}
                      </div>
                    ))}
                  {Object.keys(response.responses).length > 2 && (
                    <div className={styles.moreIndicator}>
                      +{Object.keys(response.responses).length - 2} more fields
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.responseDetail}>
          <h2>Response Details</h2>
          {selectedResponse ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <h3>
                  Submission #
                  {responseData.responses.indexOf(selectedResponse) + 1}
                </h3>
                <span className={styles.detailDate}>
                  {formatDate(selectedResponse.createdAt)}
                </span>
              </div>
              <div className={styles.detailFields}>
                {Object.keys(selectedResponse.responses).map((label) => (
                  <div key={label} className={styles.detailField}>
                    <div className={styles.fieldLabel}>{label}</div>
                    <div className={styles.fieldValue}>
                      {typeof selectedResponse.responses[label] === "boolean"
                        ? selectedResponse.responses[label]
                          ? "Yes"
                          : "No"
                        : selectedResponse.responses[label] || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noSelectionMessage}>
              <p>Select a response from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
