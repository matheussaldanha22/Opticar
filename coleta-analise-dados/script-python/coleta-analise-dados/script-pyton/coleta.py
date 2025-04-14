import psutil
import time
import uuid
import mysql.connector

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

    #Aqui você vai primeiramente fazer um select da maquina aonde o mac_address é o mesmo que o seu

    while True:
        try:
            conexao = conectar()
            cursor = conexao.cursor(dictionary=True) #Bem aqui eu falo pro python para que por favor ela faça isso vir que nem um dict

            cursor.execute("""
                SELECT * FROM componenteServidor JOIN servidor_maquina ON componenteServidor.fkMaquina = servidor_maquina.idMaquina
				JOIN componente ON componenteServidor.fkComponente = componente.idComponente
                WHERE servidor_maquina.Mac_Address = %s;

            """, (mac_address,))
            pedidos_clientes = cursor.fetchall()

            for pedido_cliente in pedidos_clientes:
                chave_dict = (pedido_cliente['tipo'], pedido_cliente['medida'])
                chama_funcao = pedido_coleta.get(chave_dict)

                print(f"Verificando chave: {chave_dict} verificando função: {chama_funcao}")

                if chama_funcao:
                    valor = chama_funcao()
                    cursor.execute("""
                        INSERT INTO capturaDados (fkComponenteServidor, valor, data)
                        VALUES (%s, %s, NOW())
                    """, (pedido_cliente['idcomponenteServidor'], valor)) 
                    conexao.commit()

            cursor.close()
            conexao.close()
            time.sleep(10) 

        except Exception as e:
            print("Erro:", e)
            time.sleep(10)

#Inicia tudo
monitorar()