from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader

load_dotenv()

# extract text from document
def extract_document_text(file):
    loader = PyPDFLoader(file)
    text = loader.load()
    return text
