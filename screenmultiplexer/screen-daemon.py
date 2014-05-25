import subprocess
from messages import event_channel
import time
import signal
import os

def initiate():
    channel.send(channel.generate_message("start show display", "beamer", channel.get_ip()))

if __name__ == "__main__":
    channel = event_channel()
    channel.register_handler("start share display", initiate)
    channel.loop("ws://192.168.1.2:8080", targetBindings = ["carsten"])
