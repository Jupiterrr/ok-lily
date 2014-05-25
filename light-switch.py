import subprocess
from screenmultiplexer.messages import event_channel
import time
import signal
import os
import sys

def execute(command):
    subprocess.Popen(command,stdout=subprocess.PIPE,stderr=subprocess.PIPE)

if __name__ == "__main__":
    channel = event_channel()
    channel.register_handler("lights on", lambda: execute("/home/pi/plugwise/plugwise_util -d /dev/ttyUSB0 -s on -m 000D6F0002588DA4".split()))
    channel.register_handler("lights off", lambda: execute("/home/pi/plugwise/plugwise_util -d /dev/ttyUSB0 -s off -m 000D6F0002588DA4".split()))
    channel.loop(sys.argv[1])
