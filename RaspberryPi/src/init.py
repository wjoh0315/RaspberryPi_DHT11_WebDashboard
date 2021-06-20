import os
import sys
import time
import mariadb
import json
from dotenv import load_dotenv

load_dotenv()

os.chdir(os.path.dirname(__file__))
keys = [ 
    "Host", "Port", "Serialport", 
    "DB_Host", "DB_User", "DB_Password",
    "CollectDelay_Hour" 
]
complete = False
DataBase = "DHT11_Data"

while not complete:
    strdata = ""
    jsondict = dict()
    for i, v in enumerate(keys):
        usrInput = input(f"{v} ({os.getenv(v)}): ")
        insertInput = usrInput if usrInput != "" else os.getenv(v)
        strdata += f'{v} = {insertInput}\n'
        if i < 2:
            jsondict[v] = insertInput

    ok = input("\nis it right? (yes): ")
    if ok == "yes" or ok == "":
        complete = True
        
with open(".env", 'w', encoding="utf-8") as newfile_env:
    newfile_env.write(strdata)

with open("./front/config.json", 'w', encoding="utf-8") as newfile_json:
    json.dump(jsondict, newfile_json)

load_dotenv()

try:
   conn = mariadb.connect(
      user=os.getenv("DB_User"),
      password=os.getenv("DB_Password"),
      host=os.getenv("DB_Host"),
      port=3306
   )
   cur = conn.cursor()
   cur.execute(f"USE {DataBase}")
except mariadb.ProgrammingError as e1:
    try:
        print("\nCreating Database...")
        schema = [
            "`Date` DATETIME NOT NULL", "`Temperature` tinyint NOT NULL", 
            "`Humidity` tinyint NOT NULL", "`rtype` enum('NOR', 'AVR') NOT NULL",
            "`AVRtype` enum('Month', 'Week', 'Day', 'Hour')", "`Checkid` tinyint" ]

        cur.execute(f"CREATE DATABASE `{DataBase}` CHARACTER SET utf8 COLLATE utf8_general_ci")
        cur.execute(f"USE {DataBase}")
        cur.execute(f"CREATE TABLE `TemHumData` ( {schema[0]}, {schema[1]}, {schema[2]}" 
                    + f", {schema[3]}, {schema[4]}, {schema[5]} )")
        print("Database `DHT11_Data` and Tables were created")
    except mariadb.Error as er:
        print(f"MariaDB Error: {er}")
        conn.close()
        sys.exit(1)
except mariadb.Error as e2:
        print(f"MariaDB Error: {e2}")
        sys.exit(1)

conn.close()
sys.exit()