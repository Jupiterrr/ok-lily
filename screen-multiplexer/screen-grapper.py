import subprocess
import json
from messages import event_channel

def grabVNC():
    return sub.Popen('x11vnc -display :0',stdout=sub.PIPE,stderr=sub.PIPE)

def releaseVNC(vie):
    process.terminate()

if __name__ == "__main__":
    currentVnc = None
    channel = event_channel()
    channel.register_handler("", startVNC)
    channel.register_handler("", stopVNC)
    channel.loop("ws://141.3.229.49:8080")
