import psutil
import time
import uuid
import json
import datetime
import tempfile
import requests
import threading
import platform

def pegando_mac_address():
    return uuid.getnode()

############################################################################################################################################################################

def obterPedidos(mac_address):
    try:
        fetch_pedido = "http://34.198.19.147:5000/mysql/pedidosCliente"
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
        fetch_inserirDados = "http://34.198.19.147:5000/mysql/dadosCapturados"
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
            fetch_tempoReal = "http://34.198.19.147:3333/dashMonitoramento/dadosTempoReal"
            resposta = requests.post(fetch_tempoReal, json=listaTempoReal)

            if resposta.status_code == 200:
                print("Dados enviados em tempo real")
                print(resposta.json())
            else:
                print(f"Erro ao enviar os dados em tempo real: {resposta.status_code}")
                print(resposta.text)
        except Exception as e:
            print(f"Erro ao conectar na rota tempo real: {e}")

############################################################################################################################################################################

def enviarDadosPedidoCliente(listaPedidoCliente):
        try:
            fetch_tempoReal = "http://34.198.19.147:3333/dashMonitoramento/dadosPedidoCliente"
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




def enviarTopProcessos(listaProcessos):
    try:
        # Garante que sempre enviamos uma lista com exatamente 3 processos
        processos_para_enviar = []
        
        # Adiciona os processos disponíveis
        for i in range(3):
            if i < len(listaProcessos):
                processos_para_enviar.append(listaProcessos[i])
            else:
                # Preenche com processos vazios se necessário
                processos_para_enviar.append({
                    "idMaquina": listaProcessos[0]["idMaquina"] if listaProcessos else 0,
                    "pid": 0,
                    "nome": "Processo não encontrado",
                    "cpu": 0,
                    "ram": 0,
                    "disco": 0
                })
        
        print(f"[DEBUG] Enviando estrutura: {len(processos_para_enviar)} processos")
        
        fetch_tempoReal = "http://34.198.19.147:3333/dashMonitoramento/processosPorMaquina"
        resposta = requests.post(fetch_tempoReal, json=processos_para_enviar)

        if resposta.status_code == 200:
            print("Processos enviados com sucesso")
            print(processos_para_enviar)
            print(resposta.json())
        else:
            print(f"Erro ao enviar os processos da máquina: {resposta.status_code}")
            print(resposta.text)
    except Exception as e:
        print(f"Erro ao conectar com a rota de processos: {e}")

############################################################################################################################################################################

def inserirAlerta(valor, titulo, prioridadeAlerta, descricaoAlerta, statusAlerta, tipo_incidente, fkPedido, componente, processo, processoCPU, processoRAM, processoDISCO):
    try:
        fetch_inserirAlerta = "http://34.198.19.147:5000/mysql/inserirAlerta"
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
        fetch_dadosS3 = "http://34.198.19.147:5000/aws/dadosS3"
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
    sistema_operacional = platform.system()
    
    # Estratégia diferente baseada no SO
    if sistema_operacional == "Darwin":  # macOS
        # Primeira passada para baseline
        for processo in psutil.process_iter():
            try:
                processo.cpu_percent()
            except Exception as e:
                continue
        
        time.sleep(0.5)  # Aguarda para o macOS calcular
        
        # Segunda passada para dados reais
        for processo in psutil.process_iter():
            try:
                uso = processo.cpu_percent()
                lista.append((processo, uso))
            except Exception as e:
                continue
    else:  # Windows e Linux
        for processo in psutil.process_iter():
            try:
                uso = processo.cpu_percent(interval=0.1)
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
    
    # Detecção do sistema operacional para uso de disco
    sistema_operacional = platform.system()
    if sistema_operacional == "Windows":
        uso_disco2 = psutil.disk_usage('C:\\').percent
    else:  # macOS e Linux
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


