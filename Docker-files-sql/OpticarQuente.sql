GRANT ALL PRIVILEGES ON opticarQuente.* TO 'admin'@'%';
FLUSH PRIVILEGES;
create database opticarQuente;
use opticarQuente;

   

CREATE TABLE servidor_maquina (
    idMaquina INT PRIMARY KEY auto_increment,
    sistema_operacional VARCHAR(45),
    ip VARCHAR(45),
    fkFabrica INT,
    Mac_Address BIGINT unique,
    hostname VARCHAR(45),
    limiteA INT,
    limiteG INT
);

CREATE TABLE componente (
    idcomponente INT PRIMARY KEY auto_increment,
    tipo VARCHAR(45),
    medida VARCHAR(45),
    indicador VARCHAR(45),
    codigo varchar(400)
);

CREATE TABLE componenteServidor (
    idcomponenteServidor INT PRIMARY KEY auto_increment,
    fkComponente INT,
    fkMaquina INT,
    modelo VARCHAR(45),
    limiteCritico VARCHAR(45),
    limiteAtencao VARCHAR(45),
    FOREIGN KEY (fkComponente) REFERENCES componente(idcomponente) ON DELETE CASCADE,
    FOREIGN KEY (fkMaquina) REFERENCES servidor_maquina(idMaquina) ON DELETE CASCADE
);

-- Configuração Alerta

CREATE TABLE capturaDados (
    idCapturaDados INT PRIMARY KEY auto_increment,
    fkComponenteServidor INT,
    valor FLOAT,
    data DATETIME,
    FOREIGN KEY (fkComponenteServidor) REFERENCES componenteServidor(idcomponenteServidor) ON DELETE CASCADE
);

