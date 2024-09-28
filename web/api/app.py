from datetime import datetime
from flask import Flask, request, jsonify
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



app = Flask(__name__)
CORS(app)

def db_connection():
    """
    Establishes a connection to the SQLite database.

    :return: connection object if successful, None otherwise
    """
    conn = None
    try:
        conn = sqlite3.connect('./db/social-to-do.sqlite')
    except sqlite3.error as e:
        print(e)
    return conn

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

@app.route('/generate-data', methods=['POST'])
def generate_data():
    torch.set_default_device("mps")
    data = request.get_json()
    theme = data['theme']
    algorithm = data['algorithm']
    model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "../../models/data-generator/model",
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

    # Set up your generation parameters
    algorithm = 'linear regression'
    theme = 'Coffee'

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
    """,
            f"algorithm = '{algorithm}' theme = '{theme}'", # input
            "", # output - leave this blank for generation!
        )
    ], return_tensors = "pt").to("cuda")

    # Generate text
    text_streamer = TextStreamer(tokenizer)
    _ = model.generate(**inputs, streamer = text_streamer, max_new_tokens = 256)



if __name__ == '__main__':
    app.run(port=2323)