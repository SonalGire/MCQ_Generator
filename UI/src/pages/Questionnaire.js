import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Questionnaire = ({ quizData }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizData && Array.isArray(quizData)) {
      setQuestions(quizData);
      setLoading(false);
    } else {
      setError('❌ No quiz data provided. Please upload a file first.');
      setLoading(false);
    }
  }, [quizData]);

  const handleSelectQuestion = (index) => {
    setSelectedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleContinue = () => {
    const filteredQuestions = questions.filter((_, i) => selectedQuestions.includes(i));
    if (filteredQuestions.length === 0) {
      alert('Please select at least one question.');
      return;
    }
    setSubmitted(true);
    navigate("/selected-questions", { state: { selectedQuestions: filteredQuestions } }); // ✅ Correct route
  };

  return (
    <div className="questionnaire-container">
      <style>
        {`
        .questionnaire-container {
          max-width: 900px;
          margin: auto;
          padding: 2rem;
          background: #fefefe;
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', sans-serif;
        }
        .question-block {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #ddd;
          position: relative;
        }
        .select-checkbox {
          position: absolute;
          top: 10px;
          right: 10px;
          transform: scale(1.2);
        }
        .options {
          margin-top: 0.5rem;
        }
        .options li {
          list-style-type: none;
          margin-bottom: 5px;
        }
        .correct-answer {
          color: green;
          font-weight: bold;
        }
        .text-end {
          text-align: right;
        }
      `}
      </style>

      {!submitted && (
        <>
          <h3>📋 Generated Questions (Select to Include)</h3>
          <p className="text-muted">Choose the questions you want to keep for the final selection.</p>
        </>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && !submitted && (
        <>
          {questions.map((q, i) => {
            const options = q.options || [];
            const correctAnswers = Array.isArray(q.answer)
              ? q.answer.map(a => a.trim().toLowerCase())
              : q.answer.split(',').map(ans => ans.replace(/['"]+/g, '').trim().toLowerCase());

            return (
              <div key={`q-${i}`} className="question-block">
                <input
                  type="checkbox"
                  className="select-checkbox"
                  checked={selectedQuestions.includes(i)}
                  onChange={() => handleSelectQuestion(i)}
                />
                <h6>Q{i + 1}. {q.question}</h6>
                <ul className="options">
                  {options.map((opt, idx) => {
                    const isCorrect = correctAnswers.includes(opt.trim().toLowerCase());
                    return (
                      <li key={idx} className={isCorrect ? "correct-answer" : ""}>
                        {String.fromCharCode(65 + idx)}. {opt} {isCorrect && "✔"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          <div className="text-end mt-4">
            <Button color="primary" onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Questionnaire;
