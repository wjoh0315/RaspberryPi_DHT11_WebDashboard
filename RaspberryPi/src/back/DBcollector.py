import serial
import datetime
from datetime import timedelta
import time
import mariadb
import sys
import os
import math
from dotenv import load_dotenv

load_dotenv()

def InsertDHTdata(cur, dataobj):
    dataobj['avrtype'] = "NULL" if dataobj['avrtype'] == None else f"'{dataobj['avrtype']}'"
    dataobj['checkid'] = "NULL" if dataobj['checkid'] == None else f"'{dataobj['checkid']}'"

    cur.execute(f"INSERT INTO `TemHumData` VALUES (?, ?, ?, ?, {dataobj['avrtype']}, {dataobj['checkid']})", 
    (dataobj['date'], dataobj['temperature'], dataobj['humidity'], dataobj['rtype']))
    print("[DBCollector]> Sent Query To DHT11_Data (Insert)")

def GetAVRdata(cur, datestart, dateend):
    cur.execute("SELECT AVG(Temperature), AVG(Humidity) FROM TemHumData WHERE Date >= ? AND Date <= ?", 
    (datestart, dateend))
    print("[DBCollector]> Sent Query To DHT11_Data (Get AVR data)")
    return cur.fetchall()

def InsertAVRdata(cur, startdatetuple, enddatetuple, avrtype, checkid):
    # [(Decimal(Temperature), Decimal(Humidity))]
    AVRdata = GetAVRdata(cur,
        datetime.datetime(*startdatetuple).strftime("%Y-%m-%d %H:%M:%S"), 
        datetime.datetime(*enddatetuple).strftime("%Y-%m-%d %H:%M:%S"))[0]

    if AVRdata[0] != None and AVRdata[1] != None:
        InsertDHTdata(cur, {
            'date': datetime.datetime.strftime(now, "%Y-%m-%d %H:%M:%S"), 
            'temperature': AVRdata[0], 
            'humidity': AVRdata[1],
            'rtype': "AVR",
            'avrtype': avrtype,
            'checkid': checkid
        })

def GetWeek(now):
    firstdayofmonth = datetime.datetime(now.year, now.month, 1)
    if firstdayofmonth.weekday() > 3:
        firstdayofweek = firstdayofmonth - timedelta(days=firstdayofmonth.weekday() - 7)
    else:
        firstdayofweek = firstdayofmonth - timedelta(firstdayofmonth.weekday() + 1)
    datediff = now - firstdayofweek
    return math.floor(datediff.days / 7)

def GetTem_Hum(serialport):
   serialport.write('GET\n'.encode('ascii'))
   data = serialport.read_until('\n'.encode('ascii')).decode('utf-8')
   
   if data == "Error":
      print("[DBCollector]> Protocol Error")
      sys.exit(1)

   TemperatureIndex1 = data.find("Temperature: ")
   TemperatureIndex2 = data.find('C', TemperatureIndex1)
   
   HumidityIndex1 = data.find("Humidity: ")
   HumidityIndex2 = data.find('%', HumidityIndex1)

   if TemperatureIndex1 + TemperatureIndex2 > 0 and HumidityIndex1 + HumidityIndex2 > 0:
      Temperature = float(data[TemperatureIndex1 + 13:TemperatureIndex2])
      Humidity = float(data[HumidityIndex1 + 10: HumidityIndex2])
      return Temperature, Humidity
   else:
      print("[DBCollector]> Response Error")
      sys.exit(1)

try:
   conn = mariadb.connect(
      user="phpmyadmin",
      password="wjoh0315",
      host="localhost",
      port=3306,
      database="DHT11_Data"
   )
except mariadb.Error as e:
   print(f"[DBCollector]> Error connecting to MariaDB Platform: {e}")
   sys.exit(1)

cur = conn.cursor()
serialport = serial.Serial("/dev/ttyUSB0", 9600)
serialport.timeout = 3
nextdate = datetime.datetime.now()

time.sleep(5)
print("[DBCollector]> Data Collecting Start")

while True:
   if datetime.datetime.now() >= nextdate:
        now = datetime.datetime.now()
        nextdate = now + timedelta(minutes=60 * float(os.getenv("CollectDelay_Hour")))
        Temperature, Humidity = GetTem_Hum(serialport)
      
        if now.month != nextdate.month:
            startdatetuple = (now.year, now.month, 1)
            enddatetuple = (nextdate.year, nextdate.month, 1)
            avrtype.append("Month")
            checkid = now.month
            InsertAVRdata(cur, startdatetuple, enddatetuple, avrtype, checkid)
        if now.day != nextdate.day:
            if nextdate.weekday() == 0:
                startdatetuple = (now.year, now.month, now.day - 6)
                enddatetuple = (nextdate.year, nextdate.month, nextdate.day)
                avrtype = "Week"
                checkid = GetWeek(now)
                InsertAVRdata(cur, startdatetuple, enddatetuple, avrtype, checkid)
            
            startdatetuple = (now.year, now.month, now.day)
            enddatetuple = (nextdate.year, nextdate.month, nextdate.day)
            avrtype = "Day"
            checkid = now.weekday()
            InsertAVRdata(cur, startdatetuple, enddatetuple, avrtype, checkid)
        if now.hour != nextdate.hour:
            startdatetuple = (now.year, now.month, now.day, now.hour)
            enddatetuple = (nextdate.year, nextdate.month, nextdate.day, nextdate.hour)
            avrtype = "Hour"
            checkid = now.hour
            InsertAVRdata(cur, startdatetuple, enddatetuple, avrtype, checkid)
        
        InsertDHTdata(cur, {
            'date': datetime.datetime.strftime(now, "%Y-%m-%d %H:%M:%S"), 
            'temperature': Temperature, 
            'humidity': Humidity,
            'rtype': "NOR",
            'avrtype': None,
            'checkid': None
        })
        conn.commit()