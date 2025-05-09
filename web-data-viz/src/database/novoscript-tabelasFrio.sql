drop database opticarfrio;
create database opticarFrio;
use opticarFrio;


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
    prioridade ENUM('Média', 'Crítica') DEFAULT 'Média' COMMENT 'Mapeia para Priority no JIRA',
    tipo_incidente VARCHAR(50) COMMENT 'Mapeia para Issue Type no JIRA',
    componente VARCHAR(50) COMMENT 'Para o campo Component no JIRA',
    statusAlerta ENUM('To Do', 'Done', 'In Progress') DEFAULT 'To Do' COMMENT 'Status do alerta',
    fkCapturaDados INT NOT NULL COMMENT 'Referência à tabela capturaDados',
    jira_issue_key VARCHAR(20) COMMENT 'Chave do ticket criado no JIRA (ex: PROJ-123)',
    FOREIGN KEY (fkCapturaDados) REFERENCES capturaDados(idCapturaDados) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname) VALUES
('Linux', '192.168.1.10', 1, 123456789012345, 'server-norte'),
('Windows', '192.168.1.20', 2, 123456789012346, 'server-sul'),
('Linux', '192.168.1.30', 3, 123456789012347, 'server-leste');

select * from servidor_maquina;

INSERT INTO componente (tipo, medida, indicador) VALUES
('Temperatura', '°C', 'Sensor A'),
('Pressão', 'bar', 'Sensor B'),
('Velocidade', 'rpm', 'Sensor C');

INSERT INTO componenteServidor (fkComponente, fkMaquina, modelo, limiteCritico, limiteAtencao) VALUES
(1, 1, 'Modelo A', '80', '50'),
(2, 2, 'Modelo B', '120', '80'),
(3, 3, 'Modelo C', '200', '150');

INSERT INTO capturaDados (fkComponenteServidor, valor, data) VALUES
(1, 75.0, NOW()),
(2, 110.0, NOW()),
(3, 180.0, NOW());

select * from capturaDados;

-- 5 alertas para fkFabrica = 1
INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados)
VALUES 
(77.5, 'Alerta 1', 'Temperatura elevada', 'Crítica', 'Superaquecimento', 'Sensor A', 'To Do', 1),
(78.2, 'Alerta 2', 'Temperatura alta', 'Média', 'Monitoramento', 'Sensor A', 'In Progress', 1),
(79.9, 'Alerta 3', 'Risco de superaquecimento', 'Crítica', 'Emergência', 'Sensor A', 'Done', 1),
(80.1, 'Alerta 4', 'Temperatura no limite crítico', 'Crítica', 'Prevenção', 'Sensor A', 'To Do', 1),
(81.5, 'Alerta 5', 'Temperatura acima do limite', 'Média', 'Observação', 'Sensor A', 'In Progress', 1);

-- 11 alertas para fkFabrica = 2
INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados)
VALUES 
(115, 'Alerta 6', 'Pressão alta', 'Média', 'Monitoramento', 'Sensor B', 'To Do', 2),
(117, 'Alerta 7', 'Pressão subindo', 'Crítica', 'Emergência', 'Sensor B', 'In Progress', 2),
(118, 'Alerta 8', 'Pressão no limite', 'Média', 'Prevenção', 'Sensor B', 'Done', 2),
(119, 'Alerta 9', 'Pressão crítica', 'Crítica', 'Supervisão', 'Sensor B', 'To Do', 2),
(120, 'Alerta 10', 'Pressão extrema', 'Crítica', 'Falha iminente', 'Sensor B', 'In Progress', 2),
(121, 'Alerta 11', 'Pressão instável', 'Média', 'Diagnóstico', 'Sensor B', 'Done', 2),
(122, 'Alerta 12', 'Pressão oscilante', 'Crítica', 'Teste em andamento', 'Sensor B', 'To Do', 2),
(123, 'Alerta 13', 'Pressão no pico', 'Crítica', 'Análise requerida', 'Sensor B', 'In Progress', 2),
(124, 'Alerta 14', 'Pressão elevada contínua', 'Média', 'Precaução', 'Sensor B', 'Done', 2),
(125, 'Alerta 15', 'Pressão perigosa', 'Crítica', 'Verificação urgente', 'Sensor B', 'To Do', 2),
(126, 'Alerta 16', 'Pressão descontrolada', 'Crítica', 'Correção imediata', 'Sensor B', 'In Progress', 2);

