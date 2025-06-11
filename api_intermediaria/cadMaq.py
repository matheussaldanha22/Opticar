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
        print(f"Erro ao conectar ROTA CADASTRAR QUENTE: {e}")

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
        print(f"Erro ao conectar ROTA CADASTRAR FRIO: {e}")

def obterCardapio():
    try:
        fetch_obterCardapio = "http://localhost:3333/mysql/cardapio"
        resposta = requests.get(fetch_obterCardapio)

        if resposta.status_code == 200:
            print("Cardapio obtido com sucesso")
            print(resposta.json())
            return resposta.json()
        else:
            print(f"Erro ao pegar Cardapio: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar a ROTA CARDAPIO: {e}")

def obterServidor(mac):
    try:
        fetch_obterCardapio = f"http://localhost:3333/mysql/obterServidor/{mac}"
        resposta = requests.get(fetch_obterCardapio)

        if resposta.status_code == 200:
            print("Servidor obtido com sucesso")
            print(resposta.json())
            return resposta.json()
        else:
            print(f"Erro ao pegar Servidor: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar a ROTA DO SERVIDOR: {e}")



def inserirPedidosObrigatorios(idMaquina, valor):
    try:
        fetch_inserirDados = "http://localhost:3333/mysql/pedidosObrigatorios"
        resposta = requests.post(fetch_inserirDados, json={"mac": idMaquina,
                                                            "valor": valor})
        if resposta.status_code == 200:
            print("Pedido inserido com sucesso")
            print(resposta.json())
        else:
            print(f"Erro ao cadastrar pedido: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar ROTA DE CADASTRAR PEDIDO: {e}")

cardapio = obterCardapio()
cpu = None
ram = None
disco = None
download = None
upload = None

if cardapio:
    for cardapioCliente in cardapio:
        if cardapioCliente['tipo'] == 'Cpu' and cardapioCliente['medida'] == 'Porcentagem':
            cpu = cardapioCliente['idcomponente']
        if cardapioCliente['tipo'] == 'Ram' and cardapioCliente['medida'] == 'Porcentagem':
            ram = cardapioCliente['idcomponente']
        if cardapioCliente['tipo'] == 'Disco' and cardapioCliente['medida'] == 'Porcentagem':
            disco = cardapioCliente['idcomponente']
        if cardapioCliente['tipo'] == 'Rede' and cardapioCliente['medida'] == 'Upload':
            download = cardapioCliente['idcomponente']
        if cardapioCliente['tipo'] == 'Rede' and cardapioCliente['medida'] == 'Download':
            upload = cardapioCliente['idcomponente']
else:
    print("Cardápio não obtido ou vazio. Componentes não serão configurados a partir dele.")


so = platform.system()
ip_publico = requests.get('https://api.ipify.org').text
hostname = socket.gethostname()
mac = uuid.getnode()
fabrica = 1
cadastrarMaquinaFrio(so, ip_publico, hostname, mac, fabrica)

cadastrarMaquinaQuente(so, ip_publico, hostname, mac, fabrica)

servidor = obterServidor(mac)
idMaquina = None 

if servidor:
    try:
        idMaquina = servidor[0]['idMaquina']
        print(f'aqui é o idMaquina {idMaquina}') 
        print(f'aqui é a cpu {cpu}')

        valor = cpu
        inserirPedidosObrigatorios(idMaquina, valor)
        valor = ram
        inserirPedidosObrigatorios(idMaquina, valor)
        valor = disco
        inserirPedidosObrigatorios(idMaquina, valor)
        valor = download
        inserirPedidosObrigatorios(idMaquina, valor)
        valor = upload
        inserirPedidosObrigatorios(idMaquina, valor)
    except Exception as e: 
        print(f"Erro ao processar dados do servidor para obter idMaquina: {e}")
        print(f"Dados do servidor recebidos: {servidor}")
else:
    print("Não foi possível obter dados do servidor. Pedidos obrigatórios não serão inseridos.")