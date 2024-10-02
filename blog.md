# **ML Notebook Generator**

## **Introduction**

In the ever-evolving world of machine learning and data science, staying up-to-date with the latest concepts and techniques can be challenging. Our team set out to address this challenge by developing an AI-driven system that generates customized Jupyter notebooks for learning and practicing machine learning concepts.

## **The Problem We Solved**

Many learners struggle to find relevant, hands-on practice materials that align with their interests and learning goals. Traditional resources often lack personalization and real-world context. Our ML notebook generator bridges this gap by creating tailored learning experiences.

## **Our Solution: The AI Jupyter Notebook Generator**

Our system currently accepts two key inputs from the user:

1. Algorithm Selection:  
   * Users choose between linear regression or logistic regression.  
2. Project Theme:  
   * Users specify a theme for their project (e.g., "I want to work on a project related to marine biology").

While our current algorithm options focus on fundamental regression techniques, we have an ambitious roadmap for expanding our offerings. Future updates will introduce a diverse range of machine learning algorithms, including but not limited to:

* Classification algorithms (e.g., Random Forests, Support Vector Machines)  
* Clustering techniques (e.g., K-Means, Hierarchical Clustering)  
* Dimensionality reduction methods (e.g., Principal Component Analysis)  
* Advanced regression models (e.g., Ridge, Lasso, Elastic Net)  
* Introduction to neural network architectures

Our goal is to create a comprehensive platform that caters to a wide spectrum of machine learning applications, from beginner-friendly concepts to advanced techniques used in industry and research.

## **Pipeline**

Our notebook generation process follows a sophisticated pipeline:

1. User Input: The user selects either logistic regression or linear regression as the algorithm and provides a theme for their project.  
2. Data Generator Model: This AI model takes the user's input and creates a conceptual dataset that fits the chosen algorithm and theme.  
3. Text to Python Conversion: The conceptual dataset is transformed into actual Python code that can generate the data.  
4. Data Extraction: The Python code is executed to create a dataframe with features, a target variable, and a relationship description that aligns with the chosen algorithm and theme.  
5. Jupyter Notebook Generator Model: This AI model takes the algorithm, theme, features, target, and relationship information to create the structure and content of the notebook.  
6. Code and Markdown Generation: The notebook content is converted into executable Python code and explanatory markdown text.  
7. Notebook Creation: Using libraries like nbformat and re, we assemble the code and text into a proper Jupyter notebook structure.  
8. File Conversion: The final step converts the notebook into a downloadable .ipynb file that users can run.

![Pipelilne](/pipeline.jpg)

## **Key Features**

1. Personalized Learning: Users can specify the ML algorithm they want to practice and the theme they're interested in, ensuring a relevant and engaging learning experience.  
2. Real-world Data Simulation: Our data generator creates datasets that mimic real-world scenarios, providing practical experience with data that's relevant to the user's interests.  
3. Comprehensive Notebooks: The generated notebooks include both code implementations and explanatory text, offering a complete learning package.  
4. Scalability: While currently limited to logistic and linear regression, our system's architecture is designed to be easily expandable to cover a wider range of ML topics in the future.

## **Model Implementation**

For our core machine learning model, we implemented a sophisticated fine-tuning process:

* We used Unsloth to implement a LoRA (Low-Rank Adaptation) of the Llama 3.1 8b Instruct model.   
* The model was saved locally using 4-bit quantization to significantly reduce memory usage.  
* We leveraged Unsloth's FastLanguageModel for model loading and optimization.

This combination of techniques allows us to work with an advanced language model while maintaining efficiency and accessibility for our notebook generation task

## **Backend Implementation**

For the backend, we utilized Flask and SQLite. The backend handles user requests, manages the notebook generation pipeline, and serves the generated notebooks to the frontend. Our SQLite database supports the application's data storage needs efficiently.

## **Frontend Implementation**

Our frontend was built using ReactJS and styled with Tailwind CSS. This combination allowed us to create a dynamic, responsive user interface with a consistent design language. The frontend provides an intuitive interface for users to input their algorithm choice and project theme, and then displays the generated notebook content.

## **Impact and Future Directions**

Our ML notebook generator has the potential to revolutionize ML education by providing personalized, hands-on learning experiences. It can benefit:

* Beginners looking for practical introductions to regression techniques  
* Experienced practitioners wanting to quickly practice or refresh their skills in these fundamental algorithms  
* Educators seeking to create diverse, engaging materials for their students

In the future, we plan to:

* Expand the range of algorithms beyond logistic and linear regression  
* Incorporate more advanced ML techniques and deep learning options  
* Implement user feedback mechanisms to continuously improve the quality of generated notebooks  
* Explore integration with online learning platforms for wider accessibility

## **Conclusion**

We believe our AI-driven Jupyter notebook generator represents a significant step forward in personalized ML education. By combining AI-generated datasets with tailored notebook content, we're opening up new possibilities for interactive, engaging learning experiences in the field of machine learning. We're excited to share this project with the community and look forward to seeing how it can enhance ML education and practice for learners around the world, starting with these fundamental regression techniques.
