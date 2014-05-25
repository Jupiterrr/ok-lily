import subprocess as sub
import json
from messages import event_channel
import signal
import os
import webbrowser
from pykeyboard import PyKeyboard

currentVnc = None
k = PyKeyboard()

def startVNC(host):
    stopVNC()
    currentVnc = sub.Popen(['vncviewer', '-ViewOnly', '-Fullscreen', host],stdout=sub.PIPE,stderr=sub.PIPE, preexec_fn=os.setsid)

def stopVNC():
    print "stop vnc"
    if currentVnc:
        os.killpg(currentVnc.pid, signal.SIGTERM)
        print "killed"

def openBrowser(url):
    webbrowser.open(url, new = 2, autoraise=True)

def nextSlide():
    k.tap_key(k.numpad_keys['Page_Down'])

def startPresi():
    openBrowser("https://docs.google.com/presentation/d/1rAXpVEqZ435SGky5q3ZVkbSyWz97f43D_V2zcRQRIj0/htmlpresent")
    timer.wait(3)
    k.press_key(k.control_key)
    k.press_key(k.shift_key)
    k.tap_key(k.function_keys[5])
    k.release_key(k.control_key)

if __name__ == "__main__":
    currentVnc = None
    channel = event_channel()
    channel.register_handler("start show display", lambda host: startVNC(host))
    channel.register_handler("stop show display", stopVNC)
    channel.register_handler("open website", lambda url: openBrowser(url))
    channel.register_handler("start presi", startPresi)
    channel.loop("ws://192.168.1.2:8080", targetBindings = ["any", "beamer"])
