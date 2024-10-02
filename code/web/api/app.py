import pandas as pd
import threading
import numpy as np
from datetime import datetime
from flask import Flask, request, jsonify, send_file, Response
import sqlite3
import collections
import smtplib, ssl
import math
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS
import torch
from unsloth import FastLanguageModel
from transformers import AutoTokenizer, TextStreamer
from nbformat.v4 import new_notebook, new_markdown_cell, new_code_cell
import nbformat
import re
import io
import csv
import gc

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://chief-hot-panda.ngrok-free.app"]}})

def db_connection():
    """
    Establishes a connection to the SQLite database.

    :return: connection object if successful, None otherwise
    """
    conn = None
    try:
        conn = sqlite3.connect('/content/drive/Shareddrives/nvidia_hack/nvidia_ai/db/ML.sqlite')
    except sqlite3.error as e:
        print(e)
    return conn

class CaptureStreamer(TextStreamer):
    def __init__(self, tokenizer):
        super().__init__(tokenizer)
        self.captured_text = ""

    def on_finalized_text(self, text: str, stream_end: bool = False):
        self.captured_text += text
        print(text, end="", flush=True)



def fix_single_quotes(code):
    def fix_quotes(match):
        content = match.group(1)
        # Use a regex to find keys and fix their quotes
        pattern = r"(\'?)(\w+)(\'?)\s*:"
        def replace_key(key_match):
            start_quote, key, end_quote = key_match.groups()
            if start_quote == "'" and end_quote == "'":
                return f"{start_quote}{key}{end_quote}:"  # Already correctly quoted
            return f"'{key}':"  # Add quotes to unquoted or partially quoted keys

        fixed_content = re.sub(pattern, replace_key, content)
        return f"pd.DataFrame({fixed_content})"

    # Find and fix the DataFrame creation part
    df_pattern = r'pd\.DataFrame\((.*?)\)'
    fixed_code = re.sub(df_pattern, fix_quotes, code, flags=re.DOTALL)

    return fixed_code

def extract_and_correct_code(captured_text):
    code_match = re.search(r'def generate_dataset\(\):.*?return feature_explanation,\s*df', captured_text, re.DOTALL)
    if code_match:
        code = code_match.group(0)
        corrected_code = fix_single_quotes(code)
        return corrected_code
    else:
        raise ValueError("Could not extract valid Python code from the model output.")

@app.route('/register', methods=['POST'])
def register():
    conn = db_connection()
    cursor = conn.cursor()

    # Extract user details from the request
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email').lower()
    username = data.get('username').lower()
    password = data.get('password')

    # Validate input fields
    if not first_name or not last_name or not email or not username or not password:
        return jsonify({"error": "All fields are required and must not be blank."}), 400

    # Check if the username or email already exists
    cursor.execute("SELECT * FROM users WHERE username = ? OR email = ?", (username, email))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({"error": "Username or email already exists."}), 409  # 409 Conflict

    try:
        # Rest of your code to insert data into the database
        sql = """INSERT INTO users (first_name, last_name, email, username, password, timestamp)
                 VALUES (?, ?, ?, ?, ?, ?)"""
        timestamp = datetime.now().isoformat()
        cursor.execute(sql, (first_name, last_name, email, username, password, timestamp))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 200
    except sqlite3.Error as e:
        print(e)
        return jsonify({"error": "Database error occurred."}), 500
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    conn = db_connection()
    cursor = conn.cursor()

    # Get credentials from request arguments
    data = request.get_json()
    username_or_email = data['username_or_email'].lower()
    password = data['password']

    field = 'email' if '@' in username_or_email and '.' in username_or_email else 'username'

    try:
        # Query the database to find a user
        cursor.execute(f"SELECT user_id, username, first_name FROM users WHERE {field} = ? AND password = ?", (username_or_email, password))
        user = cursor.fetchone()

        if user:
            user_id, username, first_name = user
            return jsonify({"authenticated": True, "user_id": user_id, "username": username, "first_name": first_name}), 200
        else:
            return jsonify({"authenticated": False}), 200
    except sqlite3.Error as e:
        print(e)
        return jsonify({"error": "Database error occurred."}), 500
    finally:
        conn.close()



