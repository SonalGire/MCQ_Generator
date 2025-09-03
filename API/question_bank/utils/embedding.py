import os
import uuid
import hashlib
from pathlib import Path
from langchain_community.document_loaders import UnstructuredFileLoader  
from langchain_community.document_loaders import PyPDFLoader, TextLoader 
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.docstore.document import Document
from langchain.prompts import ChatPromptTemplate


def clean_unicode(text):
        replacements = {
            "\u201c": '"', "\u201d": '"',
            "\u2018": "'", "\u2019": "'",
            "\u2013": "-", "\u2014": "-",
            "\u2022": "*", "\xa0": " ",
            "\u200b": "", "\ufeff": "",
        }
        for bad, good in replacements.items():
            text = text.replace(bad, good)
        return text.encode("utf-8", "ignore").decode("utf-8")

def get_file_hash(file_path):
    with open(file_path, 'rb') as f:
        file_bytes = f.read()
    return hashlib.md5(file_bytes).hexdigest()


# Step 1: Clean and load content
def process_file(file_path, file_id):
    ext = os.path.splitext(file_path)[1].lower()
    file_name = os.path.basename(file_path)

    if ext == ".pdf":
        loader = PyPDFLoader(file_path)
    elif ext == ".txt":
        loader = TextLoader(file_path)
    elif ext == ".docx":
        loader = UnstructuredFileLoader(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
    
    docs = loader.load()
    return [Document(page_content=clean_unicode(doc.page_content),
                metadata ={"file_id": file_id, "file_name": file_name })
                for doc in docs]



# Step 2: Split content into chunks
def split_docs(docs, chunk_size=1000, chunk_overlap=200):
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return splitter.split_documents(docs)




# Step 3: Save to ChromaDB (avoid re-embedding)
def embedding(file_path, base_dir ="chroma_db"):
    file_id = get_file_hash(file_path)
    persist_dir = os.path.join(base_dir, file_id)

    embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    # Avoid Re-embedding issue if already exists
    if Path(persist_dir).exists():
        print(f"✅ Already embedded: {file_path}")
        vectordb = Chroma(persist_directory=persist_dir, embedding_function=embedding_model)
    else:
        print(f"Embedding: {file_path}")
        docs = process_file(file_path, file_id)
        split = split_docs(docs)
        vectordb = Chroma.from_documents(
                documents= split,
                embedding=embedding_model,
                persist_directory=persist_dir
            )
        vectordb.persist()

    return vectordb,file_id



def build_mcq_prompt(options_per_question=None):

    prompt = ChatPromptTemplate.from_template(f"""
    You are an expert content analyst and training material developer.
    From the given content below, generate exactly 10 objective-type questions:

    - 5 questions must be "Single" type (True/False, Yes/No, or standard MCQs)
    - 5 questions must be "Multiple" type (where more than one answer can be correct)

    ### Hard Rules:
    1. For Multiple type questions:
       - If user provided number of options, follow that exactly or if user not provided any number then give exactly 5 options.
       - At least 2 correct answers if possible with given options.
    2. For Single type questions:
        - Yes/No or True/False → 2 options only
        - Core concepts, key steps, and important practices from the content
        - Real-world application and decision-making
        - Critical knowledge a person must remember to perform the task
    3. **Questions should focus on:**
        - Core concepts, key steps, and important practices from the content
        - Real-world application and decision-making
        - Critical knowledge a person must remember to perform the task
    4. **Do NOT**:
        - Ask about page numbers, headings, or section names
        - Use trivial questions like "What is written under Section 3?"
        - Include hints like "(type: multiple)" in the question text
    5. If question contains single answer then provide it Radio button and if contains multiple answers then use check box.

    6. Do NOT use headings, section names, or metadata from the content in any question or option.
    8. Questions must test conceptual understanding, compliance requirements, and practical application—not document structure.
    9. Questions must be clear, concise, and relevant to the content provided.

    ### Output Format:
    type: Single
    Q<number>. <Question text>
    A. <Option A>
    B. <Option B>
    [C. <Option C>]
    [D. <Option D>]
    Answer: <Correct Option(s)>

    type: Multiple
    Q<number>. <Question text>
    A. <Option A>
    B. <Option B>
    C. <Option C>
    D. <Option D>
    E. <Option E>
    Answer: <Correct Option(s)>

    ---
    Content:
    {{content}}
    """)
    return prompt