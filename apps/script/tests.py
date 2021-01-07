import socket

TCP_client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
TCP_client.connect(('192.168.43.172', 8080))

TCP_client.send('你好？'.encode())

recv_data = TCP_client.recv(1024)

print(recv_data.decode('gbk'))

TCP_client.close()

"""

import json
import socket, time

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # s = socket.socket()
s.bind(('192.168.43.111', 8080))

s.listen(128)
connection, addr = s.accept()

print("Start!!!")

while True:

    time.sleep(0.1)
    Data = connection.recv(20)

    if Data == b"close\r\n":  # 客戶端要停止...
        break
    elif Data == b"Hello\r\n":
        print("Data=", Data)
    elif Data == b"WR\r\n":
        print("Data=", Data)

        info = json.dumps({
            "name": "名字",
            "id": "序号值"
        }).encode()
        print(info)

        connection.send(info)

    elif Data == b"WR2\r\n":
        print("Data=", Data)
        connection.send(b"NationInstruments!!!\r\n")
    elif not Data:  # 如果客戶端斷線...
        break

print("END")

s.close()
"""