def pegar_top_3_processos(idMaquina):
    """
    Captura todos os processos do sistema e retorna os 3 com maior consumo de CPU
    incluindo o idMaquina fornecido - Compatível com macOS, Windows e Linux
    """
    print(f"[DEBUG] Iniciando coleta de processos para máquina {idMaquina}")
    sistema_operacional = platform.system()
    print(f"[DEBUG] Sistema operacional detectado: {sistema_operacional}")
    
    lista_processos = []
    
    # Detecta o sistema operacional para aplicar a estratégia correta
    if sistema_operacional == "Darwin":  # macOS
        print("[DEBUG] Aplicando estratégia para macOS...")
        # Primeira passada: coleta inicial para estabelecer baseline no macOS
        print("[DEBUG] Fazendo primeira passada para baseline do CPU...")
        for processo in psutil.process_iter(['pid', 'name']):
            try:
                processo.cpu_percent()  # Chama uma vez para estabelecer baseline
            except:
                continue
        
        # Aguarda um pouco para o macOS calcular os percentuais
        time.sleep(0.5)
        
        # Segunda passada: coleta os dados reais
        print("[DEBUG] Coletando dados reais dos processos...")
        for processo in psutil.process_iter(['pid', 'name', 'memory_percent']):
            try:
                # No macOS, precisa chamar cpu_percent() sem cache para ter valores reais
                cpu_usage = processo.cpu_percent()
                
                # Se ainda for 0, tenta mais uma vez
                if cpu_usage == 0:
                    cpu_usage = processo.cpu_percent(interval=0.1)
                
                # Coleta informações de I/O se disponível
                try:
                    io_counters = processo.io_counters()
                    disco_usage = io_counters.read_bytes + io_counters.write_bytes
                except (psutil.NoSuchProcess, psutil.AccessDenied, AttributeError):
                    disco_usage = 0
                
                processo_info = {
                    "idMaquina": idMaquina,
                    "pid": processo.info['pid'],
                    "nome": processo.info['name'],
                    "cpu": round(cpu_usage, 2),
                    "ram": round(processo.info['memory_percent'], 2),
                    "disco": disco_usage
                }
                
                lista_processos.append(processo_info)
                
                # Print detalhado de cada processo capturado (apenas os primeiros 15)
                if len(lista_processos) <= 15:
                    print(f"[DEBUG] Processo capturado: PID:{processo.info['pid']} | Nome:{processo.info['name']} | CPU:{round(cpu_usage, 2)}% | RAM:{round(processo.info['memory_percent'], 2)}%")
                
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
            except Exception as e:
                continue
    
    else:  # Windows e Linux
        print(f"[DEBUG] Aplicando estratégia para {sistema_operacional}...")
        # Para Windows e Linux, uma única passada com interval funciona melhor
        for processo in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                # No Windows/Linux, cpu_percent(interval=0.1) funciona bem na primeira chamada
                cpu_usage = processo.info['cpu_percent']
                if cpu_usage is None or cpu_usage == 0:
                    cpu_usage = processo.cpu_percent(interval=0.1)
                
                # Coleta informações de I/O se disponível
                try:
                    io_counters = processo.io_counters()
                    disco_usage = io_counters.read_bytes + io_counters.write_bytes
                except (psutil.NoSuchProcess, psutil.AccessDenied, AttributeError):
                    disco_usage = 0
                
                processo_info = {
                    "idMaquina": idMaquina,
                    "pid": processo.info['pid'],
                    "nome": processo.info['name'],
                    "cpu": round(cpu_usage, 2),
                    "ram": round(processo.info['memory_percent'], 2),
                    "disco": disco_usage
                }
                
                lista_processos.append(processo_info)
                
                # Print detalhado de cada processo capturado (apenas os primeiros 15)
                if len(lista_processos) <= 15:
                    print(f"[DEBUG] Processo capturado: PID:{processo.info['pid']} | Nome:{processo.info['name']} | CPU:{round(cpu_usage, 2)}% | RAM:{round(processo.info['memory_percent'], 2)}%")
                
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
            except Exception as e:
                continue
    
    print(f"[DEBUG] Total de processos coletados: {len(lista_processos)}")
    
    # Filtra processos com CPU > 0 para debug
    processos_com_cpu = [p for p in lista_processos if p['cpu'] > 0]
    print(f"[DEBUG] Processos com CPU > 0: {len(processos_com_cpu)}")
    
    # Ordena por CPU usage (decrescente) e pega os top 3
    top_3_processos = sorted(lista_processos, key=lambda x: x['cpu'], reverse=True)[:3]
    
    print(f"[DEBUG] Top 3 processos ordenados:")
    for i, proc in enumerate(top_3_processos, 1):
        print(f"[DEBUG] TOP {i}: {proc['nome']} - PID:{proc['pid']} - CPU:{proc['cpu']}% - RAM:{proc['ram']}%")
    
    # Se todos os processos têm CPU = 0, usa os com maior RAM
    if all(proc['cpu'] == 0 for proc in top_3_processos):
        print("[DEBUG] Todos os processos com CPU = 0, ordenando por RAM...")
        top_3_processos = sorted(lista_processos, key=lambda x: x['ram'], reverse=True)[:3]
        print(f"[DEBUG] Top 3 processos por RAM:")
        for i, proc in enumerate(top_3_processos, 1):
            print(f"[DEBUG] TOP {i}: {proc['nome']} - PID:{proc['pid']} - RAM:{proc['ram']}%")
    
    # Se não encontrou processos suficientes, preenche com dados vazios
    while len(top_3_processos) < 3:
        top_3_processos.append({
            "idMaquina": idMaquina,
            "pid": 0,
            "nome": "Processo não encontrado",
            "cpu": 0,
            "ram": 0,
            "disco": 0
        })
    
    return top_3_processos

