DROP database opticar;
CREATE database opticar;
use opticar;

select * from servidor_maquina;
select * from usuario;

CREATE TABLE usuario (
    idusuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    email VARCHAR(45),
    senha VARCHAR(45),
    cargo ENUM('GestorEmpresa', 'GestorFabrica', 'AnalistaDados', 'EngenheiroManutencao'),
    cpf VARCHAR(45),
    fkFabrica INT  -- pode ser nulo inicialmente
);

CREATE TABLE empresa (
    idempresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    cnpj CHAR(14),
    fkGestorEmpresa INT UNIQUE,
	FOREIGN KEY (fkGestorEmpresa) REFERENCES usuario(idusuario) ON DELETE CASCADE
);

CREATE TABLE fabrica (
    idfabrica INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) unique,
    funcao varchar(100),
    limiteAtencao INT,
    limiteCritico INT,
    fkEmpresa INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idempresa) ON DELETE CASCADE
);

ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_fabrica FOREIGN KEY (fkFabrica) REFERENCES fabrica(idfabrica) ON DELETE CASCADE;

CREATE TABLE endereco (
    idendereco INT PRIMARY KEY auto_increment,
    logradouro VARCHAR(45),
    numLogradouro INT,
    cidade VARCHAR(45),
    bairro VARCHAR(45),
    uf CHAR(2),
    estado VARCHAR(45),
    cep CHAR(8),
    fkEmpresa INT,
    fkFabrica INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idempresa) ON DELETE CASCADE,
    FOREIGN KEY (fkFabrica) REFERENCES fabrica(idfabrica) ON DELETE CASCADE
);


CREATE TABLE servidor_maquina (
    idMaquina INT PRIMARY KEY auto_increment,
    sistema_operacional VARCHAR(45),
    ip VARCHAR(45),
    fkFabrica INT,
    Mac_Address BIGINT unique,
    hostname VARCHAR(45),
    limiteA INT,
    limiteG INT,
    FOREIGN KEY (fkFabrica) REFERENCES fabrica(idfabrica) ON DELETE CASCADE
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

INSERT INTO usuario (nome, email, senha, cargo, cpf)
VALUES 
    ('Carlos Silva', 'carlos@opticar.com', 'senha123', 'GestorFabrica', '12345678901'),
    ('Ana Souza', 'ana@opticar.com', 'senha123', 'GestorFabrica', '98765432100'),
    ('Mariana Oliveira', 'mariana@opticar.com', 'senha123', 'GestorFabrica', '45678912322');

-- Inserindo 3 empresas (associadas a gestores, se necessário)
INSERT INTO empresa (nome, cnpj)
VALUES 
    ('OptiCar Soluções', '12345678000199'),
    ('AutoTech Brasil', '98765432000188'),
    ('SmartEng Mecânica', '45678912000177');

-- Inserindo 3 fábricas associadas às empresas
INSERT INTO fabrica (nome, funcao, limiteAtencao, limiteCritico, fkEmpresa)
VALUES 
    ('Fábrica Norte', 'Produção de peças automotivas', 50, 100, 1),
    ('Fábrica Sul', 'Montagem de motores', 40, 90, 2),
    ('Fábrica Leste', 'Testes e validação', 30, 80, 3);

-- Atualizando os gestores para associá-los às fábricas
UPDATE usuario SET fkFabrica = 1 WHERE idusuario = 1;
UPDATE usuario SET fkFabrica = 2 WHERE idusuario = 2;
UPDATE usuario SET fkFabrica = 3 WHERE idusuario = 3;

INSERT INTO endereco (
  idendereco, logradouro, numLogradouro, cidade, bairro, uf, estado, cep, fkEmpresa, fkFabrica
) VALUES
(1, 'Av. das Nações', 1000, 'São Paulo', 'Centro', 'SP', 'São Paulo', '01001000', 1, NULL),
(2, 'Rua das Palmeiras', 200, 'Campinas', 'Jardim', 'SP', 'São Paulo', '13000000', NULL, 1),
(3, 'Av. Brasil', 1500, 'Rio de Janeiro', 'Copacabana', 'RJ', 'Rio de Janeiro', '22000000', 2, NULL),
(4, 'Rua das Indústrias', 400, 'Belo Horizonte', 'Industrial', 'MG', 'Minas Gerais', '31000000', NULL, 3);

-- insert Configuração dos Componentes

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

select * from usuario;

select * from componenteservidor;

select * from servidor_Maquina;

SELECT * FROM componenteServidor JOIN servidor_maquina ON componenteServidor.fkMaquina = servidor_maquina.idMaquina
				JOIN componente ON componenteServidor.fkComponente = componente.idComponente
                WHERE servidor_maquina.Mac_Address = 251776438657434;
                
select * from capturaDados;

SELECT * FROM servidor_maquina WHERE Mac_Address = 251776438657434;

SELECT * FROM componenteServidor WHERE fkMaquina = (SELECT idMaquina FROM servidor_maquina WHERE Mac_Address = 251776438657434);

SELECT * FROM componenteServidor JOIN servidor_maquina ON componenteServidor.fkMaquina = servidor_maquina.idMaquina
				JOIN componente ON componenteServidor.fkComponente = componente.idComponente
                WHERE servidor_maquina.Mac_Address = 251776438657434;
                
SELECT f.idfabrica AS idFabrica, f.nome AS nomeFabrica, f.limiteAtencao, f.limiteCritico, u.nome AS nomeGestorFabrica  FROM fabrica AS f 
LEFT JOIN usuario AS u ON u.fkFabrica = f.idfabrica AND u.cargo = 'GestorFabrica';

select * from fabrica where idFabrica = 1;
