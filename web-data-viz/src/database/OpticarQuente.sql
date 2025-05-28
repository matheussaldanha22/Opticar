drop database opticarQuente;
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
INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname) VALUES
('Linux', '192.168.1.10', 1, 123456789012345, 'server-norte'),
('Windows', '192.168.1.20', 2, 123456789012346, 'server-sul'),
('Linux', '192.168.1.30', 3, 123456789012347, 'server-leste');

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

-- 5 alertas para fkFabrica = 1
INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados)
VALUES 
(77.5, 'Alerta 1', 'Temperatura elevada', 'Crítica', 'Superaquecimento', 'RAM', 'To Do', 1),
(78.2, 'Alerta 2', 'Temperatura alta', 'Média', 'Monitoramento', 'RAM', 'In Progress', 1),
(79.9, 'Alerta 3', 'Risco de superaquecimento', 'Crítica', 'Emergência', 'RAM', 'Done', 1),
(80.1, 'Alerta 4', 'Temperatura no limite crítico', 'Crítica', 'Prevenção', 'RAM', 'To Do', 1),
(81.5, 'Alerta 5', 'Temperatura acima do limite', 'Média', 'Observação', 'RAM', 'In Progress', 1);

-- 11 alertas para fkFabrica = 2
INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados)
VALUES 
(115, 'Alerta 6', 'Pressão alta', 'Média', 'Monitoramento', 'DISCO', 'To Do', 2),
(117, 'Alerta 7', 'Pressão subindo', 'Crítica', 'Emergência', 'DISCO', 'In Progress', 2),
(118, 'Alerta 8', 'Pressão no limite', 'Média', 'Prevenção', 'DISCO', 'Done', 2),
(119, 'Alerta 9', 'Pressão crítica', 'Crítica', 'Supervisão', 'DISCO', 'To Do', 2),
(120, 'Alerta 10', 'Pressão extrema', 'Crítica', 'Falha iminente', 'DISCO', 'In Progress', 2),
(121, 'Alerta 11', 'Pressão instável', 'Média', 'Diagnóstico', 'DISCO', 'Done', 2),
(122, 'Alerta 12', 'Pressão oscilante', 'Crítica', 'Teste em andamento', 'DISCO', 'To Do', 2),
(123, 'Alerta 13', 'Pressão no pico', 'Crítica', 'Análise requerida', 'DISCO', 'In Progress', 2),
(124, 'Alerta 14', 'Pressão elevada contínua', 'Média', 'Precaução', 'DISCO', 'Done', 2),
(125, 'Alerta 15', 'Pressão perigosa', 'Crítica', 'Verificação urgente', 'DISCO', 'To Do', 2),
(126, 'Alerta 16', 'Pressão descontrolada', 'Crítica', 'Correção imediata', 'DISCO', 'In Progress', 2);

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


-- #######################################################################################################################################################################################
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- MODEL ADMIN
SELECT servidor.fkFabrica, COUNT(CASE WHEN alerta.statusAlerta = 'To Do' THEN 1 END) AS qtd_to_do,
								COUNT(CASE WHEN alerta.statusAlerta = 'In Progress' THEN 1 END) AS qtd_in_progress,
								COUNT(CASE WHEN alerta.statusAlerta = 'Done' THEN 1 END) AS qtd_done
								FROM servidor_maquina AS servidor
								LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
								LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
								LEFT JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados
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
select count(*) as total_alertas,
								case when hour(dataHora) > 5 and hour(dataHora) < 12 then 'Manhã'
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
								group by periodo
								order by total_alertas desc limit 1;
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
-- FABRICA MODEL
SELECT sm.fkFabrica, COUNT(a.idAlerta) AS quantidade_alertas FROM servidor_maquina sm
								LEFT JOIN componenteServidor cs ON cs.fkMaquina = sm.idMaquina
								LEFT JOIN capturaDados cd ON cd.fkComponenteServidor = cs.idcomponenteServidor
								LEFT JOIN alerta a ON a.fkCapturaDados = cd.idCapturaDados
								GROUP BY sm.fkFabrica;
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- #######################################################################################################################################################################################


