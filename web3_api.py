import requests
import json


def api_call(url, method):
    response = requests.get(url)
    if method is 'POST':
        response = requests.post(url)
    response_str = response.content.decode('utf-8')
    return response_str


def get_balance():
    url = 'http://localhost:3001/balanceOf?address=2b0b3969e459032d7c0f39c2dc7292e68fd87387'
    res_str = api_call(url, 'GET')
    balance = int(json.loads(res_str)["balance"])
    return balance


def send_pty(address, amount):
    url = 'http://localhost:3001/transfer?address=' + str(address) + '&amount=' + str(amount)
    api_call(url, 'POST')


def get_own_address():
    file = open("./address.txt")
    return file.read()
