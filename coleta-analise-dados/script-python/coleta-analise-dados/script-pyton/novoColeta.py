import psutil
import time
import uuid
import mysql.connector
import json
import datetime
import boto3
import os
import tempfile

# Aqui a gente pega o mac Adress para comparar depois de tudo
# def enviarS3(mac_address,dados_json):
#     s3=boto3.client("s3",region_name='us-east-1')

#     nome_arquivo = os.path.join(tempfile.gettempdir(), 'dados.json')
#     with open(nome_arquivo, mode='wt') as file:
#         json.dump(dados_json, file)

#     s3.upload_file(
#             Filename=nome_arquivo,
#             Bucket='rawopticarython',
#             Key= f'{mac_address}/dados.json',    
# )
   

def pegando_mac_address():
    return uuid.getnode()

def conectar():
    return mysql.connector.connect(
    host="localhost",
    user="root",
    password="@Zaqueuchavier123",
    database="opticar",
    port="3306"
    )

def conectarFrio():
    return mysql.connector.connect(
    host="localhost",
    user="root",
    password="@Zaqueuchavier123",
    database="opticarFrio",
    port="3306"
    )

#Aqui é afunção principal que vai realizar as validações e os inserts

def monitorar():
    mac_address = pegando_mac_address()
    print(f"Iniciando monitoramento nesse mac_address: {mac_address}")
    # intervalo_envio_s3 = 5 # isso em segundos é 1h
    # ultimo_envio_s3 = datetime.datetime.now()

    while True:
        print("Conexao com o banco iniciada (WHILE)")

        try:
            conexao = conectar()
            conexaoFrio = conectarFrio()
            cursor = conexao.cursor(dictionary=True)
            cursorFrio = conexaoFrio.cursor(dictionary=True)
            print(conexao)

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
                print((pedido_cliente['tipo'], pedido_cliente['medida']))

                try:
                    valor = eval(pedido_cliente['codigo'])
                    print(valor)

                    dados_json["leitura"].append({
                        "componente": pedido_cliente['tipo'],
                        "medida": pedido_cliente['medida'],
                        "valor": valor
                    })

                    cursorFrio.execute("""
                    SELECT opticarFrio.componenteServidor.idcomponenteServidor FROM opticarFrio.componenteServidor
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
                
                except Exception as e:
                    print(f"Erro ao avaliar o código do componente {pedido_cliente['tipo']} - {pedido_cliente['medida']}: {e}")

            cursor.close()
            conexao.close()
            cursorFrio.close()
            conexaoFrio.close()

            # tempo_passado = (datetime.datetime.now() - ultimo_envio_s3).total_seconds()
            # if tempo_passado >= intervalo_envio_s3:
            #     enviarS3(mac_address, dados_json)
            #     ultimo_envio_s3 = datetime.datetime.now()

            time.sleep(0)

        except Exception as e:
            print("Erro:", e)
            time.sleep(10)
#Inicia tudo
monitorar()

