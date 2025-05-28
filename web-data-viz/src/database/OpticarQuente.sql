
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

drop table alerta;

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
                                
SELECT  COUNT(idAlerta) as quantidade_alertas, 
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

SELECT 
    COUNT(idAlerta) as quantidade_alertas,
    componente,
    CASE 
        WHEN HOUR(dataHora) >= 6 AND HOUR(dataHora) < 12 THEN 'Manhã'
        WHEN HOUR(dataHora) >= 12 AND HOUR(dataHora) < 18 THEN 'Tarde'
        WHEN HOUR(dataHora) >= 18 AND HOUR(dataHora) < 24 THEN 'Noite'
        ELSE 'Madrugada'
    END as periodo
FROM alerta
JOIN capturaDados as cap ON alerta.fkCapturaDados = cap.idCapturaDados
JOIN componenteServidor as comp ON cap.fkcomponenteServidor = comp.idcomponenteServidor
JOIN servidor_maquina as maq ON comp.fkMaquina = maq.idMaquina
WHERE YEAR(dataHora) = 2025
    AND MONTH(dataHora) = 5
    AND fkFabrica = 1
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


-- insert maio alerta

INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados, dataHora)
VALUES
-- Semana 1 (1-7 de maio)
-- CPU
(75.2, 'Uso elevado de CPU', 'CPU atingiu 75% de utilização', 'Média', 'Performance', 'CPU', 'To Do', 1, '2025-05-01 09:15:00'),
(82.5, 'Pico de CPU', 'Processo consumindo 45% da CPU', 'Alta', 'Processo', 'CPU', 'In Progress', 1, '2025-05-03 14:30:00'),
-- RAM
(85.7, 'Alto uso de memória', 'RAM em 85% de utilização', 'Alta', 'Consumo', 'RAM', 'Done', 1, '2025-05-02 11:20:00'),
(90.3, 'RAM crítica', 'Apenas 10% de memória livre', 'Crítica', 'Falta de Memória', 'RAM', 'To Do', 1, '2025-05-04 16:45:00'),
-- Disco
(88.4, 'Disco quase cheio', '85% do espaço utilizado', 'Alta', 'Armazenamento', 'Disco', 'In Progress', 1, '2025-05-05 10:10:00'),
(92.1, 'Disco crítico', 'Apenas 8% livre', 'Crítica', 'Espaço', 'Disco', 'Done', 1, '2025-05-07 13:25:00'),
-- Rede
(78.6, 'Latência alta', 'Ping médio de 120ms', 'Média', 'Conexão', 'Rede', 'To Do', 1, '2025-05-06 08:40:00'),
(83.2, 'Alto uso de banda', '83% da banda utilizada', 'Alta', 'Tráfego', 'Rede', 'In Progress', 1, '2025-05-07 17:15:00'),

-- Semana 2 (8-14 de maio)
-- CPU
(79.8, 'CPU em alerta', 'Uso sustentado em 80%', 'Alta', 'Performance', 'CPU', 'Done', 1, '2025-05-08 10:30:00'),
(84.3, 'Superaquecimento', 'Temperatura da CPU em 84°C', 'Crítica', 'Temperatura', 'CPU', 'To Do', 1, '2025-05-10 15:20:00'),
-- RAM
(87.5, 'Vazamento de memória', 'Aumento progressivo', 'Alta', 'Vazamento', 'RAM', 'In Progress', 1, '2025-05-09 12:45:00'),
(91.8, 'RAM esgotando', 'Apenas 8% livre', 'Crítica', 'Falta de Memória', 'RAM', 'Done', 1, '2025-05-12 09:10:00'),
-- Disco
(89.7, 'Disco lento', 'Tempo de resposta alto', 'Alta', 'Performance', 'Disco', 'To Do', 1, '2025-05-11 14:35:00'),
(93.5, 'Espaço crítico', 'Apenas 6% livre', 'Crítica', 'Armazenamento', 'Disco', 'In Progress', 1, '2025-05-14 11:50:00'),
-- Rede
(76.4, 'Pacotes perdidos', '3% de perda', 'Média', 'Estabilidade', 'Rede', 'Done', 1, '2025-05-13 08:05:00'),
(85.0, 'Congestionamento', '85% da banda em uso', 'Alta', 'Tráfego', 'Rede', 'To Do', 1, '2025-05-14 16:30:00'),

