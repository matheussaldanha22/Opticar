import psutil
import time
import uuid
import mysql.connector
import json
import datetime
import boto3

#Aqui a gente pega o mac Adress para comparar depois

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

            # Vamos guardar os dados aqui pra mandar pro bucket
            dados_json = {
                "mac_address": mac_address,
                "timestamp": datetime.now().isoformat(),
                "leituras": []
            }

            for pedido_cliente in pedidos_clientes:
                chave_dict = (pedido_cliente['tipo'], pedido_cliente['medida'])
                chama_funcao = pedido_coleta.get(chave_dict)

                if chama_funcao:
                    valor = chama_funcao()
                    dados_json["leituras"].append({
                        "componente": pedido_cliente['tipo'],
                        "medida": pedido_cliente['medida'],
                        "valor": valor
                    })

                    # Também salva no banco local
                    cursor.execute("""
                        INSERT INTO capturaDados (fkComponenteServidor, valor, data)
                        VALUES (%s, %s, NOW())
                    """, (pedido_cliente['idcomponenteServidor'], valor)) 
                    conexao.commit()

            # Envia os dados pro bucket
            enviar_para_s3(mac_address, dados_json)

            cursor.close()
            conexao.close()
            time.sleep(10)

        except Exception as e:
            print("Erro:", e)
            time.sleep(10)
#Inicia tudo
monitorar()