processos_atuais = []
lock_processos= threading.Lock()

def monitorarProcesso():
    """
    Função dedicada para monitorar os processos em thread separada
    Atualiza a variável global processos_atuais a cada 10 segundos
    """
    global processos_atuais
    
    while True:
        try:
            mac_address = pegando_mac_address()
            pedidos = obterPedidos(mac_address)
            
            print(f"[DEBUG] Thread processos - MAC: {mac_address}")
            print(f"[DEBUG] Thread processos - Pedidos encontrados: {len(pedidos) if pedidos else 0}")
            
            if pedidos and len(pedidos) > 0:
                idMaquina = pedidos[0]['idMaquina']
                print(f"[DEBUG] Thread processos - ID Máquina: {idMaquina}")
                
                novos_processos = pegar_top_3_processos(idMaquina)
                print(f"[DEBUG] Thread processos - Processos capturados: {len(novos_processos)}")
                
                # Debug dos processos
                for i, proc in enumerate(novos_processos):
                    print(f"[DEBUG] Processo {i+1}: {proc['nome']} - CPU: {proc['cpu']}%")
                
                # Thread-safe update da variável global
                with lock_processos:
                    processos_atuais = novos_processos
                
                print(f"[DEBUG] Processos atualizados na variável global")
                
                # Envia os processos para o dashboard
                enviarTopProcessos(novos_processos)
            else:
                print("[DEBUG] Nenhum pedido encontrado na thread de processos")
            
            # Atualiza os processos a cada 10 segundos
            time.sleep(10)
            
        except Exception as e:
            print(f"[ERRO] Erro no monitoramento de processos: {e}")
            import traceback
            traceback.print_exc()
            time.sleep(15)


