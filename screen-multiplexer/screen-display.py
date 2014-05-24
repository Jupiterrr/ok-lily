import subprocess
import json
from messages import event_channel

def startVNC(host):
    currentVnc = sub.Popen(['vncviewer', '-ViewOnly', '-Fullscreen', host],stdout=sub.PIPE,stderr=sub.PIPE, preexec_fn=os.d)

def releaseVNC():
    currentVnc.terminate()

if __name__ == "__main__":
    channel = event_channel()
    channel.register_handler("start show display", startVNC)
    channel.register_handler("stop show display", releaseVNC)
    channel.loop("ws://192.168.1.8:8080")
