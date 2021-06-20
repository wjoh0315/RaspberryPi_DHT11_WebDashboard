import os

shpath = f"{os.path.abspath(os.path.dirname(__file__))}/.runcmd_dht11.sh"
with open("/home/pi/.bashrc", 'r') as bashrc_r:
    lines = bashrc_r.readlines()

with open("/home/pi/.bashrc", "a+") as bashrc_w:
    if not f"chmod +x {shpath}" in lines:
        bashrc_w.write(f"\nchmod +x {shpath}\n")
    if not f"source {shpath}" in lines:
        bashrc_w.write(f"\nsource {shpath}\n")
