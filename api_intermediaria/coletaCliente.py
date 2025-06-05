import psutil
import time
import uuid
import json
import datetime
import tempfile
import requests

def pegando_mac_address():
    return uuid.getnode()

############################################################################################################################################################################

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
    
############################################################################################################################################################################

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

############################################################################################################################################################################

def enviarDadosTempoReal(listaTempoReal):
        try:
            fetch_tempoReal = "http://localhost:8080/dashMonitoramento/dadosTempoReal"
            resposta = requests.post(fetch_tempoReal, json=listaTempoReal)

            if resposta.status_code == 200:
                print("Dados enviados em tempo real")
                print(resposta.json())
            else:
                print(f"Erro ao enviar os dados em tempo real: {resposta.status_code}")
                print(resposta.text)
        except Exception as e:
            print(f"Erro ao conectar na rota tempo real: {e}")


# def enviarDadosPedidoTempoReal(listaTempoReal):
#         try:
#             fetch_tempoReal = "http://localhost:8080/dashMonitoramento/dadosPedidoCliente"
#             resposta = requests.post(fetch_tempoReal, json=listaTempoReal)

#             if resposta.status_code == 200:
#                 print("Dados enviados em tempo real")
#                 print(resposta.json())
#             else:
#                 print(f"Erro ao enviar os dados em tempo real: {resposta.status_code}")
#                 print(resposta.text)
#         except Exception as e:
#             print(f"Erro ao conectar na rota tempo real: {e}")

############################################################################################################################################################################

def enviarDadosPedidoCliente(listaPedidoCliente):
        try:
            fetch_tempoReal = "http://localhost:8080/dashMonitoramento/dadosPedidoCliente"
            resposta = requests.post(fetch_tempoReal, json=listaPedidoCliente)

            if resposta.status_code == 200:
                print("Dados enviados do pedido do cliente")
                print(listaPedidoCliente)
                print(resposta.json())
            else:
                print(f"Erro ao enviar os dados do pedido do cliente: {resposta.status_code}")
                print(resposta.text)
        except Exception as e:
            print(f"Erro ao conectar na rota dos pedidos do cliente: {e}")

############################################################################################################################################################################

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

############################################################################################################################################################################

def dadosBucket(dadosS3, mac_address, dataAtual, idFabrica):
    try:
        fetch_dadosS3 = "http://localhost:3333/aws/dadosS3"
        resposta = requests.post(fetch_dadosS3, json={"mac_address": mac_address, "dadosS3": dadosS3, "dataAtual": dataAtual, "idFabrica": idFabrica})

        if resposta.status_code == 200:
            print("Dados enviados com sucesso")
            print(resposta.json())
        else:
            print(f"Erro ao enviar os dados: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar ROTA AWS: {e}")

############################################################################################################################################################################

def pegar_top_processo():
    lista = []
    for processo in psutil.process_iter():
        try:
            uso = processo.cpu_percent()
            lista.append((processo, uso))
        except Exception as e:
            continue
    maior_uso = 0
    processo = None
    for item in lista:
        if item[1] > maior_uso:
            maior_uso = item[1]
            if maior_uso > 100.0:
                maior_uso = 100.0
            processo = item 
    if processo:
        proc = processo[0]
        uso_cpu = maior_uso
        try:
            uso_ram = proc.memory_percent()
        except Exception as e:
            print(f"Não foi encontrado a ram {e}")
            uso_ram = 0
        try:
            io = proc.io_counters()
            uso_disco = io.read_bytes + io.write_bytes
        except Exception as e:
            print(f"Não foi encontrado o disco {e}")
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

############################################################################################################################################################################

def dadosObrigatorios():
    uso_cpu2 = psutil.cpu_percent()
    uso_ram2 = psutil.virtual_memory().percent
    uso_disco2 = psutil.disk_usage('/').percent
    rede = psutil.net_io_counters()
    time.sleep(1)
    rede2 = psutil.net_io_counters()
    bytes_enviados_por_seg = rede2.bytes_sent - rede.bytes_sent
    bytes_recebidos_por_seg = rede2.bytes_recv - rede.bytes_recv

    mb_enviados2 = round(bytes_enviados_por_seg / (1024 * 1024), 2)
    mb_recebidos2 = round(bytes_recebidos_por_seg / (1024 * 1024), 2)
    
    return uso_cpu2, uso_ram2, uso_disco2, mb_enviados2, mb_recebidos2
    
