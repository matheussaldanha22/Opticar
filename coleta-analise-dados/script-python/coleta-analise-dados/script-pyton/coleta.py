import psutil
import time
import uuid
import mysql.connector
import json
import datetime
import boto3
import os
import tempfile

#Aqui a gente pega o mac Adress para comparar depois de tudo
# def enviarS3(mac_address,dados_json):
<<<<<<< Updated upstream
#     s3=boto3.client("s3",region_name='us-east-1')
=======
#     s3=boto3.client("s3",region_name='us-east-1') 
>>>>>>> Stashed changes

#     nome_arquivo = os.path.join(tempfile.gettempdir(), 'dados.json')
#     with open(nome_arquivo, mode='wt') as file:
#         json.dump(dados_json, file)

#     s3.upload_file(
#             Filename=nome_arquivo,
#             Bucket='s3-python-32',
<<<<<<< Updated upstream
#             Key= f'{mac_address}/dados.json',    
# )
   
=======
#             Key= f'{mac_address}/dados.json',     
# )
    
>>>>>>> Stashed changes

def pegando_mac_address():
    return uuid.getnode()

#Aqui a gente pega os dados

def cpu_percent():
    return round(psutil.cpu_percent(interval=1), 2)

def ram_percent():
    return round(psutil.virtual_memory().percent, 2)

def ram_usada_gb():
    return round(psutil.virtual_memory().used / (1024 ** 3), 2)

def ram_total_gb():
    return round(psutil.virtual_memory().total / (1024 ** 3), 2)

def disk_percent():
    return round(psutil.disk_usage('/').percent, 2)

def disk_usado_gb():
    return round(psutil.disk_usage('/').used / (1024 ** 3), 2)

def net_rec():
    return round(psutil.net_io_counters().bytes_recv / (1024 ** 2), 2)

def net_sent():
    return round(psutil.net_io_counters().bytes_sent / (1024 ** 2), 2)

def get_download_mb():
    return round(psutil.net_io_counters().bytes_recv / 1024 / 1024, 2)

def get_upload_mb():
    return round(psutil.net_io_counters().bytes_sent / 1024 / 1024, 2)

def get_sent_percent():
    net = psutil.net_io_counters()
    total = net.bytes_sent + net.bytes_recv
    return round((net.bytes_sent / total) * 100, 2) if total > 0 else 0.0

def cpu_freq():
    return round(psutil.cpu_freq().current, 2)

def tempo_ligado():
    uptime_seconds = (datetime.datetime.now() - datetime.datetime.fromtimestamp(psutil.boot_time())).total_seconds()
    uptime_hours = int(uptime_seconds // 3600)
    return uptime_hours

# Calcula as horas desde o último boot do sistema

def qtd_processos_ativos():
    return len(psutil.pids())

def temperatura_cpu():
    try:
        temperatura = psutil.sensors_temperatures()
        for lista_temp in temperatura.values():
            for temp in lista_temp:
                if temp.current:
                    return round(temp.current, 2)
    except:
        pass
    return None



pedido_coleta = {
    ("Cpu", "Porcentagem"): cpu_percent,
    ("Cpu", "Frêquencia"): cpu_freq,
    ("Cpu", "Temperatura"): temperatura_cpu,
    ("Ram", "Porcentagem"): ram_percent,
    ("Ram", "Usada"): ram_usada_gb,
    ("Ram", "Total"): ram_total_gb,
    ("Disco", "Usado"): disk_usado_gb,
    ("Disco", "Porcentagem"): disk_percent,
    ("Rede", "Recebida"): net_rec,
    ("Rede", "Enviada"): net_sent,
    ("Rede", "Upload"): get_upload_mb,
    ("Rede", "Download"): get_download_mb,
    ("Rede", "Rede Envio"): get_sent_percent,
    ("Sistema", "Tempo Ligado"): tempo_ligado,
    ("Sistema", "Qtd Processos Ativos"): qtd_processos_ativos,
}

#Aqui conecta com o banco de dados

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="@Zaqueuchavier123",
        database="opticar"
    )

def conectarFrio():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="@Zaqueuchavier123",
        database="opticarFrio"
    )

#Aqui é afunção principal que vai realizar as validações e os inserts

