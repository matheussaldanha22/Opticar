import psutil
import time
import uuid
import json
import datetime
import tempfile
import requests

def pegando_mac_address():
    return uuid.getnode()

def obterPedidos(mac_address):
    try:
        fetch_pedido = "http://localhost:3333/mysql/pedidosCliente"
        resposta = requests.post(fetch_pedido, json={"mac_address": mac_address})

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

def inserirDados(valor, idPedido):
    try:
        fetch_inserirDados = "http://localhost:3333/mysql/dadosCapturados"
        resposta = requests.post(fetch_inserirDados, json={"valor": valor, "idPedido": idPedido})

        if resposta.status_code == 200:
            print("Dados enviados com sucesso")
            print(resposta.json())
        else:
            print(f"Erro ao enviar os dados: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar ROTA INSERIR: {e}")

def dadosBucket(dadosS3, mac_address):
    try:
        fetch_dadosS3 = "http://localhost:3333/aws/dadosS3"
        resposta = requests.post(fetch_dadosS3, json={"mac_address": mac_address, "dadosS3": dadosS3})

        if resposta.status_code == 200:
            print("Dados enviados com sucesso")
            print(resposta.json())
        else:
            print(f"Erro ao enviar os dados: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar ROTA AWS: {e}")

def monitorar():
    mac_address = pegando_mac_address()
    print(f"Iniciando monitoramento nesse mac_address: {mac_address}")
    intervalo_envio_s3 = 5  # 1 hora
    ultimo_envio_s3 = datetime.datetime.now()
    dadosS3 = {
        "macAddress": mac_address,
        "dataAtual": datetime.datetime.now().isoformat(),
        "leitura": []
    }

    while True:
        print("Conexao com o intermediário")

        try:
            pedidos = obterPedidos(mac_address)
            for pedido_cliente in pedidos:
                print((pedido_cliente['tipo'], pedido_cliente['medida']))

                try:
                    valor = eval(pedido_cliente['codigo'])
                    idPedido = pedido_cliente['idcomponenteServidor']
                    dadosS3["leitura"].append({
                        "componente": pedido_cliente['tipo'],
                        "medida": pedido_cliente['medida'],
                        "valor": valor
                    })
                    print(f"Valor capturado: {valor}")
                    inserirDados(valor, idPedido)
                except Exception as e:
                    print(f"Erro ao processar pedido: {e}")

            tempo_passado = (datetime.datetime.now() - ultimo_envio_s3).total_seconds()
            if tempo_passado >= intervalo_envio_s3:
                dadosBucket(dadosS3, mac_address)
                ultimo_envio_s3 = datetime.datetime.now()

            time.sleep(1)

        except Exception as e:
            print(f"Erro: {e}")
            time.sleep(10)

monitorar()