############################################################################################################################################################################
############################################################################################################################################################################
############################################################################################################################################################################
############################################################################################################################################################################
############################################################################################################################################################################
def monitorar():
    mac_address = pegando_mac_address()
    listaPedidoCliente = []
    # tipoComponente = []
    
    print(f"Iniciando monitoramento nesse mac_address: {mac_address}")
    intervalo_envio_s3 = 5 # 1 hora = 1440
    ultimo_envio_s3 = datetime.datetime.now()
    dadosS3 = {
        "macAddress": mac_address,
        "dataAtual": datetime.datetime.now().isoformat(),
        "leitura": []
    }
    while True:
        try:
            pedidos = obterPedidos(mac_address)
            dados = dadosObrigatorios()
            listaTempoReal = [{
                            "CPU": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[0]},
                            "RAM": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[1]},
                            "DISCO": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[2]},
                            "RedeEnviada": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[3]},
                            "RedeRecebida": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[4]}
                    }]
            enviarDadosTempoReal(listaTempoReal)

            
            for pedido_cliente in pedidos:
                print((pedido_cliente['tipo'], pedido_cliente['medida']))
                idFabrica = pedido_cliente['fkFabrica']
                idMaquina = pedido_cliente['idMaquina']
                tipo = pedido_cliente['tipo']
                medida = pedido_cliente['medida']
                pular_processamento = False

                # tipoComponente.append(tipo)

                # if tipo == "Cpu" and medida == "Porcentagem":
                #     pular_processamento = True
                # elif tipo == "Ram" and medida == "Porcentagem":
                #     pular_processamento = True
                # elif tipo == "Disco" and medida == "Porcentagem":
                #     pular_processamento = True
                # elif tipo == "Rede" and (medida == "Upload" or medida == "Download"):
                #     pular_processamento = True

                # if pular_processamento:
                #     print(f"--- Pedido pulado: Tipo={tipo}, Medida={medida}")
                #     continue 
                try:
                    valor = eval(pedido_cliente['codigo'])
                    idPedido = pedido_cliente['idcomponenteServidor']
                    dadosS3["leitura"].append({
                        "componente": pedido_cliente['tipo'],
                        "medida": pedido_cliente['medida'],
                        "idFabrica": pedido_cliente['fkFabrica'],
                        "idMaquina": pedido_cliente['idMaquina'],
                        "valor": valor
                    })

                    # if mac_address not in listaPedidoCliente:
                    #     listaPedidoCliente[mac_address] = []
                    # listaPedidoCliente[mac_address].append({
                    #     "{tipo}":{"idFabrica": idFabrica, "idMaquina": idMaquina, "Valor": valor, "Medida": medida, "mac_address": mac_address}
                    # })


                    listaPedidoCliente.append({
                            tipo:{"idFabrica": idFabrica, "idMaquina": idMaquina, "Valor": valor, "Medida": medida, "mac_address": mac_address}
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
                        inserirAlerta(valor, titulo, prioridadeAlerta, descricaoAlerta, statusAlerta, tipo_incidente, fkPedido, componente, processo, processoCPU, processoRAM, processoDISCO)
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
                        inserirAlerta(valor, titulo, prioridadeAlerta, descricaoAlerta, statusAlerta, tipo_incidente, fkPedido, componente, processo, processoCPU, processoRAM, processoDISCO)
                    
                except Exception as e:
                    print(f"Erro ao processar pedido: {e}")
            
            tempo_passado = (datetime.datetime.now() - ultimo_envio_s3).total_seconds()
            if tempo_passado >= intervalo_envio_s3:
                dataAtual = datetime.datetime.now().isoformat()
                dadosBucket(dadosS3, mac_address, dataAtual, idFabrica)
                ultimo_envio_s3 = datetime.datetime.now()

            enviarDadosPedidoCliente(listaPedidoCliente)
            listaPedidoCliente = []


            time.sleep(5)

        except Exception as e:
            print(f"Erro: {e}")
            time.sleep(10)

monitorar()