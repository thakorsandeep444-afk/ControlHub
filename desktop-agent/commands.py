import os

def shutdown():
    os.system("shutdown /s /t 0")

def restart():
    os.system("shutdown /r /t 0")

def lock():
    os.system("rundll32.exe user32.dll,LockWorkStation")