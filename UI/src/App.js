// App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UploadContentFile from './pages/UploadContentFile';
import Questionnaire from './pages/Questionnaire';
import ExamPage from './pages/ExamPage';
import SelectedQuestionnaire from './pages/SelectedQuestionnaire'; 
import ScoreBoard from './pages/ScoreBoard';

const App = () => {
  const [quizData, setQuizData] = useState(null);

  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Upload Page */}
      <Route
        path="/upload-file"
        element={<UploadContentFile onContinue={(data) => setQuizData(data)} />}
      />

      {/* Questionnaire Page */}
      <Route
        path="/questionnaire"
        element={
          quizData ? (
            <Questionnaire quizData={quizData} />
          ) : (
            <Navigate to="/upload-file" />
          )
        }
      />

      {/* Selected Questions Page */}
      <Route path="/selected-questions" element={<SelectedQuestionnaire />} />
      <Route path="/exam" element={<ExamPage />} />
      <Route path="/scoreboard" element={<ScoreBoard />} />
      

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