-- Semana 3 (15-21 de maio)
-- CPU
(81.6, 'CPU sobrecarregada', 'Uso acima de 80%', 'Alta', 'Performance', 'CPU', 'In Progress', 1, '2025-05-15 09:25:00'),
(77.3, 'CPU em observação', 'Picos frequentes', 'Média', 'Monitoramento', 'CPU', 'Done', 1, '2025-05-18 13:40:00'),
-- RAM
(88.9, 'RAM em alerta', 'Uso em 89%', 'Alta', 'Consumo', 'RAM', 'To Do', 1, '2025-05-16 10:55:00'),
(92.5, 'RAM crítica', 'Apenas 7% livre', 'Crítica', 'Falta de Memória', 'RAM', 'In Progress', 1, '2025-05-19 15:10:00'),
-- Disco
(90.2, 'Disco quase cheio', '90% utilizado', 'Alta', 'Armazenamento', 'Disco', 'Done', 1, '2025-05-17 11:25:00'),
(94.8, 'Disco crítico', 'Apenas 5% livre', 'Crítica', 'Espaço', 'Disco', 'To Do', 1, '2025-05-20 14:40:00'),
-- Rede
(79.1, 'Rede instável', 'Flutuações na conexão', 'Média', 'Estabilidade', 'Rede', 'In Progress', 1, '2025-05-21 08:55:00'),
(86.7, 'Alto tráfego', '87% da banda utilizada', 'Alta', 'Tráfego', 'Rede', 'Done', 1, '2025-05-21 17:20:00'),

-- Semana 4 (22-31 de maio)
-- CPU
(83.9, 'CPU em risco', 'Uso em 84%', 'Alta', 'Performance', 'CPU', 'To Do', 1, '2025-05-22 10:05:00'),
(78.4, 'Temperatura elevada', 'CPU em 78°C', 'Média', 'Temperatura', 'CPU', 'In Progress', 1, '2025-05-25 14:20:00'),
-- RAM
(86.3, 'Uso alto de RAM', '86% de utilização', 'Alta', 'Consumo', 'RAM', 'Done', 1, '2025-05-23 11:35:00'),
(93.1, 'RAM crítica', 'Apenas 7% livre', 'Crítica', 'Falta de Memória', 'RAM', 'To Do', 1, '2025-05-27 09:50:00'),
-- Disco
(91.5, 'Disco em alerta', '91% utilizado', 'Alta', 'Armazenamento', 'Disco', 'In Progress', 1, '2025-05-24 15:05:00'),
(95.2, 'Espaço esgotando', 'Apenas 5% livre', 'Crítica', 'Espaço', 'Disco', 'Done', 1, '2025-05-28 12:20:00'),
-- Rede
(77.8, 'Problemas de latência', 'Ping alto', 'Média', 'Conexão', 'Rede', 'To Do', 1, '2025-05-26 08:35:00'),
(88.4, 'Pico de tráfego', '88% da banda em uso', 'Alta', 'Tráfego', 'Rede', 'In Progress', 1, '2025-05-29 16:50:00'),
-- Final do mês
(80.2, 'CPU em alerta final', 'Uso em 80%', 'Alta', 'Performance', 'CPU', 'Done', 1, '2025-05-30 09:15:00'),
(89.7, 'RAM alta final', '90% de uso', 'Alta', 'Consumo', 'RAM', 'To Do', 1, '2025-05-31 13:30:00');

INSERT INTO alerta (valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados, dataHora)
VALUES
-- Semana 1 (1-7 de maio)
-- Manhã (06:00-11:59)
(72.3, 'CPU Matinal', 'Uso elevado no início do dia', 'Média', 'Performance', 'CPU', 'To Do', 1, '2025-05-01 08:30:00'),
(84.1, 'RAM Manhã', 'Pico de memória após login', 'Alta', 'Consumo', 'RAM', 'In Progress', 1, '2025-05-02 10:15:00'),
-- Tarde (12:00-17:59)
(88.5, 'Disco Tarde', 'IOPS alto no horário de pico', 'Alta', 'Performance', 'Disco', 'Done', 1, '2025-05-03 14:20:00'),
(76.2, 'Rede Tarde', 'Latência aumentando', 'Média', 'Conexão', 'Rede', 'To Do', 1, '2025-05-04 15:45:00'),
-- Noite (18:00-23:59)
(91.8, 'CPU Noite', 'Processos noturnos consumindo', 'Crítica', 'Processo', 'CPU', 'In Progress', 1, '2025-05-05 20:30:00'),
(83.4, 'Disco Noite', 'Backup noturno iniciado', 'Alta', 'Armazenamento', 'Disco', 'Done', 1, '2025-05-06 22:15:00'),
-- Madrugada (00:00-05:59)
(68.7, 'RAM Madrugada', 'Uso baixo mas com vazamento', 'Média', 'Vazamento', 'RAM', 'To Do', 1, '2025-05-07 03:10:00'),