CREATE TABLE alerta (
    idAlerta INT PRIMARY KEY AUTO_INCREMENT,
    dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor FLOAT NOT NULL,
    titulo VARCHAR(100) NOT NULL COMMENT 'Resumo do alerta para o campo Summary no JIRA',
    descricao TEXT COMMENT 'Detalhes para o campo Description no JIRA',
    prioridade VARCHAR(45) DEFAULT 'Média' COMMENT 'Mapeia para Priority no JIRA',
    tipo_incidente VARCHAR(50) COMMENT 'Mapeia para Issue Type no JIRA',
    componente VARCHAR(50) COMMENT 'Para o campo Component no JIRA',
    statusAlerta VARCHAR(45) DEFAULT 'To Do' COMMENT 'Status do alerta',
    fkCapturaDados INT NOT NULL COMMENT 'Referência à tabela capturaDados',
    processo VARCHAR(100),
    processoCPU FLOAT,
    processoRAM FLOAT,
    processoDISCO FLOAT,
    jira_issue_key VARCHAR(20) COMMENT 'Chave do ticket criado no JIRA (ex: PROJ-123)',
    FOREIGN KEY (fkCapturaDados) REFERENCES capturaDados(idCapturaDados) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




INSERT INTO alerta (
    dataHora,
    valor,
    titulo,
    descricao,
    prioridade,
    tipo_incidente,
    componente,
    statusAlerta,
    fkCapturaDados,
    processo,
    processoCPU,
    processoRAM,
    processoDISCO,
    jira_issue_key
) VALUES (
    '2025-05-12 10:45:00',                       -- dataHora
    92.3,                                        -- valor
    'Consumo excessivo de CPU no processo X',    -- titulo
    'O processo X está utilizando mais de 90% da CPU por mais de 10 minutos consecutivos.', -- descricao
    'Alta',                                      -- prioridade
    'Performance',                               -- tipo_incidente
    'cpu',                    -- componente
    'To Do',                                     -- statusAlerta
    1,                                           -- fkCapturaDados (substituir conforme seu dado real)
    'ProcessoX',                                 -- processo
    94.5,                                        -- processoCPU
    70.2,                                        -- processoRAM
    65.8,                                        -- processoDISCO
    'PROJ-201'                                   -- jira_issue_key
);

INSERT INTO alerta (
    dataHora,
    valor,
    titulo,
    descricao,
    prioridade,
    tipo_incidente,
    componente,
    statusAlerta,
    fkCapturaDados,
    processo,
    processoCPU,
    processoRAM,
    processoDISCO,
    jira_issue_key
) VALUES 
(
    '2025-05-14 08:20:00',
    88.6,
    'Uso elevado de memória RAM',
    'O processo Y está utilizando mais de 85% da memória RAM por tempo prolongado.',
    'Média',
    'Incidente de Memória',
    'cpu',
    'In Progress',
    1,
    'ProcessoY',
    55.1,
    88.6,
    40.3,
    'PROJ-202'
),
(
    '2025-05-17 13:40:00',
    93.4,
    'Sobrecarga de CPU e RAM no processo Z',
    'O processo Z apresenta picos de uso de CPU e RAM simultaneamente, afetando a performance do sistema.',
    'Alta',
    'Performance',
    'ram',
    'To Do',
    1,
    'ProcessoZ',
    95.8,
    91.2,
    47.5,
    'PROJ-203'
),
(
    '2025-05-20 11:10:00',
    75.9,
    'Uso excessivo de disco em processo A',
    'O processo A está comprometendo a escrita em disco com uso superior a 85%.',
    'Baixa',
    'Infraestrutura',
    'cpu',
    'Resolved',
    1,
    'ProcessoA',
    34.0,
    48.1,
    89.9,
    'PROJ-204'
),
(
    '2025-05-25 16:00:00',
    98.7,
    'Alerta crítico: recursos quase esgotados',
    'O processo B está consumindo quase toda CPU, RAM e DISCO disponíveis. A instância corre risco de travamento.',
    'Crítica',
    'Incidente Crítico',
    'cpu',
    'In Review',
    1,
    'ProcessoB',
    98.5,
    96.3,
    94.1,
    'PROJ-205'
);


INSERT INTO alerta (
    dataHora,
    valor,
    titulo,
    descricao,
    prioridade,
    tipo_incidente,
    componente,
    statusAlerta,
    fkCapturaDados,
    processo,
    processoCPU,
    processoRAM,
    processoDISCO,
    jira_issue_key
) VALUES
-- CPU
('2025-05-12 08:00:00', 92.3, 'Alerta CPU Manhã', 'Consumo alto de CPU durante a manhã.', 'Alta', 'Performance', 'cpu', 'To Do', 1, 'ProcessoCPU1', 92.3, 70.2, 65.8, 'CPU-001'),
('2025-05-12 14:00:00', 88.0, 'Alerta CPU Tarde', 'Consumo alto de CPU durante a tarde.', 'Alta', 'Performance', 'cpu', 'To Do', 1, 'ProcessoCPU2', 88.0, 72.0, 60.0, 'CPU-002'),
('2025-05-12 20:00:00', 85.1, 'Alerta CPU Noite', 'Consumo alto de CPU durante a noite.', 'Alta', 'Performance', 'cpu', 'To Do', 1, 'ProcessoCPU3', 85.1, 68.5, 59.9, 'CPU-003'),
('2025-05-13 02:00:00', 90.2, 'Alerta CPU Madrugada', 'Consumo alto de CPU na madrugada.', 'Alta', 'Performance', 'cpu', 'To Do', 1, 'ProcessoCPU4', 90.2, 69.3, 63.4, 'CPU-004'),

-- RAM
('2025-05-12 08:00:00', 80.4, 'Alerta RAM Manhã', 'Consumo alto de RAM durante a manhã.', 'Média', 'Performance', 'ram', 'To Do', 1, 'ProcessoRAM1', 50.0, 80.4, 45.0, 'RAM-001'),
('2025-05-12 14:00:00', 85.2, 'Alerta RAM Tarde', 'Consumo alto de RAM durante a tarde.', 'Média', 'Performance', 'ram', 'To Do', 1, 'ProcessoRAM2', 52.3, 85.2, 44.2, 'RAM-002'),
('2025-05-12 20:00:00', 87.0, 'Alerta RAM Noite', 'Consumo alto de RAM durante a noite.', 'Alta', 'Performance', 'ram', 'To Do', 1, 'ProcessoRAM3', 49.1, 87.0, 47.5, 'RAM-003'),
('2025-05-13 02:00:00', 83.3, 'Alerta RAM Madrugada', 'Consumo alto de RAM na madrugada.', 'Média', 'Performance', 'ram', 'To Do', 1, 'ProcessoRAM4', 48.0, 83.3, 46.8, 'RAM-004'),

-- DISCO
('2025-05-12 08:00:00', 75.0, 'Alerta Disco Manhã', 'Uso de disco elevado na manhã.', 'Média', 'Performance', 'disco', 'To Do', 1, 'ProcessoDISCO1', 40.0, 55.0, 75.0, 'DISCO-001'),
('2025-05-12 14:00:00', 78.9, 'Alerta Disco Tarde', 'Uso de disco elevado na tarde.', 'Alta', 'Performance', 'disco', 'To Do', 1, 'ProcessoDISCO2', 41.5, 56.1, 78.9, 'DISCO-002'),
('2025-05-12 20:00:00', 82.2, 'Alerta Disco Noite', 'Uso de disco elevado na noite.', 'Alta', 'Performance', 'disco', 'To Do', 1, 'ProcessoDISCO3', 42.3, 57.2, 82.2, 'DISCO-003'),
('2025-05-13 02:00:00', 80.5, 'Alerta Disco Madrugada', 'Uso de disco elevado na madrugada.', 'Alta', 'Performance', 'disco', 'To Do', 1, 'ProcessoDISCO4', 43.1, 58.0, 80.5, 'DISCO-004'),

-- REDE
('2025-05-12 08:00:00', 95.0, 'Alerta Rede Manhã', 'Tráfego de rede intenso na manhã.', 'Alta', 'Segurança', 'rede', 'To Do', 1, 'ProcessoREDE1', 50.0, 60.0, 40.0, 'REDE-001'),
('2025-05-12 14:00:00', 97.4, 'Alerta Rede Tarde', 'Tráfego de rede intenso na tarde.', 'Alta', 'Segurança', 'rede', 'To Do', 1, 'ProcessoREDE2', 52.0, 62.0, 42.0, 'REDE-002'),
('2025-05-12 20:00:00', 93.6, 'Alerta Rede Noite', 'Tráfego de rede intenso na noite.', 'Alta', 'Segurança', 'rede', 'To Do', 1, 'ProcessoREDE3', 53.2, 63.4, 43.1, 'REDE-003'),
('2025-05-13 02:00:00', 91.8, 'Alerta Rede Madrugada', 'Tráfego de rede intenso na madrugada.', 'Alta', 'Segurança', 'rede', 'To Do', 1, 'ProcessoREDE4', 54.0, 64.2, 44.3, 'REDE-004');


SELECT * FROM alerta;
drop table alerta;

select * from alerta;



INSERT INTO componente (tipo, medida, indicador, codigo) VALUES
('Cpu', 'Porcentagem', '%', 'round(psutil.cpu_percent(interval=1), 2)'),
('Cpu', 'Frêquencia', 'MHz', 'round(psutil.cpu_freq().current, 2)'),
('Cpu', 'Temperatura', '°C', 'round(psutil.sensors_temperatures()["coretemp"][0].current, 2) if psutil.sensors_temperatures() else None'),

('Ram', 'Porcentagem', '%', 'round(psutil.virtual_memory().percent, 2)'),
('Ram', 'Usada', 'GB', 'round(psutil.virtual_memory().used / (1024 ** 3), 2)'),
('Ram', 'Total', 'GB', 'round(psutil.virtual_memory().total / (1024 ** 3), 2)'),

('Disco', 'Usado', 'GB', 'round(psutil.disk_usage("/").used / (1024 ** 3), 2)'),
('Disco', 'Porcentagem', '%', 'round(psutil.disk_usage("/").percent, 2)'),

('Rede', 'Recebida', 'MB', 'round(psutil.net_io_counters().bytes_recv / (1024 ** 2), 2)'),
('Rede', 'Enviada', 'MB', 'round(psutil.net_io_counters().bytes_sent / (1024 ** 2), 2)'),
('Rede', 'Upload', 'MB', 'round(psutil.net_io_counters().bytes_sent / 1024 / 1024, 2)'),
('Rede', 'Download', 'MB', 'round(psutil.net_io_counters().bytes_recv / 1024 / 1024, 2)'),
('Rede', 'Rede Envio', '%', 'round((psutil.net_io_counters().bytes_sent / (psutil.net_io_counters().bytes_sent + psutil.net_io_counters().bytes_recv)) * 100, 2) if (psutil.net_io_counters().bytes_sent + psutil.net_io_counters().bytes_recv) > 0 else 0.0'),

('Sistema', 'Tempo Ligado', 'Tempo', 'int((datetime.datetime.now() - datetime.datetime.fromtimestamp(psutil.boot_time())).total_seconds() // 3600)'),
('Sistema', 'Qtd Processos Ativos', 'Qtd', 'len(psutil.pids())');

insert into servidor_maquina values
(1,	'Windows', '192.168.56.1', 1, 251776438657434, 'DESKTOP-KHH0UBD', null, null);
INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname) VALUES
('Linux', '192.168.1.10', 1, 123456789012345, 'server-norte'),
('Windows', '192.168.1.20', 2, 123456789012346, 'server-sul'),
('Linux', '192.168.1.30', 3, 123456789012347, 'server-leste');