-- 20 alertas para fkFabrica = 3
INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados)
VALUES 
(170, 'Alerta 17', 'Velocidade elevada', 'Média', 'Monitoramento', 'Sensor C', 'To Do', 3),
(175, 'Alerta 18', 'Velocidade no limite', 'Crítica', 'Prevenção', 'Sensor C', 'In Progress', 3),
(178, 'Alerta 19', 'Velocidade perigosa', 'Crítica', 'Atenção', 'Sensor C', 'Done', 3),
(180, 'Alerta 20', 'Velocidade máxima atingida', 'Crítica', 'Falha iminente', 'Sensor C', 'To Do', 3),
(182, 'Alerta 21', 'Velocidade instável', 'Média', 'Revisão necessária', 'Sensor C', 'In Progress', 3),
(185, 'Alerta 22', 'Velocidade acima da média', 'Crítica', 'Diagnóstico solicitado', 'Sensor C', 'Done', 3),
(187, 'Alerta 23', 'Velocidade fora dos padrões', 'Crítica', 'Precaução urgente', 'Sensor C', 'To Do', 3),
(190, 'Alerta 24', 'Velocidade crítica contínua', 'Crítica', 'Falha operacional', 'Sensor C', 'In Progress', 3),
(193, 'Alerta 25', 'Velocidade variável crítica', 'Média', 'Teste solicitado', 'Sensor C', 'Done', 3),
(195, 'Alerta 26', 'Velocidade irregular', 'Crítica', 'Correção emergencial', 'Sensor C', 'To Do', 3),
(198, 'Alerta 27', 'Velocidade fora da margem', 'Média', 'Investigação', 'Sensor C', 'In Progress', 3),
(200, 'Alerta 28', 'Velocidade extrema', 'Crítica', 'Manutenção requerida', 'Sensor C', 'Done', 3);






DELIMITER $$

CREATE TRIGGER insere_alerta
AFTER INSERT ON capturaDados
FOR EACH ROW
BEGIN
  DECLARE limCritico FLOAT;
  DECLARE limAtencao FLOAT;

  -- Obtendo os valores limiteCritico e limiteAtencao do componenteServidor
  SELECT CAST(limiteCritico AS DECIMAL(10,2)), CAST(limiteAtencao AS DECIMAL(10,2))
  INTO limCritico, limAtencao
  FROM componenteServidor
  WHERE idcomponenteServidor = NEW.fkComponenteServidor;
  
  -- Verificando se o valor está acima do limite crítico ou de atenção e inserindo o alerta
  IF NEW.valor > limCritico THEN
    INSERT INTO alerta (dataHora, valor, fkCapturaDados, descricao)
    VALUES (NOW(), NEW.valor, NEW.idCapturaDados, 'Crítico');
    
  ELSEIF NEW.valor > limAtencao THEN
    INSERT INTO alerta (dataHora, valor, fkCapturaDados, descricao)
    VALUES (NOW(), NEW.valor, NEW.idCapturaDados, 'Atenção');
  END IF;
END$$

SELECT alerta.idAlerta, alerta.dataHora, alerta.valor, alerta.titulo, alerta.descricao, alerta.prioridade, alerta.statusAlerta,
servidor.hostname, servidor.ip, servidor.Mac_Address, servidor.idMaquina, componenteServidor.modelo, componente.tipo AS tipoComponente, componente.medida AS medidaComponente 
FROM alerta JOIN capturaDados AS captura ON alerta.fkCapturaDados = captura.idCapturaDados
JOIN componenteServidor ON captura.fkComponenteServidor = idcomponenteServidor
JOIN servidor_maquina AS servidor ON componenteServidor.fkMaquina = servidor.idMaquina
JOIN componente ON componenteServidor.fkComponente = idcomponente;

SELECT 
    sm.fkFabrica,
    COUNT(a.idAlerta) AS quantidade_alertas
FROM servidor_maquina sm
LEFT JOIN componenteServidor cs ON cs.fkMaquina = sm.idMaquina
LEFT JOIN capturaDados cd ON cd.fkComponenteServidor = cs.idcomponenteServidor
LEFT JOIN alerta a ON a.fkCapturaDados = cd.idCapturaDados
GROUP BY sm.fkFabrica;