@app.route('/getVerification', methods=['POST'])
def sendEmail():
    conn = db_connection()
    cursor = conn.cursor()
    data = request.get_json()
    email = data.get('email').lower()

    # Generate verification code
    string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    verification_code = ""
    length = len(string)
    for i in range(6):
        verification_code += string[math.floor(random.random() * length)]

    cursor.execute("SELECT user_id FROM users WHERE email = ?", (email,))
    user_id = cursor.fetchone()

    # Update or insert verification code in the database
    if user_id:
        # Check if a verification code already exists for this user
        cursor.execute("SELECT * FROM verification_codes WHERE user_id = ?", (user_id[0],))
        if cursor.fetchone():
            # Update existing verification code
            cursor.execute("UPDATE verification_codes SET verification_code = ? WHERE user_id = ?", (verification_code, user_id[0]))
        else:
            # Insert new verification code
            cursor.execute("INSERT INTO verification_codes (user_id, verification_code) VALUES (?, ?)", (user_id[0], verification_code))

        conn.commit()

    # Read email template and replace placeholder with actual verification code
    with open('./templates/verification_email.html', 'r', encoding='utf-8') as file:
        email_content = file.read()
        email_content = email_content.replace('{{verification_code}}', verification_code)

    # Email sending setup
    sender_email = "socialtodobot@gmail.com"
    receiver_email = email
    password = "sppg zywg yzqu dymu"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Your Verification Code"
    message["From"] = sender_email
    message["To"] = email

    # Add HTML content to email
    part = MIMEText(email_content, "html")
    message.attach(part)

    # Create secure SSL context and send the email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:  # Replace smtp server and port
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())

    return jsonify({"message": "Verification email sent successfully"}), 200




@app.route('/changePassword', methods=['POST'])
def changePassword():
    conn = db_connection()
    cursor = conn.cursor()

    # Get credentials from request arguments
    data = request.get_json()
    email = data.get('email').lower()
    new_password = data.get('new_password')
    verification_code = data.get('verification_code')

    # Check for missing data
    if not email or not new_password or not verification_code:
        return jsonify({"error": "Email, new password, and verification code are required."}), 400

    try:
        # Verify the verification code
        cursor.execute("SELECT user_id FROM verification_codes WHERE verification_code = ?", (verification_code,))
        verification_data = cursor.fetchone()

        if verification_data:
            user_id = verification_data[0]

            # Verify the email and get the corresponding user_id
            cursor.execute("SELECT user_id FROM users WHERE email = ?", (email,))
            user_data = cursor.fetchone()

            if user_data and user_id == user_data[0]:
                # Update the password
                cursor.execute("UPDATE users SET password = ? WHERE user_id = ?", (new_password, user_id))
                conn.commit()
                return jsonify({"success": "Password updated successfully"}), 200
            else:
                return jsonify({"error": "Invalid email or verification code."}), 401
        else:
            return jsonify({"error": "Invalid verification code."}), 401

    except sqlite3.Error as e:
        print(e)
        return jsonify({"error": "Database error occurred."}), 500
    finally:
        conn.close()

@app.route('/generate-data', methods=['GET', 'POST', 'OPTIONS'])
def generate_data():
    if request.method == "OPTIONS":
        return build_preflight_response()
    elif request.method == "POST":
        result = your_post_processing_function()
        return result

def build_preflight_response():
    response = Response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def build_actual_response(result):
    response = Response(result)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

