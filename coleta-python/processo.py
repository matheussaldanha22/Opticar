import psutil
import time
import uuid
import requests
import datetime
import time

def pegando_mac_address():
    return uuid.getnode()

############################################################################################################################################################################

def enviarBucket(data, logProcesso):
    try:
        fetch_log = "http://34.198.19.147:5000/aws/logProcesso"
        resposta = requests.post(fetch_log, json={"logProcesso": logProcesso, "data": data})

        if resposta.status_code == 200:
            print("Dados enviados com sucesso")
            print(resposta.json())
        else:
            print(f"Erro ao enviar os dados: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar ROTA AWS: {e}")

def obterProcessos(mac_address):
    try:
        fetch_pedido = f"http://34.198.19.147:5000/mysql/processoCliente/{mac_address}"
        resposta = requests.get(fetch_pedido)

        if resposta.status_code == 200:
            pedidos = resposta.json()
            print("Pedidos recebidos da API:")
            if len(pedidos) > 0:
                return pedidos
            else:
                return []
        else:
            print(f"Erro ao acessar API: {resposta.status_code}")
            return []
    except Exception as e:
        print(f"Erro ao conectar ROTA PEDIDO: {e}")
        return []

def excluirProcesso(mac_address, idProcesso, pid):
    try:
        fetch_excluirProcesso = f"http://34.198.19.147:5000/mysql/excluirProcesso/{mac_address}/{idProcesso}/{pid}"
        resposta = requests.delete(fetch_excluirProcesso)

        if resposta.status_code == 200:
            print("Processo excluido com sucesso")
            print(resposta.json())
        else:
            print(f"Erro ao excluir processo: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar ROTA DELETAR: {e}")

def monitorar():
    mac_address = pegando_mac_address()
    while True:
        try:
            print('Estou no while')
            pedidoProcesso = obterProcessos(mac_address)
            for pedido in pedidoProcesso:
                nome_processo = pedido["nome"]
                pid = pedido["pid"]

                try:
                    for proc in psutil.process_iter(['name']):
                        if proc.info['name'] == nome_processo:
                            proc.kill()
                            print(f"Processo {nome_processo} encerrado.")
                            data = datetime.datetime.now().isoformat()
                            logProcesso ={
                                "mac_address": mac_address,
                                "nome": nome_processo,
                                "pid": pid,
                                "data": data
                            }
                            excluirProcesso(mac_address, nome_processo, pid)
                            enviarBucket(data, logProcesso)
                except Exception as e:
                    print(f"Erro ao matar processo: {e}")
            time.sleep(5)

        except Exception as e:
            print(f"Erro ao obter conexão: {e}")
            time.sleep(10)
    
monitorar()