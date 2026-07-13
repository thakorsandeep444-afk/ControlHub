import os
import uuid

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Full path to the device ID file
DEVICE_FILE = os.path.join(BASE_DIR, "device.id")


def get_device_id():
    # If the device ID already exists, return it
    if os.path.exists(DEVICE_FILE):
        with open(DEVICE_FILE, "r") as file:
            return file.read().strip()

    # Create a new unique device ID
    device_id = str(uuid.uuid4())

    # Save it to device.id
    with open(DEVICE_FILE, "w") as file:
        file.write(device_id)

    print(f"New Device ID Created: {device_id}")

    return device_id