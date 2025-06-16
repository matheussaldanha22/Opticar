GRANT ALL PRIVILEGES ON opticarQuente.* TO 'admin'@'%';
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS opticarQuente;
ALTER DATABASE opticarQuente CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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

-- Insere componentes
INSERT INTO componente (tipo, medida, indicador, codigo) VALUES
('Cpu', 'Porcentagem', '%', 'round(psutil.cpu_percent(interval=1), 2)'),
('Cpu', 'Frêquencia', 'MHz', 'round(psutil.cpu_freq().current, 2)'),
('Ram', 'Porcentagem', '%', 'round(psutil.virtual_memory().percent, 2)'),
('Ram', 'Frequencia', 'MHz', 'round(psutil.virtual_memory().available / (1024 ** 3), 2)'),
('Disco', 'Porcentagem', '%', 'round(psutil.disk_usage("/").percent, 2)'),
('Rede', 'Recebida', 'MB', 'round(psutil.net_io_counters().bytes_recv / (1024 ** 2), 2)'),
('Rede', 'Enviada', 'MB', 'round(psutil.net_io_counters().bytes_sent / (1024 ** 2), 2)');

-- Insere máquinas
INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname) VALUES
('windows', 'saldanha', 1, 258262364149366, 'alpha-srv01'),
('mac-os', 'vitor', 1, 134894360200011, 'beta-srv01'),
('windows', 'duda', 1, 132243600390200, 'gama-srv01'),
('windows', 'marcelo', 1, 239460606207958, 'omega-srv01'),
('windows', 'zaqueu', 1, 251776438657434, 'brito-srv01'),
('Ubuntu', '192.168.1.11', 2, 30303030305, 'ovelha-srv01'),
('Ubuntu', '192.168.1.15', 3, 30303030306, 'vaca-srv01'),
('Ubuntu', '192.168.1.15', 4, 30303030307, 'macaco-srv01'),
('Ubuntu', '192.168.1.15', 5, 30303030308, 'cachorro-srv01'),
('Ubuntu', '192.168.1.15', 6, 30303030309, 'passaro-srv01');


-- ComponenteServidor (os 5 obrigatórios por máquina)

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
(7, 6, 'Modelo REDE TX', '90', '75'),

(1, 7, 'Modelo CPU', '90', '75'),
(3, 7, 'Modelo RAM', '90', '75'),
(5, 7, 'Modelo DISCO', '90', '75'),
(6, 7, 'Modelo REDE RX', '90', '75'),
(7, 7, 'Modelo REDE TX', '90', '75'),

(1, 8, 'Modelo CPU', '90', '75'),
(3, 8, 'Modelo RAM', '90', '75'),
(5, 8, 'Modelo DISCO', '90', '75'),
(6, 8, 'Modelo REDE RX', '90', '75'),
(7, 8, 'Modelo REDE TX', '90', '75'),

(1, 9, 'Modelo CPU', '90', '75'),
(3, 9, 'Modelo RAM', '90', '75'),
(5, 9, 'Modelo DISCO', '90', '75'),
(6, 9, 'Modelo REDE RX', '90', '75'),
(7, 9, 'Modelo REDE TX', '90', '75'),

(1, 10, 'Modelo CPU', '90', '75'),
(3, 10, 'Modelo RAM', '90', '75'),
(5, 10, 'Modelo DISCO', '90', '75'),
(6, 10, 'Modelo REDE RX', '90', '75'),
(7, 10, 'Modelo REDE TX', '90', '75');

