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
def enviarS3(mac_address,dados_json):

    s3=boto3.client("s3",region_name='us-east-1') 

    nome_arquivo = os.path.join(tempfile.gettempdir(), 'dados.json')
    with open(nome_arquivo, mode='wt') as file:
        json.dump(dados_json, file)

    s3.upload_file(
            Filename=nome_arquivo,
            Bucket='s3-python-32',
            Key= f'{mac_address}/dados.json',     
    )




def pegando_mac_address():
    return uuid.getnode()

#Aqui a gente pega os dados

def cpu_percent(): 
    return psutil.cpu_percent()

def cpu_freq(): 
    return psutil.cpu_freq().current

def memory_used(): 
    return psutil.virtual_memory().used

def disk_percent(): 
    return psutil.disk_usage('/').percent

def enviar_para_s3(mac_address, dados_json):
    s3 = boto3.client('s3',
        aws_access_key_id='SUA_ACCESS_KEY',
        aws_secret_access_key='SUA_SECRET_KEY',
        region_name='us-east-1'  # Região do seu bucket
    )

    nome_arquivo = f"monitoramento/{mac_address}_{datetime.now().isoformat()}.json"
    s3.put_object(
        Bucket='meu-bucket-monitoramento',
        Key=nome_arquivo,
        Body=json.dumps(dados_json)
    )
    print(f"Arquivo enviado para S3: {nome_arquivo}")
#Aqui a gente monta um dict que recebe como palavras chaves o componente e a medida para então chamar a função

pedido_coleta = {
    ("cpu", "porcentagem"): cpu_percent,
    ("cpu", "frequencia"): cpu_freq,
    ("memoria", "usado"): memory_used,
    ("disco", "porcentagem"): disk_percent
}

#Aqui conecta com o banco de dados

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="110645",
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
            time.sleep(10)
            enviarS3(mac_address, dados_json)
            

        except Exception as e:
            print("Erro:", e)
            time.sleep(10)
#Inicia tudo
monitorar()