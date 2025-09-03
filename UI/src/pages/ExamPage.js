import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ExamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedQuestions = location.state?.selectedQuestions || [];

  const [answers, setAnswers] = useState({});

  const handleSelect = (qid, option) => {
    setAnswers((prev) => {
      const prevOptions = prev[qid] || [];
      if (prevOptions.includes(option)) {
        return {
          ...prev,
          [qid]: prevOptions.filter((o) => o !== option),
        };
      } else {
        return {
          ...prev,
          [qid]: [...prevOptions, option],
        };
      }
    });
  };

  const handleSubmit = () => {
    const total = selectedQuestions.length;
    let correctCount = 0;

    const detailedAnswers = selectedQuestions.map((q, index) => {
      const qid = q.id || index;

      const correctAnswers = Array.isArray(q.answer)
        ? q.answer.map((a) => a.trim().toLowerCase())
        : q.answer.split(',').map((a) => a.trim().toLowerCase());

      const userSelected = answers[qid] || [];
      const userSelectedLower = userSelected.map((o) => o.toLowerCase());

      const isCorrect =
        correctAnswers.length === userSelectedLower.length &&
        correctAnswers.every((ans) => userSelectedLower.includes(ans));

      if (isCorrect) correctCount++;

      return {
        question: q.question,
        correct_answer: Array.isArray(q.answer) ? q.answer.join(', ') : q.answer.replace(/['"\[\]]/g, '').trim(),
        user_answer: userSelected.length > 0 ? userSelected.join(',') : 'Not Answered',
        is_correct: isCorrect,
      };
    });

    navigate('/scoreboard', {
      state: { answers: detailedAnswers, totalScore: correctCount, totalQuestions: total },
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 Start Exam</h2>
      {selectedQuestions.map((q, index) => {
        const qid = q.id || index;
        return (
          <div key={qid} style={styles.questionBlock}>
            <h4>Q{index + 1}. {q.question}</h4>
            <div>
              {q.options && q.options.map((opt, i) => (
                <label key={i} style={{ display: 'block', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    name={`q-${qid}`}
                    value={opt}
                    checked={answers[qid]?.includes(opt)}
                    onChange={() => handleSelect(qid, opt)}
                  /> {opt}
                </label>
              ))}
            </div>
          </div>
        );
      })}
      <button onClick={handleSubmit} style={styles.submitBtn}>Submit Exam</button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: 'auto', marginTop: '3rem', padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'Segoe UI, sans-serif' },
  title: { textAlign: 'center', marginBottom: '1.5rem' },
  questionBlock: { marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' },
  submitBtn: { marginTop: '1rem', padding: '12px 20px', fontSize: '1.2rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'block', marginLeft: 'auto', marginRight: 'auto' }
};

export default ExamPage;