SELECT servidor.fkFabrica, 
                      COUNT(CASE WHEN alerta.statusAlerta = 'To Do' THEN 1 END) AS qtd_to_do,
                      COUNT(CASE WHEN alerta.statusAlerta = 'In Progress' THEN 1 END) AS qtd_in_progress,
                      COUNT(CASE WHEN alerta.statusAlerta = 'Done' THEN 1 END) AS qtd_done
                      FROM servidor_maquina AS servidor
                      LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
                      LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
                      LEFT JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados WHERE fkFabrica = 1;

DELIMITER $$

CREATE TRIGGER insere_alerta
AFTER INSERT ON capturaDados
FOR EACH ROW
BEGIN
    DECLARE limCritico FLOAT;
    DECLARE limAtencao FLOAT;
    DECLARE nomeComponente VARCHAR(45);
    DECLARE tipoComponente VARCHAR(45);
    DECLARE prioridadeAlerta ENUM('Média', 'Crítica');
    DECLARE descricaoAlerta TEXT;

    -- Buscar os limites e o nome/tipo do componente relacionado
    SELECT 
        CAST(cs.limiteCritico AS DECIMAL(10,2)), 
        CAST(cs.limiteAtencao AS DECIMAL(10,2)),
        c.tipo,
        c.medida
    INTO 
        limCritico, 
        limAtencao, 
        nomeComponente, 
        tipoComponente
    FROM componenteServidor cs
    JOIN componente c ON cs.fkComponente = c.idcomponente
    WHERE cs.idcomponenteServidor = NEW.fkComponenteServidor;

    -- Verificar se o valor excede limites
    IF NEW.valor > limCritico THEN
        SET prioridadeAlerta = 'Crítica';
        SET descricaoAlerta = CONCAT('Valor crítico detectado: ', NEW.valor, ' ', tipoComponente);
        
        INSERT INTO alerta (
            dataHora, 
            valor, 
            titulo, 
            descricao, 
            prioridade, 
            tipo_incidente, 
            componente, 
            statusAlerta, 
            fkCapturaDados
        )
        VALUES (
            NOW(),
            NEW.valor,
            nomeComponente,
            descricaoAlerta,
            prioridadeAlerta,
            'Alerta Crítico',
            nomeComponente,
            'To Do',
            NEW.idCapturaDados
        );
        
    ELSEIF NEW.valor > limAtencao THEN
        SET prioridadeAlerta = 'Média';
        SET descricaoAlerta = CONCAT('Valor de atenção detectado: ', NEW.valor, ' ', tipoComponente);

        INSERT INTO alerta (
            dataHora, 
            valor, 
            titulo, 
            descricao, 
            prioridade, 
            tipo_incidente, 
            componente, 
            statusAlerta, 
            fkCapturaDados
        )
        VALUES (
            NOW(),
            NEW.valor,
            nomeComponente,
            descricaoAlerta,
            prioridadeAlerta,
            'Alerta de Atenção',
            nomeComponente,
            'To Do',
            NEW.idCapturaDados
        );
    END IF;
END$$

DELIMITER ;

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
    jira_issue_key VARCHAR(20) COMMENT 'Chave do ticket criado no JIRA (ex: PROJ-123)',
    FOREIGN KEY (fkCapturaDados) REFERENCES capturaDados(idCapturaDados) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO capturaDados (fkComponenteServidor, valor, data)
VALUES (1, 80, NOW());

INSERT INTO capturaDados (fkComponenteServidor, valor, data)
VALUES (1, 50, NOW());

INSERT INTO capturaDados (fkComponenteServidor, valor, data)
VALUES (1, 20, NOW());

SELECT * FROM alerta;

INSERT INTO capturaDados (fkComponenteServidor, valor, data)
VALUES (1, 85, NOW());