drop database opticarQuente;
CREATE DATABASE IF NOT EXISTS opticarQuente;
USE opticarQuente;


-- Tabelas
CREATE TABLE IF NOT EXISTS servidor_maquina (
    idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    sistema_operacional VARCHAR(45),
    ip VARCHAR(45),
    fkFabrica INT,
    Mac_Address BIGINT UNIQUE,
    hostname VARCHAR(45),
    limiteA INT,
    limiteG INT
);

CREATE TABLE IF NOT EXISTS pedidoProcesso (
	idPedidoProcesso INT PRIMARY KEY auto_increment,
    pid INT,
    nome VARCHAR(200),
    fkServidor_maquina INT,
    FOREIGN KEY (fkServidor_maquina) REFERENCES servidor_maquina(idMaquina)
);

CREATE TABLE IF NOT EXISTS componente (
    idcomponente INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(45),
    medida VARCHAR(45),
    indicador VARCHAR(45),
    codigo VARCHAR(400)
);

CREATE TABLE IF NOT EXISTS componenteServidor (
    idcomponenteServidor INT PRIMARY KEY AUTO_INCREMENT,
    fkComponente INT,
    fkMaquina INT,
    modelo VARCHAR(45),
    limiteCritico VARCHAR(45),
    limiteAtencao VARCHAR(45),
    FOREIGN KEY (fkComponente) REFERENCES componente(idcomponente) ON DELETE CASCADE,
    FOREIGN KEY (fkMaquina) REFERENCES servidor_maquina(idMaquina) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS capturaDados (
    idCapturaDados INT PRIMARY KEY AUTO_INCREMENT,
    fkComponenteServidor INT,
    valor FLOAT,
    data DATETIME,
    FOREIGN KEY (fkComponenteServidor) REFERENCES componenteServidor(idcomponenteServidor) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerta (
    idAlerta INT PRIMARY KEY AUTO_INCREMENT,
    dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor FLOAT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    prioridade VARCHAR(45) DEFAULT 'Média',
    tipo_incidente VARCHAR(50),
    componente VARCHAR(50),
    medida varchar(50),
    statusAlerta VARCHAR(45) DEFAULT 'ABERTO',
    fkCapturaDados INT NOT NULL,
    processo VARCHAR(100),
    processoCPU FLOAT,
    processoRAM FLOAT,
    processoDISCO FLOAT,
    jira_issue_key VARCHAR(20),
    FOREIGN KEY (fkCapturaDados) REFERENCES capturaDados(idCapturaDados) ON DELETE CASCADE
);

-- Insere componentes (mesmo "cardápio")
INSERT INTO componente (tipo, medida, indicador, codigo) VALUES
('Cpu', 'Porcentagem', '%', 'round(psutil.cpu_percent(interval=1), 2)'),
('Cpu', 'Frêquencia', 'MHz', 'round(psutil.cpu_freq().current, 2)'),
('Ram', 'Porcentagem', '%', 'round(psutil.virtual_memory().percent, 2)'),
('Ram', 'Frequencia', 'MHz', 'round(psutil.virtual_memory().available / (1024 ** 3), 2)'),
('Disco', 'Porcentagem', '%', 'round(psutil.disk_usage("/").percent, 2)'),
('Rede', 'Recebida', 'MB', 'round(psutil.net_io_counters().bytes_recv / (1024 ** 2), 2)'),
('Rede', 'Enviada', 'MB', 'round(psutil.net_io_counters().bytes_sent / (1024 ** 2), 2)');

-- Insere máquinas (mesmas do frio)
INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname) VALUES
('Ubuntu', '192.168.1.10', 1, 10101010101, 'alpha-srv01'),
('Ubuntu', '192.168.1.11', 2, 20202020202, 'beta-srv01'),
('Ubuntu', '192.168.1.12', 3, 30303030303, 'gama-srv01'),
('Ubuntu', '192.168.1.13', 4, 10101010102, 'omega-srv01'),
('Ubuntu', '192.168.1.14', 5, 20202020203, 'brito-srv01'),
('Ubuntu', '192.168.1.15', 6, 30303030304, 'ovelha-srv01');

-- Insere pedidos obrigatórios em ordem específica para cada máquina (5 por máquina)
INSERT INTO componenteServidor (fkComponente, fkMaquina, modelo, limiteCritico, limiteAtencao) VALUES
-- Máquina 1 (Alpha)
(1, 1, 'Modelo CPU', '90', '75'),
(3, 1, 'Modelo RAM', '90', '75'),
(5, 1, 'Modelo DISCO', '90', '75'),
(6, 1, 'Modelo REDE RX', '90', '75'),
(7, 1, 'Modelo REDE TX', '90', '75'),
-- Máquina 2 (Beta)
(1, 2, 'Modelo CPU', '90', '75'),
(3, 2, 'Modelo RAM', '90', '75'),
(5, 2, 'Modelo DISCO', '90', '75'),
(6, 2, 'Modelo REDE RX', '90', '75'),
(7, 2, 'Modelo REDE TX', '90', '75'),
-- Máquina 3 (Gama)
(1, 3, 'Modelo CPU', '90', '75'),
(3, 3, 'Modelo RAM', '90', '75'),
(5, 3, 'Modelo DISCO', '90', '75'),
(6, 3, 'Modelo REDE RX', '90', '75'),
(7, 3, 'Modelo REDE TX', '90', '75'),
-- Máquina 4 (Omega)
(1, 4, 'Modelo CPU', '90', '75'),
(3, 4, 'Modelo RAM', '90', '75'),
(5, 4, 'Modelo DISCO', '90', '75'),
(6, 4, 'Modelo REDE RX', '90', '75'),
(7, 4, 'Modelo REDE TX', '90', '75'),
-- Máquina 5 (Brito)
(1, 5, 'Modelo CPU', '90', '75'),
(3, 5, 'Modelo RAM', '90', '75'),
(5, 5, 'Modelo DISCO', '90', '75'),
(6, 5, 'Modelo REDE RX', '90', '75'),
(7, 5, 'Modelo REDE TX', '90', '75'),
-- Máquina 6 (Ovelha)
(1, 6, 'Modelo CPU', '90', '75'),
(3, 6, 'Modelo RAM', '90', '75'),
(5, 6, 'Modelo DISCO', '90', '75'),
(6, 6, 'Modelo REDE RX', '90', '75'),
(7, 6, 'Modelo REDE TX', '90', '75');

-- Procedimento para gerar histórico (2020-2024)

DELIMITER $$
CREATE PROCEDURE gerarHistorico()
BEGIN
  DECLARE dt DATETIME DEFAULT '2020-01-01 00:00:00';
  DECLARE fim DATETIME DEFAULT '2025-01-01 00:00:00';
  DECLARE dt_com_horario DATETIME;
  DECLARE intervalo_dias INT;
  
  WHILE dt < fim DO
    -- Horário completamente aleatório
    SET dt_com_horario = DATE_ADD(dt, 
      INTERVAL FLOOR(RAND() * 86400) SECOND);
    
    -- Captura com horário aleatório
    INSERT INTO capturaDados (fkComponenteServidor, valor, data)
    SELECT idcomponenteServidor, ROUND(30 + (RAND() * 70), 2), dt_com_horario 
    FROM componenteServidor;
    
    -- Alertas correspondentes
    INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente,
      medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key)
    SELECT dt_com_horario,
           cd.valor,
           'Alerta Histórico',
           'Gerado para histórico',
           CASE 
             WHEN RAND() < 0.5 THEN 'Média' 
             ELSE 'Crítica' 
           END,
           'Histórico',
           c.tipo,
           'Porcentagem',
           'RESOLVIDO',
           cd.idCapturaDados,
           'procHist',
           ROUND(RAND() * 10, 2),
           ROUND(RAND() * 10, 2),
           ROUND(RAND() * 10, 2),
           CONCAT('HIST-', cd.idCapturaDados)
    FROM capturaDados cd
    JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
    JOIN componente c ON cs.fkComponente = c.idcomponente
    WHERE cd.data = dt_com_horario;
    
    -- Intervalo semanal com pequena variação (5-9 dias)
    SET intervalo_dias = 5 + FLOOR(RAND() * 5);
    SET dt = DATE_ADD(dt, INTERVAL intervalo_dias DAY);
  END WHILE;
