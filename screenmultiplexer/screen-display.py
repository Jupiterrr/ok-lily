import subprocess as sub
import json
from messages import event_channel
import signal
import os
import webbrowser
import uinput

currentVnc = None

def startVNC(host):
    stopVNC()
    currentVnc = sub.Popen(['vncviewer', '-ViewOnly', '-Fullscreen', host],stdout=sub.PIPE,stderr=sub.PIPE, preexec_fn=os.setsid)

def stopVNC():
    if currentVnc:
        os.killpg(currentVnc.pid, signal.SIGTERM)

def openBrowser(url):
    webbrowser.open_new_tab(url)

def nextSlide():
    device.emit_click(uinput.KEY_ENTER)

if __name__ == "__main__":
    currentVnc = None
    device = uinput.Device([uinput.KEY_ENTER])
    channel = event_channel()
    channel.register_handler("start show display", lambda host: startVNC(host))
    channel.register_handler("stop show display", stopVNC)
    channel.register_handler("open website", lambda url: openBrowser(url))
    channel.loop("ws://192.168.1.8:8080", targetBindings = ["any", "beamer"])