-- Procedimento para gerar histórico com ALERTAS DIÁRIOS e VARIEDADE (2020-2024)
DELIMITER $$
CREATE PROCEDURE gerarHistoricoComVariedade()
BEGIN
  DECLARE dt DATE DEFAULT '2020-01-01';
  DECLARE fim DATE DEFAULT '2025-06-10';
  DECLARE dt_com_horario DATETIME;
  DECLARE contador_componente INT;
  DECLARE probabilidade_alerta FLOAT;
  DECLARE num_alertas_dia INT;
  DECLARE i INT;
  
  -- Processos variados para simulação
  DECLARE processos_lista TEXT DEFAULT 'chrome.exe,firefox.exe,java.exe,python.exe,node.exe,mysql.exe,apache.exe,nginx.exe,docker.exe,kubernetes.exe,redis.exe,mongodb.exe,postgres.exe,code.exe,teams.exe,zoom.exe,slack.exe,skype.exe,discord.exe,steam.exe';
  DECLARE processo_atual VARCHAR(50);
  DECLARE processo_index INT;
  
  WHILE dt < fim DO
    -- Gerar 2-6 alertas por dia (mais realista)
    SET num_alertas_dia = 2 + FLOOR(RAND() * 5);
    SET i = 0;
    
    WHILE i < num_alertas_dia DO
      -- Horário aleatório do dia
      SET dt_com_horario = TIMESTAMP(dt, SEC_TO_TIME(FLOOR(RAND() * 86400)));
      
      -- Selecionar componente com probabilidades diferentes
      SET probabilidade_alerta = RAND();
      IF probabilidade_alerta < 0.4 THEN
        -- 40% CPU (mais comum) - IDs 1,6,11,16,21,26
        SET contador_componente = 1 + FLOOR(RAND() * 6) * 5;
      ELSEIF probabilidade_alerta < 0.7 THEN
        -- 30% RAM - IDs 2,7,12,17,22,27  
        SET contador_componente = 2 + FLOOR(RAND() * 6) * 5;
      ELSEIF probabilidade_alerta < 0.85 THEN
        -- 15% DISCO - IDs 3,8,13,18,23,28
        SET contador_componente = 3 + FLOOR(RAND() * 6) * 5;
      ELSEIF probabilidade_alerta < 0.95 THEN
        -- 10% REDE RX - IDs 4,9,14,19,24,29
        SET contador_componente = 4 + FLOOR(RAND() * 6) * 5;
      ELSE
        -- 5% REDE TX - IDs 5,10,15,20,25,30
        SET contador_componente = 5 + FLOOR(RAND() * 6) * 5;
      END IF;
      
      -- Selecionar processo aleatório
      SET processo_index = 1 + FLOOR(RAND() * 20);
      SET processo_atual = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(processos_lista, ',', processo_index), ',', -1));
      
      -- Captura com valores mais realistas baseados em distribuição
      INSERT INTO capturaDados (fkComponenteServidor, valor, data)
      VALUES (contador_componente, 
              CASE 
                WHEN RAND() < 0.15 THEN ROUND(85 + (RAND() * 10), 2) -- 15% crítico (85-95)
                WHEN RAND() < 0.35 THEN ROUND(75 + (RAND() * 10), 2) -- 20% alto (75-85)
                WHEN RAND() < 0.65 THEN ROUND(60 + (RAND() * 15), 2) -- 30% médio (60-75)
                ELSE ROUND(30 + (RAND() * 30), 2) -- 35% baixo (30-60)
              END, 
              dt_com_horario);
      
      -- Alerta correspondente
      INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente,
        medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key)
      SELECT dt_com_horario,
             cd.valor,
             CASE 
               WHEN cd.valor >= 90 THEN 'Alerta Crítico Severo'
               WHEN cd.valor >= 85 THEN 'Alerta Crítico'
               WHEN cd.valor >= 75 THEN 'Alerta Alto'
               ELSE 'Alerta Médio'
             END,
             CASE 
               WHEN cd.valor >= 90 THEN 'Situação crítica - intervenção urgente'
               WHEN cd.valor >= 85 THEN 'Uso crítico - ação imediata necessária'
               WHEN cd.valor >= 75 THEN 'Uso elevado - monitoramento contínuo'
               ELSE 'Uso moderado - verificação recomendada'
             END,
             CASE 
               WHEN cd.valor >= 90 THEN 'Crítica'
               WHEN cd.valor >= 85 THEN 'Crítica'
               WHEN cd.valor >= 75 THEN 'Alta'
               ELSE 'Média'
             END,
             CASE 
               WHEN cd.valor >= 90 THEN 'Incidente Severo'
               WHEN cd.valor >= 85 THEN 'Incidente Crítico'
               WHEN cd.valor >= 75 THEN 'Alerta Alto'
               ELSE 'Alerta Atenção'
             END,
             c.tipo,
             c.medida,
             CASE 
               WHEN RAND() < 0.6 THEN 'RESOLVIDO'
               WHEN RAND() < 0.85 THEN 'ABERTO'
               ELSE 'EM_ANDAMENTO'
             END,
             cd.idCapturaDados,
             processo_atual,
             ROUND(5 + (RAND() * 25), 2),
             ROUND(10 + (RAND() * 30), 2),
             ROUND(RAND() * 15, 2),
             CONCAT('HIST-', YEAR(dt), LPAD(MONTH(dt), 2, '0'), LPAD(DAY(dt), 2, '0'), '-', cd.idCapturaDados)
      FROM capturaDados cd
      JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
      JOIN componente c ON cs.fkComponente = c.idcomponente
      WHERE cd.data = dt_com_horario
      ORDER BY cd.idCapturaDados DESC
      LIMIT 1;
      
      SET i = i + 1;
    END WHILE;
    
    SET dt = DATE_ADD(dt, INTERVAL 1 DAY);
  END WHILE;
