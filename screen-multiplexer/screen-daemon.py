import subprocess
from messages import event_channel
import time
import signal
import os

def startVNC():
    return subprocess.Popen(['x11vnc','-display', ':0'],stdout=subprocess.PIPE,stderr=subprocess.PIPE, preexec_fn=os.setsid)

def stopVNC(process):
    os.killpg(process.pid, signal.SIGTERM)

if __name__ == "__main__":
    currentVnc = None
    channel = event_channel()
    channel.register_handler("start share display", startVNC)
    channel.register_handler("stop share display", stopVNC)
    channel.loop("ws://141.3.229.49:8080")
