import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SelectedQuestionnaire = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedQuestions = location.state?.selectedQuestions || [];

  const handleStartExam = () => {
    navigate('/exam', { state: { selectedQuestions } });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✅ Selected Questions</h1>

      {selectedQuestions.length === 0 ? (
        <p style={styles.error}>No questions selected. Please go back and select some questions.</p>
      ) : (
        <>
          <div style={styles.questionsContainer}>
            {selectedQuestions.map((q, index) => {
              const correctAnswers = Array.isArray(q.answer)
                ? q.answer
                : q.answer.split(',').map((a) => a.trim());

              return (
                <div key={index} style={styles.questionBlock}>
                  <h3 style={styles.question}>Q{index + 1}. {q.question}</h3>
                  <ul style={styles.optionList}>
                    {q.options.map((opt, i) => {
                      const isCorrect = correctAnswers.some(ans => ans.toLowerCase() === opt.toLowerCase());
                      return (
                        <li
                          key={i}
                          style={{
                            ...styles.option,
                            ...(isCorrect ? styles.correctOption : {})
                          }}
                        >
                          {String.fromCharCode(65 + i)}. {opt} {isCorrect && "✔"}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <button onClick={handleStartExam} style={styles.startExamButton}>
            Start Exam
          </button>
        </>
      )}

      <button onClick={() => navigate('/')} style={styles.backButton}>
        ← Back to Home
      </button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: 'auto', marginTop: '3rem', padding: '2rem', background: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'Segoe UI, sans-serif' },
  title: { fontSize: '2rem', marginBottom: '1.5rem', color: '#222', textAlign: 'center' },
  error: { color: 'red', fontWeight: 'bold', textAlign: 'center' },
  questionsContainer: { marginTop: '1rem' },
  questionBlock: { marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' },
  question: { marginBottom: '0.8rem', color: '#333' },
  optionList: { listStyleType: 'none', padding: 0, margin: 0 },
  option: { padding: '5px 0' },
  correctOption: { color: 'green', fontWeight: 'bold' },
  startExamButton: { marginTop: '1.5rem', padding: '12px 25px', fontSize: '1.2rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'block', marginLeft: 'auto', marginRight: 'auto' },
  backButton: { marginTop: '1rem', padding: '10px 20px', fontSize: '1rem', backgroundColor: '#b3d9ff', color: '#003366', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'block', marginLeft: 'auto', marginRight: 'auto' },
};

export default SelectedQuestionnaire;
