from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough, RunnableParallel
from langchain_core.output_parsers import StrOutputParser
from rag.schemas.chatbot_schema import ChatResponse
from rag.schemas.report_output_schema import ReportValuesResponse
from rag.schemas.summary_output_schema import SummaryOutput
from rag.vector.vector_store import create_or_get_vector_db

model = ChatGoogleGenerativeAI(model="gemini-3-flash-preview")
structured_model1 = model.with_structured_output(ReportValuesResponse)
structured_model2 = model.with_structured_output(SummaryOutput)
structured_model3 = model.with_structured_output(ChatResponse)

# extracts the report values from the document
def extract_report_values(report_text):
    parser = StrOutputParser()

    prompt = PromptTemplate(
        template="""
    You are a medical report information extraction assistant.

    Extract the laboratory values from the given medical report text.

    Report Text:
    {report_text}

    Extract the following parameters:
    - Hemoglobin
    - WBC count
    - Platelet count
    - Blood sugar
    - HbA1c
    - Total cholesterol
    - HDL cholesterol
    - LDL cholesterol
    - Triglycerides
    - Creatinine
    - eGFR
    - AST/SGOT
    - ALT/SGPT
    - TSH
    - Vitamin D

    Instructions:
    - Extract only the values present in the report.
    - Map different names of the same test correctly (example: Hb = Hemoglobin, SGOT = AST, SGPT = ALT).
    - Return null for any value that is not available in the report.
    - Extract numeric values only, without units.
    - Do not calculate or estimate missing values.
    - Do not provide explanations.
    - Do not summarize the report.
    """,
        input_variables=["report_text"]
    )
    final_chain = prompt | structured_model1 | parser
    response = final_chain.invoke({"report_data": report_text})

    if not response:
        return None
    else:
        return response


# generates summary based on report values
def generate_summary(report_dict):
    parser = StrOutputParser()

    prompt = PromptTemplate(
        template="""
    You are an experienced medical report analysis assistant.

    The following is a patient's blood test report as a Python dictionary.

    Blood Test Report:
    {report_data}

    Your task is to analyze every parameter in the report.

    For each parameter:
    1. Mention the parameter name and its value.
    2. Explain what the parameter measures.
    3. State whether the value is Normal, Low, High, or Borderline using standard adult reference ranges.
    4. If the value is abnormal:
    - Explain the possible causes.
    - Describe the potential health risks.
    - Suggest precautions and lifestyle changes.
    - Recommend foods that may help improve the value.
    - Mention when the patient should consult a healthcare professional.
    5. If the value is normal:
    - State that it is within the normal range.
    - Suggest how to maintain healthy levels.

    After analyzing all parameters, provide:

    ## Overall Health Summary
    - Summarize the patient's overall health based on the report.

    ## Key Findings
    - List any abnormal or borderline values in order of importance.

    ## Diet Recommendations
    - Recommend foods to include and foods to limit.

    ## Lifestyle Recommendations
    - Exercise
    - Sleep
    - Hydration
    - Stress management

    ## Precautions
    - Mention any precautions the patient should take.

    ## Follow-up Tests
    - Suggest additional tests only if they may be useful based on abnormal findings.

    Guidelines:
    - Use simple, patient-friendly language.
    - Be accurate and evidence-based.
    - Do not make a definitive diagnosis.
    - Do not prescribe medications.
    - If all values are normal, clearly mention that the report is generally healthy and provide preventive health advice.
    - If a value is missing or null, state that it was not available for analysis.

    Respond using Markdown with clear headings and bullet points.
    """,
        input_variables=["report_data"],
    )
    final_chain = prompt | structured_model2 | parser
    response = final_chain.invoke({"report_data": report_dict})

    if not response:
        return None
    else:
        return response


# joints the documents text to form context
def join_text(retrieved_docs):
    context = "\n\n".join(doc.page_content for doc in retrieved_docs)
    return context


# answers the user query based on context
def answer_user_query(user_id, file_id, user_message, chat_history):
    vector_db = create_or_get_vector_db()
    parser = StrOutputParser()
    retriever = vector_db.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5},
        filter={
            'user_id': user_id,
            'file_id': file_id
        }
    )

    prompt = PromptTemplate(
        template="""
    You are an AI assistant specializing in explaining medical laboratory reports.

    Medical Report Context:
    {context}

    Previous Chat History:
    {chat_history}

    User Question:
    {question}

    Instructions:
    - The medical report context has been retrieved from a knowledge base. Base your answer only on the information in the provided context.
    - Answer the user's question clearly and accurately.
    - If the question refers to a lab test, explain:
    - What the test measures.
    - What the reported value indicates.
    - Whether the value appears Low, Normal, Borderline, or High (using commonly accepted adult reference ranges, when appropriate).
    - General lifestyle, diet, and precautionary measures if the value is abnormal.
    - If the user asks for an overall report summary, summarize all the available findings from the provided context.
    - Do not make a definitive diagnosis.
    - Do not prescribe medications.
    - If the required information is not present in the context, reply:
    "I don't know based on the provided medical report."

    Answer in a clear, patient-friendly manner using headings and bullet points where appropriate.
    """,
        input_variables=["context", "question", "chat_history"],
    )

    parallel_chain = RunnableParallel({
        "context": retriever | RunnableLambda(join_text),
        "question": RunnablePassthrough(),
        "chat_history": RunnableLambda(lambda x: x["chat_history"])
    })

    final_chain = parallel_chain | prompt | structured_model3 | parser

    response = final_chain.invoke({
        "question": user_message,
        "chat_history": chat_history
    })

    if not response:
        return None
    else:
        return response
