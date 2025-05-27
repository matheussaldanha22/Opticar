import psutil
import time
import uuid
import json
import datetime
import tempfile
import requests

def pegando_mac_address():
    return uuid.getnode()

def pegar_top_processo():
    time.sleep(1)
    lista = []
    for processo in psutil.process_iter():
        try:
            uso = processo.cpu_percent()
            lista.append((processo, uso))
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    maior_uso = 0
    processo = None
    for item in lista:
        if item[1] > maior_uso:
            maior_uso = item[1]
            processo = item
    if processo:
        proc = processo[0]
        uso_cpu = processo[1]
        try:
            uso_ram = proc.memory_percent()
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            uso_ram = 0
        try:
            io = proc.io_counters()
            uso_disco = io.read_bytes + io.write_bytes
        except (psutil.NoSuchProcess, psutil.AccessDenied, AttributeError):
            uso_disco = 0
        return {
            "nome": proc.name(),
            "cpu": uso_cpu,
            "ram": round(uso_ram, 2),
            "disco": uso_disco
        }
    else:
        return {
            "nome": "Nenhum processo encontrado",
            "cpu": 0,
            "ram": 0,
            "disco": 0
        }

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

def inserirAlerta(valor, titulo, prioridadeAlerta, descricaoAlerta, statusAlerta, tipo_incidente, fkPedido, componente, processo, processoCPU, processoRAM, processoDISCO):
    try:
        fetch_inserirAlerta = "http://localhost:3333/mysql/inserirAlerta"
        resposta = requests.post(fetch_inserirAlerta, json={"valor": valor,
                                                            "titulo": titulo,
                                                            "prioridadeAlerta": prioridadeAlerta,
                                                            "descricaoAlerta": descricaoAlerta,
                                                            "statusAlerta": statusAlerta,
                                                            "tipo_incidente": tipo_incidente,
                                                            "fkPedido": fkPedido,
                                                            "componente" : componente,
                                                            "processo": processo,
                                                            "processoCPU": processoCPU,
                                                            "processoRAM": processoRAM,
                                                            "processoDISCO": processoDISCO})
        if resposta.status_code == 200:
            print("Alerta inserido com sucesso")
            print(resposta.json())
        else:
            print(f"Erro ao inserir alerta: {resposta.status_code}")
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
                    print(f"Valor capturado: {valor} e id: {idPedido}")
                    inserirDados(valor, idPedido)

                    if valor > float(pedido_cliente['limiteCritico']) :
                        processoFunc = pegar_top_processo()
                        titulo = f"{pedido_cliente['tipo']} em estado crítico!!!"
                        prioridadeAlerta = "Crítica"
                        descricaoAlerta = f"Valor crítico detectado: {valor}, {pedido_cliente['tipo']} medida: {pedido_cliente['medida']}"
                        statusAlerta = "To Do"
                        tipo_incidente = "Alerta Crítico"
                        fkPedido = pedido_cliente['idcomponenteServidor']
                        componente = pedido_cliente['tipo']
                        processo = processoFunc['nome']
                        processoCPU = processoFunc['cpu']
                        processoRAM = processoFunc['ram']
                        processoDISCO = processoFunc['disco']
                        inserirAlerta(valor, titulo, prioridadeAlerta, descricaoAlerta, statusAlerta, tipo_incidente, fkPedido,
                                       componente, processo, processoCPU, processoRAM, processoDISCO)
                    elif valor > float(pedido_cliente['limiteAtencao']) :
                        processoFunc = pegar_top_processo()
                        titulo = f"{pedido_cliente['tipo']} está em atenção!"
                        prioridadeAlerta = "Média"
                        descricaoAlerta = f"Valor assima do padrão detectado: {valor}, {pedido_cliente['tipo']} medida: {pedido_cliente['medida']}"
                        statusAlerta = "To Do"
                        tipo_incidente = "Alerta de Atenção"
                        fkPedido = pedido_cliente['idcomponenteServidor']
                        componente = pedido_cliente['tipo']
                        processo = processoFunc['nome']
                        processoCPU = processoFunc['cpu']
                        processoRAM = processoFunc['ram']
                        processoDISCO = processoFunc['disco']
                        inserirAlerta(valor, titulo, prioridadeAlerta, descricaoAlerta, statusAlerta, tipo_incidente, fkPedido,
                                       componente, processo, processoCPU, processoRAM, processoDISCO)
                except Exception as e:
                    print(f"Erro ao processar pedido: {e}")
                    # limiteCritico VARCHAR(45),
                    # limiteAtencao VARCHAR(45)

            tempo_passado = (datetime.datetime.now() - ultimo_envio_s3).total_seconds()
            if tempo_passado >= intervalo_envio_s3:
                dadosBucket(dadosS3, mac_address)
                ultimo_envio_s3 = datetime.datetime.now()

            time.sleep(5)

        except Exception as e:
            print(f"Erro: {e}")
            time.sleep(10)

monitorar()