def obter_processo_atual():
    """
    Função auxiliar para obter o processo principal atual de forma thread-safe
    """
    global processos_atuais
    
    with lock_processos:
        print(f"[DEBUG] obter_processo_atual - Processos disponíveis: {len(processos_atuais)}")
        if processos_atuais and len(processos_atuais) > 0:
            processo = processos_atuais[0]
            print(f"[DEBUG] Retornando processo: {processo['nome']} - CPU: {processo['cpu']}%")
            return processo
        else:
            print("[DEBUG] Nenhum processo disponível, retornando processo padrão")
            return {
                "nome": "Nenhum processo encontrado",
                "cpu": 0,
                "ram": 0,
                "disco": 0
            }
    
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

        # Inicia a thread de monitoramento de processos
    thread_processos = threading.Thread(target=monitorarProcesso, daemon=True)
    thread_processos.start()
    print("Thread de monitoramento de processos iniciada")



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
                            "CPU": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[0], "limiteCritico": pedidos[0]["limiteCritico"], "limiteAtencao": pedidos[0]["limiteAtencao"], "limiteMaquinaG": pedidos[0]["limiteG"], "limiteMaquinaA": pedidos[0]["limiteA"], "alertasAberto": pedidos[0]["aberto"], "alertasAndamento": pedidos[0]["andamento"]},
                            "RAM": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[1], "limiteCritico": pedidos[1]["limiteCritico"], "limiteAtencao": pedidos[1]["limiteAtencao"], "limiteMaquinaG": pedidos[0]["limiteG"], "limiteMaquinaA": pedidos[0]["limiteA"], "alertasAberto": pedidos[0]["aberto"], "alertasAndamento": pedidos[0]["andamento"]},
                            "DISCO": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[2], "limiteCritico": pedidos[2]["limiteCritico"], "limiteAtencao": pedidos[2]["limiteAtencao"], "limiteMaquinaG": pedidos[0]["limiteG"], "limiteMaquinaA": pedidos[0]["limiteA"], "alertasAberto": pedidos[0]["aberto"], "alertasAndamento": pedidos[0]["andamento"]},
                            "RedeEnviada": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[3], "limiteCritico": pedidos[3]["limiteCritico"], "limiteAtencao": pedidos[3]["limiteAtencao"], "limiteMaquinaG": pedidos[0]["limiteG"], "limiteMaquinaA": pedidos[0]["limiteA"], "alertasAberto": pedidos[0]["aberto"], "alertasAndamento": pedidos[0]["andamento"]},
                            "RedeRecebida": {"idFabrica": pedidos[0]['fkFabrica'], "idMaquina": pedidos[0]['idMaquina'], "mac_address": mac_address, "valor": dados[4], "limiteCritico": pedidos[4]["limiteCritico"], "limiteAtencao": pedidos[4]["limiteAtencao"], "limiteMaquinaG": pedidos[0]["limiteG"], "limiteMaquinaA": pedidos[0]["limiteA"], "alertasAberto": pedidos[0]["aberto"], "alertasAndamento": pedidos[0]["andamento"]}
                    }]
            enviarDadosTempoReal(listaTempoReal)

            
            for pedido_cliente in pedidos:
                print((pedido_cliente['tipo'], pedido_cliente['medida']))
                idFabrica = pedido_cliente['fkFabrica']
                idMaquina = pedido_cliente['idMaquina']
                tipo = pedido_cliente['tipo']
                medida = pedido_cliente['medida']
                limiteAtencao = pedido_cliente['limiteAtencao']
                limiteCritico = pedido_cliente['limiteCritico']
                pular_processamento = False

                try:
                    valor = eval(pedido_cliente['codigo'])
                    idPedido = pedido_cliente['idcomponenteServidor']
                    dadosS3["leitura"].append({
                        "componente": pedido_cliente['tipo'],
                        "medida": pedido_cliente['medida'],
                        "idFabrica": pedido_cliente['fkFabrica'],
                        "idMaquina": pedido_cliente['idMaquina'],
                        "valor": valor,
                    })

                    listaPedidoCliente.append({
                            tipo:{"idFabrica": idFabrica, "idMaquina": idMaquina, "Valor": valor, "Medida": medida,"limiteCritico": limiteCritico, "limiteAtencao": limiteAtencao, "mac_address": mac_address}
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
                dadosS3["leitura"] = []

            enviarDadosPedidoCliente(listaPedidoCliente)
            listaPedidoCliente = []


            time.sleep(1)

        except Exception as e:
            print(f"Erro: {e}")
            time.sleep(10)

monitorar()