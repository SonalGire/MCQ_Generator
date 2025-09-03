<h2>📘 MCQ Generator (RAG-based Quiz System)</h2>

This project is an AI-powered MCQ Generator that creates realistic, practical, and knowledge-testing multiple-choice questions from uploaded documents.

It uses Google Gemini (via LangChain) with RAG (Retrieval-Augmented Generation) to analyze files (.pdf, .docx, .txt, etc.), generate questions with answers, and let users take interactive quizzes.


<h3>🚀 Features</h3>


  ✅ File Upload – Upload .pdf, .docx, or .txt documents.
  
  ✅ MCQ Generation – Automatically generates 10 MCQs (customizable).
  
  ✅ Realistic & Practical – Questions are knowledge-based, not page references.
  
  ✅ Answer Display – Each question comes with its correct answer.
  
  ✅ Question Selection – Choose your favorite/important questions before the exam.
  
  ✅ Interactive Quiz Mode – Selected MCQs are shown in an exam-like interface.
  
  ✅ Scoreboard – After attempting the quiz, results show correct/incorrect answers.


<h4>🛠️ Tech Stack</h4>

  Backend: Django (Python)
  
  Frontend: React.js
  
  Database: PostgreSQL
  
  AI & NLP: LangChain + Google Gemini API
  
  Vector DB (RAG): Chroma DB 
  
  Embeddings: Gemini Embedding Model for semantic search


<h3>⚙️ Installation & Setup</h3>

<h4>1️⃣ Clone the Repository</h4>
    
    git clone https://github.com/yourusername/mcq-generator.git
    cd mcq-generator

<h4>2️⃣ Backend Setup (Django)</h4>

    cd mcq_backend
    python -m venv .venv
    source .venv/bin/activate   # On Windows: .venv\Scripts\activate
    pip install -r requirements.txt

- Configure PostgreSQL database in settings.py.

- Add your Google Gemini API Key in .env:

      GOOGLE_API_KEY=your_api_key_here
- Run migrations:

      python manage.py migrate
- Start Django server:

      python manage.py runserver

<h4>3️⃣ Frontend Setup (React)</h4>

      cd mcq_frontend
      npm install
      npm start


<h3>🖥️ Usage Flow</h3>

1. Upload a File – Choose a .pdf, .docx, or .txt.

2. Generate MCQs – System creates 10 (or custom number) MCQs with answers.

3. Select Questions – Tick the checkboxes for your preferred questions.

4. Take Exam – Only selected questions are shown in exam mode.

5. Submit Quiz – Scoreboard displays correct vs wrong answers.


<h3>📂 Project Structure</h3>
      
    mcq-generator/
    │── backend/              # Django backend
    │   ├── views.py          # Handles API requests
    |   ├──utils
    │     ├── RAG_pipeline.py   # RAG Pipeline
    │     ├── embedding.py      # MCQ Generation Process with embeddings and Prompts
    │   ├── ...
    │
    │── frontend/             # React frontend
    │   ├── src/components/   # UI components(Login Page)
    │   ├── src/pages/        # Upload, Questionnaire, Selected Questions, Quiz, Scoreboard(Result)
    │   ├── ...
    │
    │── postgres/             # Database configs
    │── README.md             # Project documentation

<h3>📊 Example Workflow</h3>

  1. Upload SOP.pdf

  2. Get 10 MCQs like:

         Q1. What is the correct temperature range for storing XYZ drug?
            a) 15–25°C
            b) 30–40°C
            c) Below 10°C
            d) Room temperature
            
            ✅ Answer: a) 15–25°C

  3. Select 5 questions → Exam Mode → Attempt answers → Get scoreboard.

<h3>📌 Future Enhancements</h3>

   - Support for more file formats (.xlsx, .pptx).
  
   - Difficulty-level customization (Easy / Medium / Hard).
  
   - Export MCQs to PDF/Excel.
  
   - Multi-user support with authentication.

<h3>🤝 Contributing</h3>

- Pull requests are welcome. Please open an issue first for any feature requests or bug reports.





    

