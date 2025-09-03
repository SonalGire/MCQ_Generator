import os
import asyncio
import re
from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from .embedding import *
from langchain.prompts import ChatPromptTemplate

load_dotenv()

# 1. Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.7,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# 2. Async RAG pipeline
async def generate_mcqs_from_file(file_path: str, options_per_question: int = None) -> dict:
    try:
        vectordb, file_id = embedding(file_path)

        # Retrieve top 20 chunks
        docs = vectordb.similarity_search("", k=10)
        sop_content = "\n\n".join([doc.page_content for doc in docs])

        # Generate prompt & chain
        prompt = build_mcq_prompt(options_per_question=options_per_question)
        chain = prompt | llm | StrOutputParser()
        quiz_text = await asyncio.to_thread(chain.invoke, {"content": sop_content})

        # Parse output
        quiz_json = parse_quiz_text_to_json(quiz_text)

        return {
            "file_id": file_id,
            "quiz": quiz_json,
            "raw_output": quiz_text
        }

    except Exception as e:
        return {"error": str(e)}


# 4. Convert raw LLM output into structured JSON
def parse_quiz_text_to_json(raw_text: str) -> dict:
    """
    Convert raw text from LLM to structured JSON where questions are in a single list.
    Each question has its type: 'single' or 'multiple'.
    """
    quiz = []
    blocks = re.split(r"\n(?=Q\d+\.)", raw_text.strip())

    for block in blocks:
        lines = block.strip().splitlines()
        parsed = parse_question_block(lines)
        if parsed and parsed["question"]:
            parsed["no_of_options"] = len(parsed["options"])
            # If question type is multiple, validate 5 options and at least 2 correct answers
            if parsed["type"] == "Multiple":
                if len(parsed["options"]) != 5:
                    continue  # Skip if not exactly 5 options
                if len(parsed["answer"]) < 2:
                    continue  # Skip if less than 2 correct answers
            quiz.append(parsed)

    return quiz


def parse_question_block(lines: list) -> dict:
    q_text = ""
    options = []
    answer = []
    q_type = "Single"  # default

    # Support dynamic number of options (A., B., C., D., E.)
    option_pattern = re.compile(r"^([A-Ea-e])\.\s*(.+)$")
    option_map = {}
    
    for line in lines:
        line = line.strip()

        # Extract question
        if line.startswith("Q"):
            q_text = re.sub(r"^Q\d+\.\s*", "", line)

        # Extract options dynamically
        match = option_pattern.match(line)
        if match:
            label, text = match.groups()
            option_map[label.upper()]= text.strip()
            options.append(text.strip())

        # Extract answer
        if line.lower().startswith("answer:"):
            raw_answer = line.split(":", 1)[1].strip().upper()
            answers = re.split(r"[,\s]+", raw_answer)
            answer_labels = [a for a in answers if a]
             # Convert labels to text using option_map
            answer_texts = [option_map[a] for a in answer_labels if a in option_map]

            # Determine question type
            if len(answer_texts) > 1:
                q_type = "Multiple"
                answer = ",".join([f"'{txt}'" for txt in answer_texts])
            elif len(answer_texts)==1:
                q_type = "Single"
                answer = f"{answer_texts[0]}"
            else:
                answer = ""

            return {
                "type": q_type,
                "question": q_text.strip(),
                "options": options,
                "answer": answer
            }
