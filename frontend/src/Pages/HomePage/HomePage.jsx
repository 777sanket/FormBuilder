import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllForm, deleteForm } from "../../services/formApi";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllForm();
      const data = await res.json();
      setData(data);
    };
    fetchData();
  }, []);
  const navigate = useNavigate();
  console.log("data", data);

  const handleClick = () => {
    navigate("/form");
  };

  const handleView = (id) => {
    navigate(`/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleResponse = (id) => {
    navigate(`/response/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;

    const res = await deleteForm(id);
    try {
      if (res.status === 200) {
        const newData = data.filter((item) => item._id !== id);
        console.log("newData", newData);
        setData(newData);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Welcome to FormBuilder.com</div>
        <p>This is a Simple form builder</p>
        <button className={styles.btn} onClick={handleClick}>
          CREATER NEW FORM
        </button>
        <div className={styles.lineContainer}></div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.main}>
          <div className={styles.text1}>Forms</div>
          {data.length === 0 ? (
            <div className={styles.noForm}>No forms available</div>
          ) : (
            <div className={styles.formCards}>
              {data.map((item) => (
                <div className={styles.formCard} key={item._id}>
                  <div className={styles.formTitle}>{item.title}</div>
                  <div className={styles.classBtn}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => handleView(item._id)}
                    >
                      VIEW
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(item._id)}
                    >
                      EDIT
                    </button>
                    <button
                      className={styles.responseBtn}
                      onClick={() => handleResponse(item._id)}
                    >
                      RESPONSE
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item._id)}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