select * from servidor_maquina;

insert into componenteServidor values
(default, 1, 1, "intel", "45", "59"),
(default, 2, 1, "intel", "45", "59"),
(default, 3, 1, "intel", "45", "59"),
(default, 4, 1, "intel", "45", "59"),
(default, 5, 1, "intel", "45", "59"),
(default, 6, 1, "intel", "45", "59"),
(default, 7, 1, "intel", "45", "59"),
(default, 8, 1, "intel", "45", "59"),
(default, 9, 1, "intel", "45", "59"),
(default, 10, 1, "intel", "45", "59"),
(default, 11, 1, "intel", "45", "59"),
(default, 12, 1, "intel", "45", "59"),
(default, 13, 1, "intel", "45", "59"),
(default, 14, 1, "intel", "45", "59"),
(default, 15, 1, "intel", "45", "59");

INSERT INTO capturaDados (fkComponenteServidor, valor, data) VALUES
(1, 75.0, NOW()),
(2, 110.0, NOW()),
(3, 180.0, NOW());

select * from capturaDados;
select * from alerta;

-- 5 alertas para fkFabrica = 1
INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados)
VALUES 
(77.5, 'Alerta 1', 'Temperatura elevada', 'Crítica', 'Superaquecimento', 'DISCO', 'To Do', 1),
(78.2, 'Alerta 2', 'Temperatura alta', 'Média', 'Monitoramento', 'DISCO', 'In Progress', 1),
(79.9, 'Alerta 3', 'Risco de superaquecimento', 'Crítica', 'Emergência', 'DISCO', 'Done', 1),
(80.1, 'Alerta 4', 'Temperatura no limite crítico', 'Crítica', 'Prevenção', 'DISCO', 'To Do', 1),
(81.5, 'Alerta 5', 'Temperatura acima do limite', 'Média', 'Observação', 'DISCO', 'In Progress', 1);

