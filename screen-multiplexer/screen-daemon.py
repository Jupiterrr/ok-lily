import subprocess
import json
from messages import event_channel

def startVNC():
    return sub.Popen('x11vnc -display :0',stdout=sub.PIPE,stderr=sub.PIPE)

def stopVNC(process):
    process.terminate()

if __name__ == "__main__":
    currentVnc = None
    channel = event_channel()
    channel.register_handler("start share display", startVNC)
    channel.register_handler("stop share display", stopVNC)
    channel.loop("ws://141.3.229.49:8080")
