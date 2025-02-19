import os
os.environ['USER_AGENT'] = 'YourAppName/1.0'

from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import GPT4AllEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import create_retrieval_chain
from langchain_ollama.llms import OllamaLLM
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# Initialize Ollama model
ollama = OllamaLLM(base_url='http://localhost:11434', model='deepseek-r1:8b')

# Load documents from a webpage
loader = WebBaseLoader('https://en.wikipedia.org/wiki/Vocea_Rom%C3%A2niei_season_8')
data = loader.load()

# Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
all_splits = text_splitter.split_documents(data)

# Create vectorstore with embeddings
vectorstore = Chroma.from_documents(documents=all_splits, embedding=GPT4AllEmbeddings())

# Create a prompt template
prompt = ChatPromptTemplate.from_template("""Answer the following question based only on the provided context:

<context>
{context}
</context>

Question: {input}""")

# Create a document chain
document_chain = create_stuff_documents_chain(ollama, prompt)

# Create a retrieval-based QA chain
qachain = create_retrieval_chain(retriever=vectorstore.as_retriever(), combine_docs_chain=document_chain)

# Ask a question
question = "What is the history of Vocea României season 8?"
response = qachain.invoke({"input": question})
print(response)
