# Tap Story

### Description
Tap Story is a full-stack web application designed to revolutionize the way we consume stories. Stories are presented in a chat format where readers press enter to see the next message, creating an immersive reading experience. Every user can easily add a story to share with others. Users can comment on stories, like them, and save them for later.

The backend is built using Django and Django Rest Framework, while the frontend is developed with React and TypeScript. The project includes full CRUD functionality and features a drag-and-drop interface on the "Create Story" page. Real-time notifications are implemented using Django Channels and WebSockets. User authentication is handled with DJoser and JWT web tokens, including email verification. The backend is thoroughly tested with pytest.

One of the main challenges was implementing the real-time notifications, as I rarely use Channels and WebSockets in my projects. In the future, I plan to add a User Profile page and a user's story progress line.

### Screenshots
![Screenshot 2024-06-25 225913](https://github.com/yaroslav-maksymiv/tap-story/assets/143656021/ad0a6480-3d21-47db-ac30-c9bdb4c4839e)
![story](https://github.com/yaroslav-maksymiv/tap-story/assets/143656021/dac5ff2c-a994-4906-b8ed-234135f57f3a)

### Installation
To install this app please follow this below steps:

#### Run Backend

1. Create a virtual environment `python -m venv venv`
2. And activate it `venv\Scripts\activate`
3. Then change the directory to backend/ and install dependencies `pip install -r requirements.txt`
4. Create .env file and add your PostgreSQL db data and data for SMTP configuration
```bash
DB_NAME=dbname
DB_USER=dbusername
DB_PASSWORD=password
DB_HOST=host
DB_PORT=port

EMAIL_HOST_PASSWORD=passwod
EMAIL_HOST_USER=email
```
5. Migrate to database `python manage.py migrate`
6. Now run the server `python manage.py runserver`


#### Run Frontend
1. Change the directory to frontend/
2. Install dependencies `npm install`
3. Add .env file 
```bash
REACT_APP_API_URL='http://127.0.0.1:8000 - your url where you run backend'
REACT_APP_API_DOMAIN = 'localhost:8000 - your domain'
```
4. Now start the server `npm start`
