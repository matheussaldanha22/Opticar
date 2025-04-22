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

#     s3=boto3.client("s3",region_name='us-east-1') 

#     nome_arquivo = os.path.join(tempfile.gettempdir(), 'dados.json')
#     with open(nome_arquivo, mode='wt') as file:
#         json.dump(dados_json, file)

#     s3.upload_file(
#             Filename=nome_arquivo,
#             Bucket='s3-python-32',
#             Key= f'{mac_address}/dados.json',     
# )
    

def pegando_mac_address():
    return uuid.getnode()

#Aqui a gente pega os dados

def cpu_percent(): 
    return psutil.cpu_percent(interval=1)

def ram_percent():
    ram = psutil.virtual_memory()
    ram_percent = ram.percent
    return ram_percent

def ram_usada_gb():
    ram = psutil.virtual_memory()
    ram_usada_gb = ram.used / (1024 ** 3)
    return ram_usada_gb

def ram_total_gb():
    ram = psutil.virtual_memory()
    ram_total_gb = ram.total / (1024 ** 3)
    return ram_total_gb

def disk_percent(): 
    return psutil.disk_usage('/').percent

def disk_usado_gb():
    disk = psutil.disk_usage('/')
    disk_usado_gb = disk.used / (1024 ** 3)
    return disk_usado_gb

def net_rec():
    net_io = psutil.net_io_counters()
    internet_recebida = net_io.bytes_recv
    internet_recebida_mb = internet_recebida / (1024 ** 2)
    return internet_recebida_mb

def net_sent():
    net_io = psutil.net_io_counters()
    internet_enviada = net_io.bytes_sent
    internet_enviada_mb = internet_enviada / (1024 ** 2)
    return internet_enviada_mb

def get_download_mb():
    bytes_recebidos = psutil.net_io_counters().bytes_recv
    megabytes = round(bytes_recebidos / 1024 / 1024, 2)
    return megabytes

def get_upload_mb():
    bytes_enviados = psutil.net_io_counters().bytes_sent
    megabytes = round(bytes_enviados / 1024 / 1024, 2)
    return megabytes

def get_sent_percent():
    net = psutil.net_io_counters()
    sent = net.bytes_sent
    received = net.bytes_recv
    total = sent + received

    if total == 0:
        return 0.0 

    percent = (sent / total) * 100
    return round(percent, 2)

def cpu_freq(): 
    return psutil.cpu_freq().current



pedido_coleta = {
    ("Cpu", "Porcentagem"): cpu_percent,
    ("Cpu", "Frêquencia"): cpu_freq,
    ("Ram", "Porcentagem"): ram_percent,
    ("Ram", "Usada"): ram_usada_gb,
    ("Ram", "Total"): ram_total_gb,
    ("Disco", "Usado"): disk_usado_gb,
    ("Disco", "Porcentagem"): disk_percent,
    ("Rede", "Recebida"): net_rec,
    ("Rede", "Upload"): get_upload_mb,
    ("Rede", "Download"): get_download_mb,
    ("Rede", "Enviada"): net_sent,
    ("Rede", "Rede Envio"): get_sent_percent,
}

#Aqui conecta com o banco de dados

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="@Zaqueuchavier123",
        database="opticar"
    )

#Aqui é afunção principal que vai realizar as validações e os inserts

def monitorar():
    mac_address = pegando_mac_address()
    print(f"Iniciando monitoramento nesse mac_address: {mac_address}")

    while True:
        try:
            conexao = conectar()
            cursor = conexao.cursor(dictionary=True)

            # Busca no banco os componentes que devem ser monitorados para esse MAC
            cursor.execute("""
                SELECT * FROM componenteServidor 
                JOIN servidor_maquina ON componenteServidor.fkMaquina = servidor_maquina.idMaquina
                JOIN componente ON componenteServidor.fkComponente = componente.idComponente
                WHERE servidor_maquina.Mac_Address = %s;
            """, (mac_address,))
            pedidos_clientes = cursor.fetchall()

            dados_json= {
                "macAdress": mac_address,
                "dataAtual": datetime.datetime.now().isoformat(),
                "leitura": []
            }

            for pedido_cliente in pedidos_clientes:
                chave_dict = (pedido_cliente['tipo'], pedido_cliente['medida'])
                chama_funcao = pedido_coleta.get(chave_dict)
                print(chama_funcao)

                if chama_funcao:
                    valor = chama_funcao()
                    dados_json["leitura"].append({
                        "componente": pedido_cliente['tipo'],
                        "medida": pedido_cliente['medida'],
                        "valor": valor
                    })

                    cursor.execute("""
                        INSERT INTO capturaDados (fkComponenteServidor, valor, data)
                        VALUES (%s, %s, NOW())
                    """, (pedido_cliente['idcomponenteServidor'], valor)) 
                    
                    conexao.commit()


            cursor.close()
            conexao.close()
            time.sleep(0)
            # enviarS3(mac_address, dados_json)
            

        except Exception as e:
            print("Erro:", e)
            time.sleep(0)
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