import os
import secrets

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_FILE = os.path.join(BASE_DIR, "device.token")


def get_device_token():
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as file:
            return file.read().strip()

    token = secrets.token_hex(32)

    with open(TOKEN_FILE, "w") as file:
        file.write(token)

    print("New Device Token Created")

    return token