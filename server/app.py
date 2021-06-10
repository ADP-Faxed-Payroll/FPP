"""This is the main app that serves as a server for all the clients"""
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS

APP = Flask(__name__, static_folder='../build/static')


CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''Tells python where our index file is that renders our React Components'''
    return send_from_directory('../build', filename)

@SOCKETIO.on('connect')
def on_connect():
    '''When someone connects to the server'''
    print('User connected!')

@SOCKETIO.on('disconnect')
def on_disconnect():
    '''When someone connects to the server'''
    print('User disconnected!')

if __name__ == "__main__":
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081))
    )
