import sqlite3

# Establish a connection to the SQLite database named 'social-to-do.sqlite'
conn = sqlite3.connect("ML.sqlite")

cursor = conn.cursor()

# SQL query to create the 'users' table
create_users_table = """
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        timestamp TEXT NOT NULL
    );
"""

# SQL query to create the 'verification_codes' table
create_verification_codes_table = """
    CREATE TABLE IF NOT EXISTS verification_codes (
        code_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        verification_code TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
"""

# SQL query to create the 'projects' table
create_projects_table = """
    CREATE TABLE IF NOT EXISTS projects (
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        theme TEXT NOT NULL,
        dataset TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0,
        date_created TEXT NOT NULL,
        last_accessed TEXT NOT NULL,
        algorithm TEXT NOT NULL,
        notebook TEXT,
        description TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
"""

# Execute the CREATE TABLE queries
cursor.execute(create_users_table)
cursor.execute(create_verification_codes_table)
cursor.execute(create_projects_table)

# Commit the changes and close the connection
conn.commit()
conn.close()