def your_post_processing_function():
    print("Request received:", request.method)
    print("Headers:", request.headers)
    print("Data:", request.get_json())
    data = request.get_json()
    theme = data['theme']
    algorithm = data['algorithm']


    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name="../../../model/data_generator_model/model",
        max_seq_length=2048,  # Adjust this based on your model's configuration
        dtype=None,
        load_in_4bit=True,
    )


    # Enable faster inference
    FastLanguageModel.for_inference(model)

    # Define your prompt template
    alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

    ### Instruction:
    {}

    ### Input:
    {}

    ### Response:
    {}"""

    # Prepare the input
    inputs = tokenizer(
    [
        alpaca_prompt.format(
            f"""
    You are an AI assistant specialized in creating datasets for machine learning tasks. You excel at generating Python code that produces realistic and meaningful datasets.
    Create a Python function named `generate_dataset()` that generates a dataset for {algorithm} related to {theme}. The function should:

    1. Use only pandas and numpy libraries.
    2. Generate 500 rows of data.
    3. Include 3 features and 1 target variable. (Ensure meaningful relationships between features and the target, based on real-world correlations related to {theme}.)
    4. Use descriptive column names related to {theme}.
    5. Create a string called 'feature_explanation' that explains the relationships between the features and the target.
    6. Return feature_explanation and the DataFrame.
    7. Use a seed for reproducibility.
    8. Provide only the Python code, no additional text.
    9. make sure to format dataframe correctly and not forget any single quotation marks over variables.
    """,
            f"algorithm = '{algorithm}' theme = '{theme}'", # input
            "", # output - leave this blank for generation!
        )
    ], return_tensors = "pt").to("cuda")

    capture_streamer = CaptureStreamer(tokenizer)
    _ = model.generate(**inputs, streamer=capture_streamer, max_new_tokens=256)

    model.cpu()
    del model
    gc.collect()
    torch.cuda.empty_cache()

    try:
        corrected_code = extract_and_correct_code(capture_streamer.captured_text)
        exec(corrected_code, globals())

        # Now we can call the generate_dataset function
        feature_explanation, df = generate_dataset()

        conn = db_connection()
        cursor = conn.cursor()

        sql = """INSERT INTO projects (user_id, theme, description, date_created, algorithm, dataset, last_accessed)
                 VALUES (?, ?, ?, ?, ?, ?, ?)"""
        timestamp = datetime.now().isoformat()
        cursor.execute(sql, (1, theme, feature_explanation, timestamp, algorithm, corrected_code, timestamp))
        conn.commit()
        project_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return data_to_notebook(feature_explanation, df, theme, algorithm, project_id)

        return feature_explanation, df
    except Exception as e:
        raise ValueError(f"Error in processing generated code: {str(e)}")


def data_to_notebook(relationship, df, theme, algorithm, project_id):
  features = list(df.columns)[:-1]
  target = list(df.columns)[-1]
  algorithm= 'logistic regression'
  model, tokenizer = FastLanguageModel.from_pretrained(
    # model_name = "/content/drive/MyDrive/nvidia_ai/model",
    model_name = "../../../model/data_generator_model/model/notebook_generator_model/model",
    max_seq_length = 2048,  # Adjust this based on your model's configuration
    dtype = None,
    load_in_4bit = True,
  )

  # Enable faster inference
  FastLanguageModel.for_inference(model)

  # Define your prompt template
  alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

  ### Instruction:
  {}

  ### Input:
  {}

  ### Response:
  {}"""
  # Prepare the input
  inputs = tokenizer(
  [
      alpaca_prompt.format(
          f"""You are an AI assistant specialized in creating interactive machine learning project tutorials in Jupyter notebook format. Generate a tutorial that follows this structure for each section:

      Include these sections in the following order, adhering to the structure and guidelines for each:

      ## 1. Project Introduction
      Briefly explain the goal of the model using the {theme} and the relationship between {features} and {target} using this information:{relationship}.

      ## 2. Importing Necessary Libraries
      ```python
      # Import required libraries here
      ```

      ## 3. Loading and Exploring Data
      ```python
      # Load the pandas dataset: {df}
      # Display basic statistics
      # Create and display visualizations
      # Add comments interpreting the visualizations, referencing the feature explanation
      ```

      ## 4. Data Preprocessing
      ```python
      # Perform necessary data preprocessing steps
      ```

      ## 5. Model Creation and Training
      ```python
      # Split the data into training and testing sets
      # Create and train the {algorithm} model
      ```

      ## 6. Model Evaluation
      ```python
      # Evaluate the model using appropriate metrics
      # Add comments interpreting the results, referencing the feature explanation
      ```

      Ensure all code is correct, complete, and executable. Avoid redundancy in code or explanations across sections. Provide clear, concise explanations. Make sure to also import matplotlib.pyplot as plt and seaborn as sns""",
          f"""
      Algorithm: {algorithm}
      Theme: {theme}
      Features: {features}
      Target: {target}
      Relationship: {relationship}
      CSV file: {df}
      """, # input
          "", # output - leave this blank for generation!
      )
  ], return_tensors = "pt").to("cuda")

  outputs = model.generate(**inputs, max_new_tokens = 1024, use_cache = True)
  input_string = tokenizer.batch_decode(outputs)[0].split('Response:\n')[1].split('<|eot_id|>')[0]
  model.cpu()
  del model
  gc.collect()
  torch.cuda.empty_cache()
  conn = db_connection()
  cursor = conn.cursor()
  sql = """UPDATE Projects SET notebook = ? WHERE project_id = ?"""
  cursor.execute(sql, (input_string, project_id))
  conn.commit()
  cursor.close()
  conn.close()
  print(input_string)
  return jsonify({"success": True, "projectId": project_id}), 200