def monitorar():
    mac_address = pegando_mac_address()
    print(f"Iniciando monitoramento nesse mac_address: {mac_address}")
    intervalo_envio_s3 = 10 # isso em segundos é 1h
    ultimo_envio_s3 = datetime.datetime.now()

    while True:
        try:
            conexao = conectar()
            conexaoFrio = conectarFrio()
            cursor = conexao.cursor(dictionary=True)
            cursorFrio = conexaoFrio.cursor(dictionary=True)

            # Busca no banco os componentes que devem ser monitorados para esse MAC
            cursor.execute("""
                SELECT * FROM opticar.componenteServidor 
                JOIN opticar.servidor_maquina ON opticar.componenteServidor.fkMaquina = opticar.servidor_maquina.idMaquina
                JOIN opticar.componente ON opticar.componenteServidor.fkComponente = opticar.componente.idcomponente
                WHERE opticar.servidor_maquina.Mac_Address = %s;
            """, (mac_address,))
            pedidos_clientes = cursor.fetchall()

            dados_json= {
                "macAdress": mac_address,
                "dataAtual": datetime.datetime.now().isoformat(),
                "leitura": []
            }

            for pedido_cliente in pedidos_clientes:
                chave_dict = (pedido_cliente['tipo'], pedido_cliente['medida'])
                print(chave_dict)
                chama_funcao = pedido_coleta.get(chave_dict)
                print(chama_funcao)

                if chama_funcao:
                    valor = chama_funcao()
                    print(valor)
                    dados_json["leitura"].append({
                        "componente": pedido_cliente['tipo'],
                        "medida": pedido_cliente['medida'],
                        "valor": valor
                    })
                    print(pedido_cliente['idcomponenteServidor'])

                    cursorFrio.execute("""
                    SELECT opticarFrio.componenteServidor.idcomponenteServidor FROM opticarFrio.componenteservidor
                    WHERE fkComponente = %s AND fkMaquina = %s
                    """, (pedido_cliente['fkComponente'], pedido_cliente['fkMaquina']))

                    resultado_frio = cursorFrio.fetchone()

                    if resultado_frio:
                        id_frio = resultado_frio['idcomponenteServidor']
                        cursorFrio.execute("""
                        INSERT INTO opticarFrio.capturaDados (fkComponenteServidor, valor, data)
                        VALUES (%s, %s, NOW());
                        """, (id_frio, valor))
                        conexaoFrio.commit()
                    else:
                        print(f"Componente não encontrado no opticarFrio para fkComponente={pedido_cliente['fkComponente']} e fkMaquina={pedido_cliente['fkMaquina']}")

            cursor.close()
            conexao.close()
            cursorFrio.close()
            conexaoFrio.close()

<<<<<<< Updated upstream
            # tempo_passado = (datetime.datetime.now() - ultimo_envio_s3).total_seconds()
=======
            tempo_passado = (datetime.datetime.now() - ultimo_envio_s3).total_seconds()
>>>>>>> Stashed changes
            # if tempo_passado >= intervalo_envio_s3:
            #     enviarS3(mac_address, dados_json)
            #     ultimo_envio_s3 = datetime.datetime.now()

            time.sleep(0)
           

        except Exception as e:
            print("Erro:", e)
            time.sleep(10)
#Inicia tudo
monitorar()

# inserts para fazer isso:
# insert into componenteservidor values
# (default, 1, 1, "intel", "45", "59"),
# (default, 2, 1, "intel", "45", "59"),
# (default, 3, 1, "intel", "45", "59"),
# (default, 4, 1, "intel", "45", "59"),
# (default, 5, 1, "intel", "45", "59"),
# (default, 6, 1, "intel", "45", "59"),
# (default, 7, 1, "intel", "45", "59"),
# (default, 8, 1, "intel", "45", "59"),
# (default, 9, 1, "intel", "45", "59"),
# (default, 10, 1, "intel", "45", "59"),
# (default, 11, 1, "intel", "45", "59"),
# (default, 12, 1, "intel", "45", "59"),
# (default, 13, 1, "intel", "45", "59"),
# (default, 14, 1, "intel", "45", "59"),
# (default, 15, 1, "intel", "45", "59");