END$$

DELIMITER ;

-- Executar geração de histórico
CALL gerarHistorico();

-- INSERTS ATUAIS
CREATE TABLE IF NOT EXISTS capturaDados (
    idCapturaDados INT PRIMARY KEY AUTO_INCREMENT,
    fkComponenteServidor INT,
    valor FLOAT,
    data DATETIME,
    FOREIGN KEY (fkComponenteServidor) REFERENCES componenteServidor(idcomponenteServidor) ON DELETE CASCADE
);
insert into capturaDados values
(DEFAULT, 1, 70, NOW()),
(DEFAULT, 6, 80, NOW()),
(DEFAULT, 11, 65, NOW()),
(DEFAULT, 16, 90, NOW()),
(DEFAULT, 21, 75, NOW()),
(DEFAULT, 26, 85, NOW());

-- ====================================
-- BLOCO ID: 1034
-- ====================================

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1034, "google.exe", 14, 20, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 75, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1034, "google.exe", 15, 25, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 89, "Alerta", "Verificar", "Crítica", "Alerta Crítico", "Cpu", "Porcentagem", "ABERTO", 1034, "google.exe", 20, 35, 10);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1034, "google.exe", 14, 20, 0);

-- ====================================
-- BLOCO ID: 1035
-- ====================================

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1035, "google.exe", 14, 20, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 75, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1035, "google.exe", 15, 25, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 89, "Alerta", "Verificar", "Crítica", "Alerta Crítico", "Cpu", "Porcentagem", "ABERTO", 1035, "google.exe", 20, 35, 10);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1035, "google.exe", 14, 20, 0);

