# RaspberryPi_DHT11_WebDashboard
DHT11 Temperature/Humidity Web Dashboard System of RaspberryPi with Arduino

[blog in korea <퍼텐셜의 개발 일지>](https://blog.naver.com/wjoh0315)

## Hierarchy
```
/var/www (in apache web server)
|-- html
|   `-- DHT11Dashboard.html
`-- src
    |-- back
    |   |-- DBcollector.py
    |   |-- DBmanager.js
    |   |-- router.js
    |   |-- server.js
    |   `-- utility_back.js
    |-- front
    |   |-- ChartSubmit.js
    |   |-- SelectManager.js
    |   `-- utility_front.js
    |-- init.py
    |-- package.json
    |-- package-lock.json
    |-- requirements.txt
    `-- set.py
```

## Getting Start
### Step 1. Build the circuit
![image](https://user-images.githubusercontent.com/65387631/122662982-2213ea80-d1d2-11eb-9ebd-d3ed1a0a0b0a.png)

### Step 2. Upload DHT11_RaspberryPi.ino to Arduino (1.8.13^)(using PC, NOT RASPBERRY PI)
Put the ```DHT_sensor_library folder``` to arduino's ```libraries``` folder

And, put the ```DHT11_RaspberryPi``` folder to Arduino's sketch folder ```Arduino```

### Step 3. Connect usb between Arduino and RaspberryPi

### Step 4. Confirm serial port in Raspberry Pi Terminal (should uart is enabled)
![image](https://user-images.githubusercontent.com/65387631/122663656-42927380-d1d7-11eb-9159-300818829f10.png)

### Step 5. Set project environment (in Raspberry Pi Terminal)
#### 1. Change work directory
```
cd /var/www/src
```

#### 2. Install dependence packages (npm)
```
npm install
```

#### 3. Install dependence packages (pip)
```
pip3 install -r requirements.txt
```

#### 4. Set bash commands
```
npm start
```

#### 5. Kill current terminal and create new terminal

#### 5. Initialize project settings
```
raspidht11_init
```
![image](https://user-images.githubusercontent.com/65387631/122674702-4e9b2700-d211-11eb-9819-d90e340336df.png)
```
Host: Raspberry Pi IP
Port: Server listening port
Serialport: Serialport to communication with arduino (usually, /dev/ttyUSB0)
DB_Host: Database Host IP (usually, localhost)
DB_User: DB User ID
DB_Password: DB password
CollectDelay_Hour: Temperature/Humidity data collect delay (unit: Hour, e.g. 0.2 = 12 Minutes)
```
**Caution: DB must not already have a database named "DHT11_Data" beform Initialize project settings (It's OK when it's done)**

## Collect Temperature/Humidity data
Common excute
```
raspidht11_dbcollect
```

Background excute (with nohup log file nohup.out)
```
raspidht11_dbcollect_background
```

## Execute Server
Common excute
```
raspidht11_server
```

Background excute (with nohup log file nohup.out)
```
raspidht11_server_background
```

## Excute Dashboard with browser
```
http://[Raspberry Pi's IP]/DHT11Dashboard.html
(e.g. http://192.168.219.108/DHT11Dashboard.html)
```