-- 11 alertas para fkFabrica = 2
INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados)
VALUES 
(115, 'Alerta 6', 'Pressão alta', 'Média', 'Monitoramento', 'RAM', 'To Do', 2),
(117, 'Alerta 7', 'Pressão subindo', 'Crítica', 'Emergência', 'RAM', 'In Progress', 2),
(118, 'Alerta 8', 'Pressão no limite', 'Média', 'Prevenção', 'RAM', 'Done', 2),
(119, 'Alerta 9', 'Pressão crítica', 'Crítica', 'Supervisão', 'RAM', 'To Do', 2),
(120, 'Alerta 10', 'Pressão extrema', 'Crítica', 'Falha iminente', 'RAM', 'In Progress', 2),
(121, 'Alerta 11', 'Pressão instável', 'Média', 'Diagnóstico', 'RAM', 'Done', 2),
(122, 'Alerta 12', 'Pressão oscilante', 'Crítica', 'Teste em andamento', 'RAM', 'To Do', 2),
(123, 'Alerta 13', 'Pressão no pico', 'Crítica', 'Análise requerida', 'RAM', 'In Progress', 2),
(124, 'Alerta 14', 'Pressão elevada contínua', 'Média', 'Precaução', 'RAM', 'Done', 2),
(125, 'Alerta 15', 'Pressão perigosa', 'Crítica', 'Verificação urgente', 'RAM', 'To Do', 2),
(126, 'Alerta 16', 'Pressão descontrolada', 'Crítica', 'Correção imediata', 'RAM', 'In Progress', 2);

