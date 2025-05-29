import mysql.connector
import platform
import socket
import uuid

conexao = mysql.connector.connect(
    host="localhost",
    user="root",
    password="matheus12",
    database="opticarFrio",
    port="3306"
)

conexao2 = mysql.connector.connect(
    host="localhost",
    user="root",
    password="matheus12",
    database="opticarQuente",
    port="3306"
)

cursor = conexao.cursor()
cursor2 = conexao2.cursor()
so = platform.system()
ip = socket.gethostbyname(socket.gethostname())
hostname = socket.gethostname()
mac = uuid.getnode()
fabrica = 1 

print(mac)

cursor.execute("""
    INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname)
    VALUES (%s, %s, %s, %s, %s)
""", (so, ip, fabrica, mac, hostname))

cursor2.execute("""
    INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname)
    VALUES (%s, %s, %s, %s, %s)
""", (so, ip, fabrica, mac, hostname))


conexao.commit()
conexao2.commit()
print("Máquina cadastrada")

cursor.close()
conexao.close()
cursor2.close()
conexao2.close()