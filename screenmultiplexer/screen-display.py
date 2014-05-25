import subprocess as sub
import json
from messages import event_channel
import signal
import os
import webbrowser
import time
from pykeyboard import PyKeyboard

k = PyKeyboard()
currentVnc = None

def startVNC(host):
    stopVNC()
    currentVnc = sub.Popen(['vncviewer', '-ViewOnly', '-Fullscreen', host],stdout=sub.PIPE,stderr=sub.PIPE, preexec_fn=os.setsid)
    print "process is " + str(currentVnc)

def stopVNC():
    print "stop vnc"
    currentVnc = sub.Popen(['killall', '-9', 'vncviewer'],stdout=sub.PIPE,stderr=sub.PIPE, preexec_fn=os.setsid)
    time.sleep(0.5)

def openBrowser(url):
    webbrowser.open(url, new = 2, autoraise=True)

def nextSlide():
    k.tap_key(k.numpad_keys['Page_Down'])

def startPresi():
    openBrowser("https://docs.google.com/presentation/d/1rAXpVEqZ435SGky5q3ZVkbSyWz97f43D_V2zcRQRIj0")
    timer.wait(3)
    k.press_key(k.control_key)
    k.press_key(k.shift_key)
    k.tap_key(k.function_keys[5])
    k.release_key(k.control_key)

if __name__ == "__main__":
    channel = event_channel()
    channel.register_handler("start show display", lambda host: startVNC(host))
    channel.register_handler("stop show display", stopVNC)
    channel.register_handler("open website", lambda url: openBrowser(url))
    channel.register_handler("start presi", startPresi)
    channel.loop("ws://192.168.1.2:8080", targetBindings = ["any", "beamer"])