END$$

DELIMITER ;

-- Executar geração de histórico

-- INSERTS ATUAIS - Capturas para referenciar nos alertas manuais
INSERT INTO capturaDados VALUES
(DEFAULT, 1, 78, '2025-06-01 08:15:00'),
(DEFAULT, 6, 82, '2025-06-01 14:30:00'),
(DEFAULT, 2, 67, '2025-06-01 19:45:00'),
(DEFAULT, 11, 91, '2025-06-02 09:20:00'),
(DEFAULT, 7, 73, '2025-06-02 15:10:00'),
(DEFAULT, 3, 86, '2025-06-03 07:45:00'),
(DEFAULT, 12, 84, '2025-06-03 16:25:00'),
(DEFAULT, 8, 69, '2025-06-04 10:30:00'),
(DEFAULT, 16, 77, '2025-06-04 18:15:00'),
(DEFAULT, 17, 88, '2025-06-05 11:45:00'),
(DEFAULT, 21, 72, '2025-06-06 06:00:00'),
(DEFAULT, 22, 85, '2025-06-06 12:30:00'),
(DEFAULT, 23, 79, '2025-06-06 18:45:00'),
(DEFAULT, 26, 74, '2025-06-06 23:20:00'),
(DEFAULT, 4, 83, '2025-06-07 08:40:00'),
(DEFAULT, 1, 90, '2025-06-08 13:15:00'),
(DEFAULT, 13, 76, '2025-06-09 17:30:00'),
(DEFAULT, 7, 87, '2025-06-10 09:00:00');

-- ====================================
-- INSERTS MANUAIS - JUNHO 2025 (TODOS OS DIAS)
-- ====================================

-- VARIÁVEIS PARA IDS (começando do histórico gerado + capturas atuais)
SET @base_id = (SELECT MAX(idCapturaDados) FROM capturaDados) - 35;

-- DIA 01/06/2025 - 3 alertas
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-01 08:15:00', 78, "Alerta CPU Alto", "Verificar processos em execução", "Alta", "Alerta Alto", "Cpu", "Porcentagem", "ABERTO", 1, "chrome.exe", 18, 25, 2, "JUNE-001");

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-01 14:30:00', 82, "Alerta Rede", "Tráfego elevado detectado", "Média", "Alerta Atenção", "Rede", "MB", "RESOLVIDO", 2, "firefox.exe", 12, 30, 1, "JUNE-002");

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-01 19:45:00', 67, "Alerta RAM", "Uso moderado de memória", "Média", "Alerta Atenção", "Ram", "Porcentagem", "ABERTO", 3, "java.exe", 15, 28, 0, "JUNE-003");

-- DIA 02/06/2025 - 2 alertas
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-02 09:20:00', 91, "Alerta Crítico CPU", "Uso crítico - ação imediata", "Crítica", "Incidente Crítico", "Cpu", "Porcentagem", "ABERTO", 4, "python.exe", 25, 40, 8, "JUNE-004");

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-02 15:10:00', 73, "Alerta RAM", "Verificar aplicações", "Média", "Alerta Atenção", "Ram", "Porcentagem", "EM_ANDAMENTO", 5, "node.exe", 13, 32, 3, "JUNE-005");

