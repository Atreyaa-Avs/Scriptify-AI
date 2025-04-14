import os
import warnings
warnings.filterwarnings("ignore")  
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import torch
from transformers import AutoProcessor, AutoModelForCausalLM, logging
logging.set_verbosity_error()
from PIL import Image

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
processor = AutoProcessor.from_pretrained("stepfun-ai/GOT-OCR-2.0-hf")
model = AutoModelForCausalLM.from_pretrained("stepfun-ai/GOT-OCR-2.0-hf").to(device)

def extract_text_from_image():
    folder_path = "./HandToText"
    image_file = os.listdir(folder_path)[0]
    image_path = os.path.join(folder_path, image_file)

    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt").to(device)

    generated_ids = model.generate(**inputs)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

    keyword = "OCR: assistant"
    after_text = generated_text.split(keyword, 1)[-1].strip() if keyword in generated_text else ""

    return after_text
