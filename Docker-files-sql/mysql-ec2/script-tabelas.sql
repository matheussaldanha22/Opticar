-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;

use opticar;

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
    nome VARCHAR(45),
    funcao VARCHAR(45),
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
    FOREIGN KEY (fkFabrica) REFERENCES fabrica(idfabrica) ON DELETE CASCADE
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
    FOREIGN KEY (fkComponente) REFERENCES componente(idcomponente) ON DELETE CASCADE, 
    FOREIGN KEY (fkMaquina) REFERENCES servidor_maquina(idMaquina) ON DELETE CASCADE 
);

-- Inserts relacionamento cliente

INSERT INTO usuario (idusuario, nome, email, senha, cargo, cpf, fkFabrica) VALUES
(1, 'Ana Silva', 'ana@techagro.com', '123', 'GestorEmpresa', '12345678900', NULL), -- gestora da empresa 1
(5, 'Vitor Almeida', 'vitor@teste.com', '123', 'GestorEmpresa', '12222233344', NULL); -- gestora da empresa 3

INSERT INTO empresa (idempresa, nome, cnpj, fkGestorEmpresa) VALUES
(1, 'TechAgro S.A.', '12345678000199', 1),
(2, 'AgroData Ltda', '98765432000111', NULL), -- Ainda sem gestor
(3, 'TechVitor Ltda', '22765432102111', 5);

INSERT INTO fabrica (idfabrica, nome, funcao, fkEmpresa) VALUES
(1, 'Fábrica Norte', 'Montagem de sensores', 1),
(2, 'Fábrica Sul', 'Montagem de placas', 1),
(3, 'Fábrica Centro', 'Montagem geral', 2),
(4, 'Fábrica Oeste', 'Montagem Carros', 3);

INSERT INTO usuario (idusuario, nome, email, senha, cargo, cpf, fkFabrica) VALUES
(2, 'Carlos Souza', 'carlos@techagro.com', '123', 'GestorFabrica', '98765432100', 1), -- gestor da Fábrica 1
(3, 'Beatriz Lima', 'beatriz@agrodata.com', '123', 'AnalistaDados', '11122233344', 3),
(4, 'Mario Almeida', 'mario@teste.com', '123', 'GestorFabrica', '12222233322', 3); -- gestor da Fábrica 3


INSERT INTO endereco (
  idendereco, logradouro, numLogradouro, cidade, bairro, uf, estado, cep, fkEmpresa, fkFabrica
) VALUES
(1, 'Av. das Nações', 1000, 'São Paulo', 'Centro', 'SP', 'São Paulo', '01001000', 1, NULL),
(2, 'Rua das Palmeiras', 200, 'Campinas', 'Jardim', 'SP', 'São Paulo', '13000000', NULL, 1),
(3, 'Av. Brasil', 1500, 'Rio de Janeiro', 'Copacabana', 'RJ', 'Rio de Janeiro', '22000000', 2, NULL),
(4, 'Rua das Indústrias', 400, 'Belo Horizonte', 'Industrial', 'MG', 'Minas Gerais', '31000000', NULL, 3);

-- insert Configuração dos Componentes

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

insert into servidor_maquina values
(1,	'Windows', '192.168.56.1', 1, 251776438657434, 'DESKTOP-KHH0UBD');

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