@app.route('/download-csv', methods=['GET', 'POST', 'OPTIONS'])
def check():
    if request.method == "OPTIONS":
        return build_preflight_response()
    elif request.method in ["GET", "POST"]:
        return download_csv()
    else:
        return "Method not allowed", 405

def build_preflight_response():
    response = Response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def download_csv():
    project_id = request.args.get('project_id')
    conn = db_connection()
    cursor = conn.cursor()

    try:
        sql = """SELECT dataset, theme FROM Projects WHERE project_id = ?"""
        cursor.execute(sql, (project_id,))
        result = cursor.fetchone()

        if result is None:
            return "Dataset not found", 404

        csv_code, theme = result

        # Create a new namespace with necessary libraries
        exec_globals = {
            'np': np,
            'pd': pd,
            'io': io,
            'csv': csv,
            # Add any other necessary libraries here
        }
        local_namespace = {}

        print("Executing CSV code")
        exec(csv_code, exec_globals, local_namespace)
        print("CSV code executed successfully")

        if 'generate_dataset' not in local_namespace:
            return "generate_dataset function not found in the code", 500

        feature_explanation, df = local_namespace['generate_dataset']()

        if not isinstance(df, pd.DataFrame):
            return "generate_dataset did not return a DataFrame", 500

        print("DataFrame generated successfully")

        # Convert DataFrame to CSV
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)
        theme = theme.replace(" ", "_")
        response = send_file(
            io.BytesIO(csv_buffer.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name=f"{theme}.csv"
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return str(e), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/download-notebook', methods=['GET', 'OPTIONS'])
def check_download_notebook():
    if request.method == "OPTIONS":
        return build_preflight_response()
    elif request.method == "GET":
        return download_notebook()
    else:
        return "Method not allowed", 405

def build_preflight_response():
    response = Response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def download_notebook():
    project_id = request.args.get('project_id')
    conn = db_connection()
    cursor = conn.cursor()
    sql = """SELECT notebook, theme FROM Projects WHERE project_id = ?"""
    cursor.execute(sql, (project_id,))
    result = cursor.fetchone()

    notebook_string = result[0]
    theme = result[1]

    nb = create_notebook_from_string(notebook_string)

    # Use StringIO first, then convert to BytesIO
    string_io = io.StringIO()
    nbformat.write(nb, string_io)

    # Convert to BytesIO
    notebook_file = io.BytesIO(string_io.getvalue().encode('utf-8'))

    try:
        notebook_file.seek(0)
        theme = theme.replace(" ", "_")
        # Send the file
        return send_file(
            notebook_file,
            mimetype='application/x-ipynb+json',
            as_attachment=True,
            download_name=f"{theme}.ipynb"
        )
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(traceback.format_exc())
        return str(e), 500

def create_notebook_from_string(notebook_string):
    # Create a new notebook
    nb = nbformat.v4.new_notebook()

    # Split the string into sections
    sections = re.split(r'##\s*\d+\.', notebook_string)

    # Get the title (first section)
    title = sections[0].strip()
    nb.cells.append(nbformat.v4.new_markdown_cell(title))

    # Process each section
    for section in sections[1:]:
        # Split the section into text and code
        parts = re.split(r'```python', section)

        # Add markdown cell for the text
        if parts[0].strip():
            nb.cells.append(nbformat.v4.new_markdown_cell(parts[0].strip()))

        # Add code cell if there's code
        if len(parts) > 1:
            code = parts[1].split('```')[0].strip()
            # Remove leading spaces from each line of code
            code = '\n'.join(line.lstrip() for line in code.split('\n'))
            nb.cells.append(nbformat.v4.new_code_cell(code))

    return nb


@app.route('/get-notebook', methods=['GET','OPTIONS'])
def check_get_notebook():
    if request.method == "OPTIONS":
        return build_preflight_response()
    elif request.method == "GET":
        return get_notebook()
    else:
        return "Method not allowed", 405

def build_preflight_response():
    response = Response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def get_notebook():
    project_id = request.args.get('project_id')
    conn = db_connection()
    cursor = conn.cursor()
    sql = """SELECT * FROM Projects WHERE project_id = ?"""
    cursor.execute(sql, (project_id,))
    result = cursor.fetchone()

    if result is None:
        return jsonify({"error": "Project not found"}), 404

    # Assuming the columns in your Projects table are in this order:
    # project_id, theme, algorithm, dataset, description
    project_data = {
        "project_id": result[0],
        "theme": result[2],
        "algorithm": result[7],
        "dataset": result[3],
        "description": result[9],
        "is_completed": result[4]
    }

    response = jsonify(project_data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/get-projects', methods=['GET', 'OPTIONS'])
def check_get_projects():
    if request.method == "OPTIONS":
      return build_preflight_response()
    elif request.method == "GET":
      return get_projects()
    else:
      return "Method not allowed", 405

def build_preflight_response():
    response = Response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response
def get_projects():
    conn = db_connection()
    cursor = conn.cursor()

    user_id = request.args.get('user_id')


    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        cursor.execute("SELECT * FROM projects WHERE user_id = ?", (user_id,))
        projects = cursor.fetchall()

        print(projects)

        project_list = []
        for project in projects:
            project_list.append({
                "id": project[0],
                "theme": project[2],
                "algorithm": project[7],
                "created_at": project[5],
                "completed": project[4]
            })

        return jsonify({"projects": project_list}), 200
    except sqlite3.Error as e:
        print(e)
        return jsonify({"error": "Database error occurred."}), 500
    finally:
        conn.close()

@app.route('/complete-project', methods=['POST'])
def complete_project():
    conn = db_connection()
    cursor = conn.cursor()

    try:
        data = request.json
        project_id = data.get('project_id')

        if not project_id:
            return jsonify({"success": False, "message": "Project ID is required"}), 400

        # Update the 'completed' field from 0 to 1
        sql = """UPDATE Projects SET completed = 1 WHERE project_id = ?"""
        cursor.execute(sql, (project_id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"success": False, "message": "No project found with the given ID"}), 404

        return jsonify({"success": True, "message": "Project marked as completed successfully"}), 200

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": "An error occurred while completing the project"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run()