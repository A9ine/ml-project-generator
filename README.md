# ML Notebook Generator

## Overview 
The ML Notebook Generator is an AI-driven system that creates personalized Jupyter notebooks for hands-on machine learning practice. Users can select a machine learning algorithm (currently linear or logistic regression) and specify a project theme. The system then generates tailored datasets and code based on the selected algorithm and theme. For more detailed information check out our [blog.](https://github.com/A9ine/ml-project-generator/blob/main/blog.md)


## Features
- **Personalized Learning**: Users can choose the ML algorithm and project theme to create a customized learning experience.
- **AI-Generated Data**: The system generates realistic datasets based on the user’s preferences.
- **Comprehensive Notebooks**: Each generated notebook contains executable Python code and explanatory markdown.

## How to Run

### Prerequisites
- **NVIDIA AI Workbench**
- **Check `requirements.txt`** for necessary Python packages and dependencies:
  ```bash
  pip install -r requirements.txt

### Steps
1. **Build Frontend**:
   - Navigate to the `code/web/src` directory.
   - Run the following command to build the frontend:
     ```bash
     npm run build
     ```
2. **Start Backend**:
   - Open a terminal and navigate to the `api` folder.
   - Initialize the database by running:
     ```bash
     python3 db/db.py
     ```
   - Start the backend server:
     ```bash
     python3 app.py
     ```

The application should now be running, and you can interact with the ML Notebook Generator.
