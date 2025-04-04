import mysql.connector  # Biblioteca para conexão com o mysql
import time  # Biblioteca para contar o tempo
import psutil  # Biblioteca para captura dos recursos computacionais
import socket

def obter_dados():
    cpuPercent = psutil.cpu_percent(interval=1)  # Porcentagem em uso do CPU
    cpuFreqMax = psutil.cpu_freq().max
    cpuFreqCur = psutil.cpu_freq().current

    diskUsage = psutil.disk_usage('/')
    diskUsageTotal = round(diskUsage.total / (1024**3), 2)  # Total do disco em GB
    diskPercent = psutil.disk_usage('/').percent # Trocar para discol local C: caso o SO seja windows
    diskByte = psutil.disk_usage('/').used
  
    memory = psutil.virtual_memory()

    memoryTotal = round(memory.total / (1024**3), 2)  # Total de memória RAM
    memoryPercent = psutil.virtual_memory().percent
    memoryByte = psutil.virtual_memory().used

    return cpuPercent, cpuFreqCur, memoryPercent, memoryByte, diskPercent, diskByte

def dados_rede():
    netBefore = psutil.net_io_counters()
    time.sleep(0.1)
    netAfter = psutil.net_io_counters()

    download = netAfter.bytes_recv - netBefore.bytes_recv
    upload = netAfter.bytes_sent - netBefore.bytes_sent

    downloadMBs = download / 1_048_576 # Download sendo efetuado no momento da captura
    uploadMBs = upload / 1_048_576 # Upload sendo efetuado no momento da captura

    # net_if_addrs() retorna um dicionário com as interfaces de rede do sistema
    net_if_addrs = psutil.net_if_addrs()
    mac_address = None
    # net_if_addrs.items() retorna chave-valor
    for interface, addresses in net_if_addrs.items():
        # Verifica se a interface tem um endereço MAC e se é um endereço válido
        for addr in addresses:
            if addr.family == psutil.AF_LINK:  # Verifica se é um endereço MAC
                # Verifica se a interface é somente Ethernet
                if  "Ethernet 2" in interface:
                    # Atribue o endereço mac a variável mac_address
                    mac_address = addr.address
                    print(f"Interface: {interface} - MAC Address: {addr.address}")
                    # O Ethernet é usado para conexões física
    return round(downloadMBs, 1), round(uploadMBs, 1), mac_address 


# Efetua a conexão com o banco de dados
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="110645",
    database="mydb"
)

print(mydb)

mycursor = mydb.cursor()

print('----------DADOS CAPTURADOS----------')

while True:
    dados = obter_dados()
    dadosRede = dados_rede()

    cpu_percent = dados[0]
    cpu_freq = dados[1]
    memory_percent = dados[2]
    memory_byte = dados[3]
    disk_percent = dados[4]
    disk_byte = dados[5]

    download_mbs = dadosRede[0]
    upload_mbs = dadosRede[1]
    mac_address = dadosRede[2]

    for processos in psutil.process_iter():
        valProcessos = (processos.ppid(),processos.name(),1)
        sqlProcessos = "INSERT INTO processos (pid,nomeProcessos, fkCapturaMaq1) VALUES (%s,%s,%s);"
        mycursor.execute(sqlProcessos, valProcessos)
        mydb.commit()

    sql1 = "INSERT INTO capturaMaq1 (mac_address, cpu_percent, cpu_freq, ram_percent, ram_byte, disk_percent, disk_byte, download, upload) VALUES(%s ,%s, %s, %s, %s, %s, %s, %s, %s);"
    val1 = (mac_address ,cpu_percent, cpu_freq, memory_percent, memory_byte, disk_percent, disk_byte, download_mbs, upload_mbs)
    mycursor.execute(sql1, val1)

    mydb.commit()
    time.sleep(0.1)

    

    print(f"CPU Uso (%): {cpu_percent}")
    print(f"CPU Uso (Bytes): {cpu_freq}")
    print(f"Memória Uso (%): {memory_percent}")
    print(f"Memória Uso (Bytes): {memory_byte}")
    print(f"Disco Uso (%): {disk_percent}")
    print(f"Disco Uso (Bytes): {disk_byte}")
    print(f"Download: {download_mbs} MB/s")
    print(f"Upload: {upload_mbs} MB/s \n")

