import mysql.connector
import platform
import socket
import uuid

conexao = mysql.connector.connect(
    host="localhost",
    user="root",
    password="110645",
    database="opticar"
)

cursor = conexao.cursor()

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

conexao.commit()
print("Máquina cadastrada")

cursor.close()
conexao.close()