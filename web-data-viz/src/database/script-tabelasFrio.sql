create database opticarFrio;
use opticarFrio;

CREATE TABLE servidor_maquina (
    idMaquina INT PRIMARY KEY auto_increment,
    sistema_operacional VARCHAR(45),
    ip VARCHAR(45),
    fkFabrica INT,
    Mac_Address BIGINT unique,
    hostname VARCHAR(45)
);

CREATE TABLE componente (
    idcomponente INT PRIMARY KEY auto_increment,
    tipo VARCHAR(45),
    medida VARCHAR(45),
    indicador VARCHAR(45)
);

CREATE TABLE componenteServidor (
    idcomponenteServidor INT PRIMARY KEY auto_increment,
    fkComponente INT,
    fkMaquina INT,
    modelo VARCHAR(45),
    limiteCritico VARCHAR(45),
    limiteAtencao VARCHAR(45),
    FOREIGN KEY (fkComponente) REFERENCES componente(idcomponente),
    FOREIGN KEY (fkMaquina) REFERENCES servidor_maquina(idMaquina)
);

-- Configuração Alerta

CREATE TABLE capturaDados (
    idCapturaDados INT PRIMARY KEY auto_increment,
    fkComponenteServidor INT,
    valor FLOAT,
    data DATETIME,
    FOREIGN KEY (fkComponenteServidor) REFERENCES componenteServidor(idcomponenteServidor)
);
                        
CREATE TABLE alerta (
    idAlerta INT PRIMARY KEY auto_increment,
    dataHora DATETIME,
    descricao varchar(100),
    valor FLOAT,
    fkCapturaDados INT,
    FOREIGN KEY (fkCapturaDados) REFERENCES capturaDados(idCapturaDados)
);

INSERT INTO componente (tipo, medida, indicador) VALUES
('Cpu', 'Porcentagem', '%'),
('Cpu', 'Frêquencia', 'MHz'),
('Cpu', 'Temperatura', '°C'),
('Ram', 'Porcentagem', '%'),
('Ram', 'Usada', 'GB'),
('Ram', 'Total', 'GB'),
('Disco', 'Usado', 'GB'),
('Disco', 'Porcentagem', '%'),
('Rede', 'Recebida', 'MB'),
('Rede', 'Enviada', 'MB'),
('Rede', 'Upload', 'MB'),
('Rede', 'Download', 'MB'),
('Rede', 'Rede Envio', '%'),
('Sistema', 'Tempo Ligado', 'Tempo'),
('Sistema', 'Qtd Processos Ativos', 'Qtd'),
('Sistema', 'Top Processos CPU Média', '%');

insert into componenteservidor values
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

DELIMITER;