-- 20 alertas para fkFabrica = 3
INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados)
VALUES 
(170, 'Alerta 17', 'Velocidade elevada', 'Média', 'Monitoramento', 'CPU', 'To Do', 3),
(175, 'Alerta 18', 'Velocidade no limite', 'Crítica', 'Prevenção', 'CPU', 'In Progress', 3),
(178, 'Alerta 19', 'Velocidade perigosa', 'Crítica', 'Atenção', 'CPU', 'Done', 3),
(180, 'Alerta 20', 'Velocidade máxima atingida', 'Crítica', 'Falha iminente', 'CPU', 'To Do', 3),
(182, 'Alerta 21', 'Velocidade instável', 'Média', 'Revisão necessária', 'CPU', 'In Progress', 3),
(185, 'Alerta 22', 'Velocidade acima da média', 'Crítica', 'Diagnóstico solicitado', 'CPU', 'Done', 3),
(187, 'Alerta 23', 'Velocidade fora dos padrões', 'Crítica', 'Precaução urgente', 'CPU', 'To Do', 3),
(190, 'Alerta 24', 'Velocidade crítica contínua', 'Crítica', 'Falha operacional', 'CPU', 'In Progress', 3),
(193, 'Alerta 25', 'Velocidade variável crítica', 'Média', 'Teste solicitado', 'CPU', 'Done', 3),
(195, 'Alerta 26', 'Velocidade irregular', 'Crítica', 'Correção emergencial', 'CPU', 'To Do', 3),
(198, 'Alerta 27', 'Velocidade fora da margem', 'Média', 'Investigação', 'CPU', 'In Progress', 3),
(200, 'Alerta 28', 'Velocidade extrema', 'Crítica', 'Manutenção requerida', 'CPU', 'Done', 3);

select * from componenteServidor;


SELECT sm.idMaquina, COUNT(*) AS totalCriticos
        FROM alerta a JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
        JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina WHERE a.prioridade = 'Crítica'and componente = 'CPU'
        GROUP BY sm.idMaquina ORDER BY totalCriticos DESC
        ;



-- #######################################################################################################################################################################################
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- MODEL ADMIN
SELECT servidor.fkFabrica, COUNT(CASE WHEN alerta.statusAlerta = 'To Do' THEN 1 END) AS qtd_to_do,
							   COUNT(CASE WHEN alerta.statusAlerta = 'In Progress' THEN 1 END) AS qtd_in_progress,
							   COUNT(CASE WHEN alerta.statusAlerta = 'Done' THEN 1 END) AS qtd_done
								FROM servidor_maquina AS servidor
								LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
								LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
								INNER JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados
								GROUP BY servidor.fkFabrica
								ORDER BY qtd_to_do + qtd_in_progress DESC;

SELECT servidor.fkFabrica, COUNT(CASE WHEN alerta.statusAlerta = 'To Do' THEN 1 END) AS qtd_to_do,
								COUNT(CASE WHEN alerta.statusAlerta = 'In Progress' THEN 1 END) AS qtd_in_progress,
								COUNT(CASE WHEN alerta.statusAlerta = 'Done' THEN 1 END) AS qtd_done
								FROM servidor_maquina AS servidor
								LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
								LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
								LEFT JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados WHERE fkFabrica = 1;
SELECT TIMESTAMPDIFF(MINUTE, MIN(cd.data), MAX(cd.data)) AS minutos_operacao,
								(SELECT COUNT(a.idAlerta) FROM alerta a 
								JOIN capturaDados cd2 ON a.fkCapturaDados = cd2.idCapturaDados
								JOIN componenteServidor cs2 ON cd2.fkComponenteServidor = cs2.idcomponenteServidor
								JOIN servidor_maquina sm2 ON cs2.fkMaquina = sm2.idMaquina
								WHERE sm2.fkFabrica = 1 AND YEAR(a.dataHora) = YEAR(CURDATE()) AND MONTH(a.dataHora) = MONTH(CURDATE())) AS qtd_alertas
								FROM capturaDados cd JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
								JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina WHERE sm.fkFabrica = 1
								AND YEAR(cd.data) = YEAR(CURDATE())
								AND MONTH(cd.data) = MONTH(CURDATE());
-- MODEL ALERTA
SELECT alerta.idAlerta, alerta.dataHora AS dataAlerta, alerta.valor, alerta.titulo, alerta.descricao, alerta.prioridade,
								lerta.tipo_incidente AS tipo, alerta.statusAlerta, alerta.jira_issue_key AS jira_key, 
								servidor.hostname, servidor.ip, servidor.Mac_Address, servidor.idMaquina, componenteServidor.modelo, componente.tipo AS tipoComponente, componente.medida AS medidaComponente 
								FROM alerta JOIN capturaDados AS captura ON alerta.fkCapturaDados = captura.idCapturaDados
								JOIN componenteServidor ON captura.fkComponenteServidor = idcomponenteServidor
								JOIN servidor_maquina AS servidor ON componenteServidor.fkMaquina = servidor.idMaquina
								JOIN componente ON componenteServidor.fkComponente = idcomponente;
