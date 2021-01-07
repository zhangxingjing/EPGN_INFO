# import socket
#
#
# def main():
#     """TCP_socket"""
#     # 创建服务器套接字
#     tcp_sever = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#
#     # 这里是服务器--记得要先绑定端口
#     tcp_sever.bind(('192.168.43.111', 5657))
#
#     # 让服务器套接字监听、等待
#     tcp_sever.listen(128)
#     client_socket, client_addr = tcp_sever.accept()
#
#     # 是服务器--都是先接受，再发送的
#     # 接受消息
#     recv_info = client_socket.recv(1024)
#     print(recv_info.decode())
#
#     # 发送消息
#     client_socket.send('好的'.encode())
#
#     # 关闭服务器套接字
#     tcp_sever.close()
#
#
# if __name__ == '__main__':
#     main()
