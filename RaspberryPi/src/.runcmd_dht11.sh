#!/bin/bash

function raspidht11_init()
{
    python3 $( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/init.py
}

function raspidht11_server()
{
    node $( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/back/server.js
}

function raspidht11_server_background()
{
    nohup node $( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/back/server.js&
}

function raspidht11_dbcollect()
{
    python3 $( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/back/DBcollector.py
}

function raspidht11_dbcollect_background()
{
    nohup python3 $( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/back/DBcollector.py&
}