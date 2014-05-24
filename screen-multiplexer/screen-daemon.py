import subprocess
import json
from messages import event_channel

def startVNC():
    return subprocess.Popen('x11vnc -display :0',stdout=subprocess.PIPE,stderr=subprocess.PIPE)

def stopVNC(process):
    process.terminate()

if __name__ == "__main__":
    vnc = startVNC()
    time.sleep(60)
    stopVNC(vnc)

#    currentVnc = None
#    channel = event_channel()
#    channel.register_handler("start share display", startVNC)
#    channel.register_handler("stop share display", stopVNC)
#    channel.loop("ws://141.3.229.49:8080")
