import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_id = "google/flan-t5-base"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSeq2SeqLM.from_pretrained(model_id)

# Task config dictionary
task_configs = {
    "Summarization": {
        "template": "Summarize the following text in 3-4 sentences: {text}",
        "config": {
            "max_length": 250,
            "min_length": 50,
            "do_sample": True,
            "top_k": 50,
            "top_p": 0.95,
            "temperature": 0.6,
            "num_beams": 4,
            "no_repeat_ngram_size": 2
        }
    },
    "Translation": {
        "template": "Translate this to {language}: {text}",
        "config": {
            "max_length": 100,
            "do_sample": False,
            "temperature": 0.3,
            "num_beams": 4,
        }
    },
}

def run_model(task: str, text: str) -> str:
    task_data = task_configs.get(task.split()[0])  # Use "Translation" part only
    if not task_data:
        return "Unsupported task"

    if task.startswith("Translation "):
        language = task.split(" ", 1)[1]  # Get language, e.g., "French"
        prompt = task_data["template"].format(text=text, language=language)
    else:
        prompt = task_data["template"].format(text=text)

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, **task_data["config"])
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
