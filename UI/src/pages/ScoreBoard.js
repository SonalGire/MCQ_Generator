import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ScoreBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers = [], totalScore = 0, totalQuestions = 0 } = location.state || {};

  const getResultBadge = () => {
    const percentage = (totalScore / totalQuestions) * 100;
    if (percentage >= 80) return { text: "🏆 Excellent", color: "#28a745" };
    if (percentage >= 60) return { text: "🎉 Good Job", color: "#ffc107" };
    return { text: "📘 Keep Practicing", color: "#dc3545" };
  };

  const resultBadge = getResultBadge();

  // ✅ Normalize text for case-insensitive comparison
  const normalize = (text) => (text ? text.toLowerCase().trim() : "");

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 Exam Result</h1>

      {/* <div style={styles.scoreSection}>
        <div style={styles.scoreCircle}>
          <h2 style={{ margin: 0 }}>{totalScore} / {totalQuestions}</h2>
        </div>
        <p style={{ ...styles.badge, backgroundColor: resultBadge.color }}>
          {resultBadge.text}
        </p>
      </div> */}

      <div style={styles.reviewContainer}>
        <h3 style={styles.subHeading}>📋 Answer Review</h3>
        {answers.map((a, index) => {
          const isCorrect =
            normalize(a.user_answer) === normalize(a.correct_answer);

          return (
            <div
              key={index}
              style={{
                ...styles.questionCard,
                backgroundColor: isCorrect ? "#e6f9e6" : "#ffe6e6",
              }}
            >
              <h4 style={styles.questionText}>Q{index + 1}. {a.question}</h4>
              <p>
                <strong>Your Answer:</strong>{" "}
                <span style={{ color: isCorrect ? "green" : "red" }}>
                  {a.user_answer}
                </span>
              </p>
              <p><strong>Correct Answer:</strong> {a.correct_answer}</p>
            </div>
          );
        })}
      </div>

      <div style={styles.btnGroup}>
        <button onClick={() => navigate('/')} style={{ ...styles.button, backgroundColor: '#007bff' }}>
          ⬅ Back to Home
        </button>
        <button onClick={() => navigate(-1)} style={{ ...styles.button, backgroundColor: '#28a745' }}>
          🔄 Retry Exam
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    marginTop: "3rem",
    padding: "2rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#222",
  },
  scoreSection: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  scoreCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#f0f0f0",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#171515ff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  badge: {
    display: "inline-block",
    marginTop: "10px",
    padding: "8px 15px",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  reviewContainer: {
    marginTop: "2rem",
  },
  subHeading: {
    marginBottom: "1rem",
    color: "#333",
    fontSize: "1.4rem",
  },
  questionCard: {
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  questionText: {
    marginBottom: "0.5rem",
    color: "#222",
  },
  btnGroup: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  button: {
    padding: "12px 20px",
    fontSize: "1.1rem",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default ScoreBoard;
