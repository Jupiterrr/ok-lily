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
    channel.register_handler(sys.argv[1], lambda: execute(sys.argv[2].split()))
    channel.loop("ws://192.168.1.8:8080")
