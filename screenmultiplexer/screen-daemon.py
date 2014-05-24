import subprocess
from messages import event_channel
import time
import signal
import os

def initiate(channel):
    startVNC()
    channel.send(channel.generate_message("start show display", channel.my_id, "beamer", channel.get_ip()))

if __name__ == "__main__":
    channel = event_channel()
    channel.register_handler("start share display", lambda payload: initiate(event_channel, payload))
    channel.loop("ws://192.168.1.8:8080")
