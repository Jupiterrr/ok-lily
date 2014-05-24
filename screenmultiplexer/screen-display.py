import subprocess as sub
import json
from messages import event_channel
import signal
import os


def startVNC(host):
    currentVnc = sub.Popen(['vncviewer', '-ViewOnly', '-Fullscreen', host],stdout=sub.PIPE,stderr=sub.PIPE, preexec_fn=os.setsid)

def releaseVNC():
    if currentVnc:
        os.killpg(currentVnc.pid, signal.SIGTERM)

if __name__ == "__main__":
    currentVnc = None
    channel = event_channel()
    channel.register_handler("start show display", lambda host: startVNC(host))
    channel.register_handler("prepare display switch", releaseVNC)
    channel.loop("ws://192.168.1.8:8080", targetBindings = ["beamer"])