-- Semana 2 (8-14 de maio)
-- Manhã
(79.2, 'CPU Manhã', 'Serviços iniciando', 'Média', 'Inicialização', 'CPU', 'In Progress', 1, '2025-05-08 09:20:00'),
(87.9, 'Disco Manhã', 'Sincronização de arquivos', 'Alta', 'IO', 'Disco', 'Done', 1, '2025-05-09 11:05:00'),
-- Tarde
(94.3, 'RAM Tarde', 'Aplicações pesadas ativas', 'Crítica', 'Alocação', 'RAM', 'To Do', 1, '2025-05-10 13:50:00'),
(81.6, 'Rede Tarde', 'Downloads pesados', 'Alta', 'Tráfego', 'Rede', 'In Progress', 1, '2025-05-11 16:25:00'),
-- Noite
(85.7, 'CPU Noite', 'Processamento em lote', 'Alta', 'Batch', 'CPU', 'Done', 1, '2025-05-12 19:40:00'),
(90.2, 'Disco Noite', 'Compactação de logs', 'Alta', 'Manutenção', 'Disco', 'To Do', 1, '2025-05-13 21:30:00'),
-- Madrugada
(73.5, 'Rede Madrugada', 'Atualizações automáticas', 'Média', 'Atualização', 'Rede', 'In Progress', 1, '2025-05-14 02:15:00'),

-- Semana 3 (15-21 de maio)
-- Manhã
(82.4, 'RAM Manhã', 'Vazamento no serviço X', 'Alta', 'Vazamento', 'RAM', 'Done', 1, '2025-05-15 07:45:00'),
(77.8, 'CPU Manhã', 'Uso crescente', 'Média', 'Trend', 'CPU', 'To Do', 1, '2025-05-16 10:30:00'),
-- Tarde
(93.7, 'Disco Tarde', 'Pico de escrita', 'Crítica', 'IO', 'Disco', 'In Progress', 1, '2025-05-17 14:15:00'),
(79.3, 'Rede Tarde', 'Conferência remota', 'Alta', 'Videoconf', 'Rede', 'Done', 1, '2025-05-18 17:00:00'),
-- Noite
(89.1, 'CPU Noite', 'Análise noturna', 'Alta', 'Processamento', 'CPU', 'To Do', 1, '2025-05-19 20:45:00'),
(84.6, 'RAM Noite', 'Cache acumulado', 'Alta', 'Cache', 'RAM', 'In Progress', 1, '2025-05-20 23:30:00'),
-- Madrugada
(71.2, 'Disco Madrugada', 'Limpeza temporária', 'Média', 'Manutenção', 'Disco', 'Done', 1, '2025-05-21 04:20:00'),

-- Semana 4 (22-31 de maio)
-- Manhã
(86.3, 'Rede Manhã', 'Sincronização cloud', 'Alta', 'Cloud', 'Rede', 'To Do', 1, '2025-05-22 08:10:00'),
(80.5, 'CPU Manhã', 'Processos agendados', 'Alta', 'Agendado', 'CPU', 'In Progress', 1, '2025-05-23 11:55:00'),
-- Tarde
(95.1, 'Disco Tarde', 'Espaço crítico', 'Crítica', 'Armazenamento', 'Disco', 'Done', 1, '2025-05-24 13:40:00'),
(78.9, 'RAM Tarde', 'Fragmentação', 'Média', 'Fragmentação', 'RAM', 'To Do', 1, '2025-05-25 16:25:00'),
-- Noite
(92.4, 'CPU Noite', 'Relatórios noturnos', 'Crítica', 'Report', 'CPU', 'In Progress', 1, '2025-05-26 19:10:00'),
(83.7, 'Rede Noite', 'Backup remoto', 'Alta', 'Backup', 'Rede', 'Done', 1, '2025-05-27 22:45:00'),
-- Madrugada
(69.8, 'Disco Madrugada', 'Desfragmentação', 'Média', 'Manutenção', 'Disco', 'To Do', 1, '2025-05-28 01:30:00'),
(87.5, 'RAM Madrugada', 'Pré-carregamento', 'Alta', 'Otimização', 'RAM', 'In Progress', 1, '2025-05-29 04:15:00'),
-- Final do mês
(81.9, 'CPU Final', 'Últimos processos', 'Alta', 'Fechamento', 'CPU', 'Done', 1, '2025-05-30 09:00:00'),
(89.2, 'Disco Final', 'Relatório mensal', 'Alta', 'Report', 'Disco', 'To Do', 1, '2025-05-31 12:00:00');