-- DIA 03/06/2025 - 2 alertas
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-03 07:45:00', 86, "Alerta Disco", "Espaço em disco baixo", "Alta", "Alerta Alto", "Disco", "Porcentagem", "ABERTO", 6, "mysql.exe", 20, 45, 12, "JUNE-006");

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-03 16:25:00', 84, "Alerta RAM Alto", "Verificar vazamentos de memória", "Alta", "Alerta Alto", "Ram", "Porcentagem", "ABERTO", 7, "apache.exe", 17, 38, 4, "JUNE-007");

-- DIA 04/06/2025 - 2 alertas
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-04 10:30:00', 69, "Alerta Rede", "Monitorar conectividade", "Média", "Alerta Atenção", "Rede", "MB", "RESOLVIDO", 8, "nginx.exe", 11, 22, 1, "JUNE-008");

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-04 18:15:00', 77, "Alerta CPU", "Pico de processamento", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 9, "docker.exe", 19, 35, 6, "JUNE-009");

-- DIA 05/06/2025 - 1 alerta crítico
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-05 11:45:00', 88, "Alerta Crítico RAM", "Memória quase esgotada", "Crítica", "Incidente Crítico", "Ram", "Porcentagem", "ABERTO", 10, "kubernetes.exe", 22, 50, 15, "JUNE-010");

-- DIA 06/06/2025 - 4 alertas (vários horários)
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-06 06:00:00', 72, "Alerta Manhã", "Verificar inicialização", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "ABERTO", 11, "redis.exe", 14, 26, 2, "JUNE-011");

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-06 12:30:00', 85, "Alerta Meio-dia", "Pico horário comercial", "Alta", "Alerta Alto", "Ram", "Porcentagem", "EM_ANDAMENTO", 12, "mongodb.exe", 18, 42, 8, "JUNE-012");

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-06 18:45:00', 79, "Alerta Tarde", "Atividade elevada", "Média", "Alerta Atenção", "Disco", "Porcentagem", "ABERTO", 13, "postgres.exe", 16, 33, 9, "JUNE-013");

INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-06 23:20:00', 74, "Alerta Noite", "Backup em execução", "Média", "Alerta Atenção", "Cpu", "Porcentagem", "RESOLVIDO", 14, "code.exe", 13, 29, 5, "JUNE-014");

-- DIA 07/06/2025
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-07 08:40:00', 83, "Alerta Rede Alto", "Largura de banda limitada", "Alta", "Alerta Alto", "Rede", "MB", "ABERTO", 15, "teams.exe", 21, 36, 3, "JUNE-015");

-- DIA 08/06/2025
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-08 13:15:00', 90, "Alerta Crítico", "Sistema sobrecarregado", "Crítica", "Incidente Crítico", "Cpu", "Porcentagem", "ABERTO", 16, "zoom.exe", 28, 48, 12, "JUNE-016");

-- DIA 09/06/2025
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-09 17:30:00', 76, "Alerta Disco", "Limpeza recomendada", "Média", "Alerta Atenção", "Disco", "Porcentagem", "ABERTO", 17, "slack.exe", 15, 31, 7, "JUNE-017");

-- DIA 10/06/2025
INSERT INTO alerta (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, medida, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO, jira_issue_key) 
VALUES ('2025-06-10 09:00:00', 87, "Alerta RAM Crítico", "Reinicialização necessária", "Crítica", "Incidente Crítico", "Ram", "Porcentagem", "ABERTO", 18, "skype.exe", 24, 52, 18, "JUNE-018");

SELECT  COUNT(idAlerta) as qtdalertas, 
		componente,
		CASE 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        ELSE 'Madrugada'
		END as periodo
		FROM alerta
		JOIN capturaDados as cap 
        ON alerta.fkCapturaDados = cap.idCapturaDados
		JOIN componenteServidor as comp 
        ON cap.fkcomponenteServidor = comp.idcomponenteServidor
		JOIN servidor_maquina as maq 
		ON comp.fkMaquina = maq.idMaquina
		WHERE YEAR(dataHora) = 2025
		AND MONTH(dataHora) = 6
		AND fkFabrica = 1
		GROUP BY componente, periodo
		ORDER BY periodo;
