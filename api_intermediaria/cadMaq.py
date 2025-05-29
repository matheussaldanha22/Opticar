import mysql.connector
import platform
import socket
import uuid
import requests

def cadastrarMaquinaFrio(so, ip_publico, hostname, mac, fabrica):
    try:
        fetch_inserirDados = "http://localhost:3333/mysql/cadMaqFrio"
        resposta = requests.post(fetch_inserirDados, json={"so": so,
                                                           "ip_publico": ip_publico,
                                                           "hostname": hostname,
                                                           "mac": mac,
                                                           "fabrica": fabrica})
        if resposta.status_code == 200:
            print("Máquina Fria Cadastrada com sucesso")
            print(resposta.json())
        else:
            print(f"Erro ao cadastrar Máquina Fria: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar ROTA CADASTRARQUENTE: {e}")


def cadastrarMaquinaQuente(so, ip_publico, hostname, mac, fabrica):
    try:
        fetch_inserirDados = "http://localhost:3333/mysql/cadMaqQuente"
        resposta = requests.post(fetch_inserirDados, json={"so": so,
                                                           "ip_publico": ip_publico,
                                                           "hostname": hostname,
                                                           "mac": mac,
                                                           "fabrica": fabrica})
        if resposta.status_code == 200:
            print("Máquina Quente cadastrada com sucesso")
            print(resposta.json())
        else:
            print(f"Erro ao cadastrar Máquina Quente: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar ROTA CADASTRARFRIO: {e}")



so = platform.system()
ip_publico = requests.get('https://api.ipify.org').text
hostname = socket.gethostname()
mac = uuid.getnode()
fabrica = 1 

cadastrarMaquinaFrio(so, ip_publico, hostname, mac, fabrica)

cadastrarMaquinaQuente(so, ip_publico, hostname, mac, fabrica)