-- ====================================
-- BLOCO ID: 1036
-- ====================================

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1036, "google.exe", 14, 20, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 75, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1036, "google.exe", 15, 25, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 89, "Alerta", "Verificar", "Crítica", "Alerta Crítico", "Cpu", "Porcentagem", "ABERTO", 1036, "google.exe", 20, 35, 10);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1036, "google.exe", 14, 20, 0);

-- ====================================
-- BLOCO ID: 1037
-- ====================================

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1037, "google.exe", 14, 20, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 75, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1037, "google.exe", 15, 25, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 89, "Alerta", "Verificar", "Crítica", "Alerta Crítico", "Cpu", "Porcentagem", "ABERTO", 1037, "google.exe", 20, 35, 10);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1037, "google.exe", 14, 20, 0);

-- ====================================
-- BLOCO ID: 1038
-- ====================================

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1038, "google.exe", 14, 20, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 75, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1038, "google.exe", 15, 25, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 89, "Alerta", "Verificar", "Crítica", "Alerta Crítico", "Cpu", "Porcentagem", "ABERTO", 1038, "google.exe", 20, 35, 10);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1038, "google.exe", 14, 20, 0);

-- ====================================
-- BLOCO ID: 1039
-- ====================================

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1039, "google.exe", 14, 20, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 75, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1039, "google.exe", 15, 25, 0);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 89, "Alerta", "Verificar", "Crítica", "Alerta Crítico", "Cpu", "Porcentagem", "ABERTO", 1039, "google.exe", 20, 35, 10);

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO) 
VALUES (NOW(), 70, "Alerta", "Verificar", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 1039, "google.exe", 14, 20, 0);

