# BabelX Language Translator

BabelX is a **cross-platform language translation app** built with **Expo React Native** for the mobile front end, a **Python-based backend**, and utilizes the **LibreTranslate API** for language translation services. The backend can also be deployed in a Docker container and hosted on a Kali Linux server.

## Features

- Translate text between various languages.
- Integrated with Speech-to-text.
- Simple, user-friendly interface.
- Support for a wide range of languages.
- Instant translation with support for text input and output.
- Developed for both Android and iOS using Expo React Native.
- Can be deployed on a Kali Linux server using Docker for easy setup.

## Tech Stack

### Frontend:
- **Expo React Native** – For building the mobile application.
- **React Navigation** – For navigation between screens.

### Backend:
- **Python** – For server-side logic.
- **Flask** – A lightweight Python web framework for serving the backend API.

### API:
- **LibreTranslate** – A free and open-source translation API, which powers the translation functionality of BabelX.

### Libraries/Tools:
- **Axios** – For making HTTP requests from the frontend to the backend.
- **React Native Paper** – For UI components.
- **Docker** – For containerizing the backend, enabling easy deployment.
- **Kali Linux** – For running the Dockerized backend server.

## Installation

### Frontend (Expo React Native)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Erinyohan/BabelX.git

   
2.  **Navigate to the project directory:**

    ```bash
    cd BabelX
    
3. **Install Dependencies:**

   ```bash
   npm install

4. **Run the app:**

   ```bash
   expo start

### Backend (Python)

1. **Clone Repository if not already done:**

   ```bash
   git clone https://github.com/Erinyohan/BabelX.git

2. **Natigate to the backend directory**

   ```bash
   cd backend

3. **Create and activate a virtual environment:**

      - To create a virtual environment, run:

     ```bash
     python -m venv venv
     ```

   - To activate the virtual environment:

     - **On macOS/Linux**:

       ```bash
       source venv/bin/activate
       ```

     - **On Windows**:

       ```bash
       venv\Scripts\activate
       ```

4. **Install required dependencies:**

   - Once the virtual environment is activated, you can install dependencies using `pip`:

     ```bash
     pip install -r requirements.txt
     ```

5. **Run the backend server:**

   - To activate the virtual environment:

     ```bash
     python main.py
     ```
     The server should now be running on http://127.0.0.1:5000.

### API Integration
LibreTranslate's translation API is used to handle translation requests. If you'd like to use a custom instance or modify the configuration, refer to the main.py file in the backend directory.


### Docker Setup (On Kali Linux)
To deploy the BabelX backend on a Kali Linux server using Docker, follow the steps below.

### Prerequisites
   - Docker installed on Kali Linux

### Install Docker on Kali Linux

1. **Install Docker on Kali Linux:**
   - Open Terminal and run the following commands:

   ```bash
   sudo apt update
   sudo apt install docker.io
   sudo systemctl enable --now docker

2. **Verify Docker installation:**

   ```bash
   docker --version
If Docker is installed successfully, you'll see the Docker version.

### Docker Setup for LibreTranslate
  The following steps will guide you in running LibreTranslate in a Docker container on a Kali Linux (or any Linux machine) and configuring it for use with BabelX.

### Step-by-Step Setup 
1. **Pull the LibreTranslate Docker Image**

    First, you need to pull the official LibreTranslate Docker image from Docker Hub.

   ```bash
   sudo docker pull libretranslate/libretranslate
   ```
    This will fetch the latest version of LibreTranslate.
   
2. **Run LibreTranslate in a Docker Container**

   Once the image is pulled, you can start LibreTranslate in a detached mode, making it available at localhost:5000.

   ```bash
   sudo docker run -d -p 5000:5000 libretranslate/libretranslate
   ```

   This command runs LibreTranslate in the background, exposing the translation service on port 5000.

3. **Verify the Docker Container is Running**

   You can check if the container is running using the following command:

   ```bash
   sudo docker ps
   ```

   This will display a list of all running containers. You should see something like:

  ```bash
  CONTAINER ID   IMAGE                           COMMAND                  CREATED         STATUS         PORTS                    NAMES
  <container-id> libretranslate/libretranslate   "/app/bin/entrypoint.…"  X minutes ago   Up X minutes   0.0.0.0:5000->5000/tcp   gifted_hertz
  ```

4. **Testing the API**

   To test if the LibreTranslate API is running correctly, you can use curl to make a request to the /languages endpoint:

   ```bash
   curl http://localhost:5000/languages
   ```

   This will return the list of available languages supported by LibreTranslate.


5. **Running LibreTranslate with Language Selection (Optional)**

   If you want to limit the languages loaded by LibreTranslate for performance reasons, you can specify the languages you want to load using the LT_LOAD_ONLY environment variable. This command will run LibreTranslate and load only a few languages:

        
          sudo docker run -d -p 5000:5000 \
          -v libretranslate-data:/home/libretranslate/.local/share/ \
          -e LT_LOAD_ONLY=en,es,fr,de,zh,ja,hi,ar \
          libretranslate/libretranslate
       
      This setup will load only English, Spanish, French, German, Chinese, Japanese, Hindi, and Arabic.

6. **Performing a Translation Request**

     You can now make a translation request using curl. Here's how you can translate "Sorry" from English (en) to Spanish (es):

       curl -X POST "http://localhost:5000/translate" \
       -d "q=Sorry&source=en&target=es"
   
      This should return the translation for the word "Sorry" in Spanish:
   
       {
          "translatedText": "Lo siento"
       }

7. **Accessing LibreTranslate via Local IP**

     If you want to access LibreTranslate from another device or network, use your machine's local IP address instead of localhost. To get your IP address, you can use:

           hostname -I

     Once you have your local IP (e.g., 192.168.x.x), you can update the API URL in your app's code:

           const apiUrl = 'http://192.168.x.x:5000/translate'; // Use your actual local IP address
   

     Replace 192.168.x.x with your Kali Linux server's local IP.

