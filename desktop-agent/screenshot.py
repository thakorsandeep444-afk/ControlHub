from PIL import ImageGrab
import io

def take_screenshot():
    image = ImageGrab.grab()

    buffer = io.BytesIO()

    image.save(buffer, format="JPEG", quality=60)

    return buffer.getvalue()