select extract(month from dataHora) as mes,
								extract(year from dataHora) as ano
								from alerta group by mes, ano
								order by ano, mes asc;
-- DASH COMPONENTE MODEL
SELECT DISTINCT YEAR(c.data) AS ano
								FROM capturaDados c JOIN componenteServidor cs ON c.fkComponenteServidor = cs.idcomponenteServidor
								JOIN componente comp ON cs.fkComponente = comp.idcomponente
								JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
								WHERE sm.idMaquina = 1
								AND comp.tipo = 'CPU' ORDER BY ano DESC;
SELECT DISTINCT MONTH(c.data) AS mes
								FROM capturaDados c
								JOIN componenteServidor cs ON c.fkComponenteServidor = cs.idcomponenteServidor
								JOIN componente comp ON cs.fkComponente = comp.idcomponente
								JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
								WHERE YEAR(c.data) = 2025
								AND sm.idMaquina = 1
								AND comp.tipo = 'CPU'   
								ORDER BY mes;
SELECT COUNT(a.idAlerta) AS totalAlertas,
								SUM(CASE WHEN a.prioridade = "Crítica" THEN 1 ELSE 0 END) AS alertasCriticos,
								SUM(CASE WHEN a.prioridade = "Média" THEN 1 ELSE 0 END) AS alertasMédios
								FROM alerta as a
								JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
								JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
								JOIN componente c ON cs.fkComponente = c.idcomponente
								JOIN servidor_maquina ON idMaquina = fkMaquina
								WHERE c.tipo = 'CPU' AND servidor_maquina.idMaquina = 1
								AND YEAR(a.dataHora) = YEAR(CURDATE()) 
								AND MONTH(a.dataHora) = MONTH(CURDATE());
SELECT TIMESTAMPDIFF(MINUTE, MIN(cd.data), MAX(cd.data)) AS minutos_operacao,
								(SELECT COUNT(a.idAlerta) FROM alerta a 
								JOIN capturaDados cd2 ON a.fkCapturaDados = cd2.idCapturaDados
								JOIN componenteServidor cs2 ON cd2.fkComponenteServidor = cs2.idcomponenteServidor
								WHERE cs2.fkMaquina = 1
								AND c.tipo = 'CPU'
								AND YEAR(a.dataHora) = YEAR(CURDATE())
								AND MONTH(a.dataHora) = MONTH(CURDATE())) AS qtd_alertas
								FROM capturaDados cd
								JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
								JOIN componente c ON cs.fkComponente = c.idcomponente
								WHERE c.tipo = 'CPU'
								AND cs.fkMaquina = 1
								AND YEAR(cd.data) = YEAR(CURDATE())
								AND MONTH(cd.data) = MONTH(CURDATE());
SELECT CEIL(DAY(cd.data) / 7) AS semana_do_mes, ROUND(AVG(cd.valor), 2) AS media_utilizacao
								FROM capturaDados cd
								JOIN componenteServidor AS cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
								JOIN componente AS c ON cs.fkComponente = c.idcomponente
								JOIN servidor_maquina AS sm ON cs.fkMaquina = sm.idMaquina
								WHERE
								c.tipo = 'CPU'
								AND sm.idMaquina = 1
								AND YEAR(cd.data) = 2025
								AND MONTH(cd.data) = 5
								GROUP BY CEIL(DAY(cd.data) / 7)
								ORDER BY semana_do_mes;
select month(capturaDados.data) as mes,ROUND(AVG(capturaDados.valor),2) as media_utilizacao FROM capturaDados
								JOIN componenteServidor ON fkComponenteServidor = idComponenteServidor
								JOIN componente c ON fkComponente = idcomponente
								JOIN servidor_maquina ON idMaquina = fkMaquina
								WHERE c.tipo = 'CPU' 
								AND servidor_maquina.idMaquina = 1
								AND year(capturaDados.data) = 2025
								group by mes
								order by mes;
