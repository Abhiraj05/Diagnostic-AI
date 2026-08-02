from dotenv import load_dotenv
import requests

load_dotenv()

# extract text from image using ocr api
def extract_image_text(file_path):
    with open(file_path, "rb") as f:
        response = requests.post(
            "https://api.ocr.space/parse/image",
            files={"file": f},
            data={
                "apikey": "API_KEY",
                "language": "eng"
            }
        )

    result = response.json()
    if result.get("OCRExitCode") != 1:
        raise Exception(result.get("ErrorMessage", "OCR failed"))

    return result["ParsedResults"][0]["ParsedText"]
