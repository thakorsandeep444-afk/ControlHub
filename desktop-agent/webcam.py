import cv2
import base64

def capture_webcam():

    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        return None

    success, frame = camera.read()

    camera.release()

    if not success:
        return None

    _, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 70])

    return base64.b64encode(buffer).decode()