-- DASH PERIODO MODEL
select count(idAlerta) as quantidadeAlertas, week(dataHora) AS semana
								from alerta 
								join capturaDados as cap
								on alerta.fkCapturaDados=cap.idCapturaDados
								join componenteServidor as comp
								on cap.fkcomponenteServidor=comp.idcomponenteServidor
								join servidor_maquina as maq
								on  comp.fkMaquina=maq.idMaquina
								where fkFabrica = 1
								and year(dataHora) = 2025
								and month(dataHora) = 5
								group by semana
								order by semana asc;
select componente, count(idAlerta) as alerta, hour(dataHora) as hora,
								case when hour(dataHora)  > 5 and hour(dataHora) <12 then 'Manhã'
								when hour(dataHora)  > 11 and hour(dataHora) <18 then 'Tarde'
								when hour(dataHora)  > 18 and hour(dataHora) <24 then 'Noite'
								else 'Madrugada'
								end as periodo
								from alerta
								join capturaDados as cap
								on alerta.fkCapturaDados=cap.idCapturaDados
								join componenteServidor as comp
								on cap.fkcomponenteServidor=comp.idcomponenteServidor
								join servidor_maquina as maq
								on  comp.fkMaquina=maq.idMaquina
								where year(dataHora) = 2025
								and month(dataHora) = 5
								and fkFabrica = 1
								group by hora, componente, periodo
								order by componente desc limit 1;
SELECT  COUNT(idAlerta) as qtdalertas, 
		componente,
		CASE 
        WHEN HOUR(dataHora) >= 6 AND HOUR(dataHora) < 12 THEN 'Manhã'
        WHEN HOUR(dataHora) >= 12 AND HOUR(dataHora) < 18 THEN 'Tarde'
        WHEN HOUR(dataHora) >= 18 AND HOUR(dataHora) < 24 THEN 'Noite'
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
		AND MONTH(dataHora) = 5
		AND fkFabrica = 1
		GROUP BY componente, periodo
		ORDER BY periodo;
        
        
select count(idAlerta) as qtdalerta, 
								day(dataHora) as dia
								from alerta
								join capturaDados as cap
								on alerta.fkCapturaDados=cap.idCapturaDados
								join componenteServidor as comp
								on cap.fkcomponenteServidor=comp.idcomponenteServidor
								join servidor_maquina as maq
								on  comp.fkMaquina=maq.idMaquina
								where year(dataHora) = 2025
								and month(dataHora) = 5
								and fkFabrica = 1
								group by dia
								order by qtdalerta desc limit 1;
		
select date(dataHora) as data,processo,processoCPU,processoRAM,processoDISCO,
								case when time(dataHora) > 5 and hour(dataHora) < 12 then 'Manhã'
								when hour(dataHora) > 11 and hour(dataHora) < 18 then 'Tarde'
								when hour(dataHora) > 17 and hour(dataHora) < 24 then 'Noite'
								else 'Madrugada'
								end as periodo
								from alerta
								join capturaDados as cap
								on alerta.fkCapturaDados = cap.idCapturaDados
								join componenteServidor as comp
								on cap.fkcomponenteServidor = comp.idcomponenteServidor
								join servidor_maquina as maq
								on comp.fkMaquina = maq.idMaquina
								where 
								year(dataHora) = 2025
								and month(dataHora) = 5
								and fkFabrica = 1
								order by processoCPU desc
								limit 10;
                               
SELECT  COUNT(idAlerta) as qtdalertas, 
		componente,
		CASE 
        WHEN HOUR(dataHora) >= 6 AND HOUR(dataHora) < 12 THEN 'Manhã'
        WHEN HOUR(dataHora) >= 12 AND HOUR(dataHora) < 18 THEN 'Tarde'
        WHEN HOUR(dataHora) >= 18 AND HOUR(dataHora) < 24 THEN 'Noite'
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
		AND MONTH(dataHora) = 5
		AND fkFabrica = 1
        and idMaquina = 1
		GROUP BY componente, periodo
		ORDER BY periodo;

-- FABRICA MODEL
SELECT sm.fkFabrica, COUNT(a.idAlerta) AS quantidade_alertas FROM servidor_maquina sm
								LEFT JOIN componenteServidor cs ON cs.fkMaquina = sm.idMaquina
								LEFT JOIN capturaDados cd ON cd.fkComponenteServidor = cs.idcomponenteServidor
								LEFT JOIN alerta a ON a.fkCapturaDados = cd.idCapturaDados
								GROUP BY sm.fkFabrica;
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- #######################################################################################################################################################################################