# RaspberryPi_DHT11_WebDashboard
DHT11 Temperature/Humidity Web Dashboard System of RaspberryPi with Arduino

![blog in korea <퍼텐셜의 개발 일지>](https://blog.naver.com/wjoh0315)

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

### Step 2. Upload DHT11_RaspberryPi.ino to Arduino (using PC, NOT RASPBERRY PI)

### Step 3. Connect usb between Arduino and RaspberryPi

### Step 4. Confirm serial port in Raspberry Pi Terminal (should uart is enabled)
![image](https://user-images.githubusercontent.com/65387631/122663656-42927380-d1d7-11eb-9159-300818829f10.png)

### Step 5. Setting project environment
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

