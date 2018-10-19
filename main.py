#!/usr/bin/env python3

import pit
import pyrebase
import datetime

DEV_ID = '28-02169177d292'


def get_temp():
    try:
        with open('/sys/bus/w1/devices/%s/w1_slave' % DEV_ID) as d:
            temp = float(d.readlines()[-1].strip().split('=')[-1]) / 1000.
            return temp
    except:
        return -1


def main():
    cred = pit.Pit.get('aquatemp', {'require': {'email': 'hoge@example.com', 'pass': 'password'}})
    email = cred['email']
    password = cred['pass']

    fb_config = {
        "apiKey": "AIzaSyCr7nqMHqaFGaONInmOWprxNRuLRAIu8Pk",
        "authDomain": "aquatemp-b9f33.firebaseapp.com",
        "databaseURL": "https://aquatemp-b9f33.firebaseio.com",
        "projectId": "aquatemp-b9f33",
        "storageBucket": "aquatemp-b9f33.appspot.com",
        "messagingSenderId": "234748928480",
    }

    firebase = pyrebase.initialize_app(fb_config)

    user = firebase.auth().sign_in_with_email_and_password(email, password)

    db = firebase.database()

    data = {"temp": get_temp(), "created_at": {".sv": "timestamp"}}
    db.child("temps").push(data, user['idToken'])

if __name__ == '__main__':
    main()
