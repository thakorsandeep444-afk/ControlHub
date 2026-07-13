import socket
import platform
import psutil
from datetime import datetime


def get_system_info():
    battery = psutil.sensors_battery()

    return {
        "name": platform.node(),
        "os": platform.system(),
        "release": platform.release(),

        "cpu": psutil.cpu_percent(),

        "ram": psutil.virtual_memory().percent,

        "disk": psutil.disk_usage("/").percent,

        "battery": battery.percent if battery else None,

        "charging": battery.power_plugged if battery else None,

        "local_ip": socket.gethostbyname(socket.gethostname()),

        "time": datetime.now().strftime("%H:%M:%S")
    }