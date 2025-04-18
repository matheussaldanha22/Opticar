-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

DROP database opticar;
create database opticar;
use opticar;
-- Tabelas de Relacionamento do Cliente
CREATE TABLE empresa (
    idempresa INT PRIMARY KEY auto_increment,
    nome VARCHAR(45),
    cnpj CHAR(14)
);

CREATE TABLE fabrica (
    idfabrica INT PRIMARY KEY auto_increment,
    nome VARCHAR(45),
    funcao VARCHAR(45),
    fkEmpresa INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idempresa)
);

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
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idempresa),
    FOREIGN KEY (fkFabrica) REFERENCES fabrica(idfabrica)
);

CREATE TABLE usuario (
    idusuario INT PRIMARY KEY auto_increment,
    nome VARCHAR(45),
    email VARCHAR(45),
    senha VARCHAR(45),
    cargo ENUM('GestorEmpresa', 'GestorFabrica', 'AnalistaSuporte', 'EngenheiroManutenção'),
    cpf VARCHAR(45),
    fkFabrica INT,
    FOREIGN KEY (fkFabrica) REFERENCES fabrica(idfabrica)
);

-- Configuração dos Componentes

CREATE TABLE servidor_maquina (
    idMaquina INT PRIMARY KEY auto_increment,
    sistema_operacional VARCHAR(45),
    ip VARCHAR(45),
    fkFabrica INT,
    Mac_Address BIGINT unique,
    hostname VARCHAR(45),
    FOREIGN KEY (fkFabrica) REFERENCES fabrica(idfabrica)
);

CREATE TABLE componente (
    idcomponente INT PRIMARY KEY auto_increment,
    tipo VARCHAR(45),
    medida VARCHAR(45)
);

CREATE TABLE componenteServidor (
    idcomponenteServidor INT PRIMARY KEY auto_increment,
    fkComponente INT,
    fkMaquina INT,
    modelo VARCHAR(45),
    identificador VARCHAR(45),
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
    valor FLOAT,
    fkCapturaDados INT,
    FOREIGN KEY (fkCapturaDados) REFERENCES capturaDados(idCapturaDados)
);

-- Inserts relacionamento cliente

INSERT INTO empresa (idempresa, nome, cnpj) VALUES
(1, 'TechAgro S.A.', '12345678000199'),
(2, 'AgroData Ltda', '98765432000111');

INSERT INTO fabrica (idfabrica, nome, funcao, fkEmpresa) VALUES
(1, 'Fábrica Norte', 'Montagem de sensores', 1),
(2, 'Fábrica Sul', 'Montagem de placas', 1),
(3, 'Fábrica Centro', 'Montagem geral', 2);

INSERT INTO endereco (
  idendereco, logradouro, numLogradouro, cidade, bairro, uf, estado, cep, fkEmpresa, fkFabrica
) VALUES
(1, 'Av. das Nações', 1000, 'São Paulo', 'Centro', 'SP', 'São Paulo', '01001000', 1, NULL),
(2, 'Rua das Palmeiras', 200, 'Campinas', 'Jardim', 'SP', 'São Paulo', '13000000', NULL, 1),
(3, 'Av. Brasil', 1500, 'Rio de Janeiro', 'Copacabana', 'RJ', 'Rio de Janeiro', '22000000', 2, NULL),
(4, 'Rua das Indústrias', 400, 'Belo Horizonte', 'Industrial', 'MG', 'Minas Gerais', '31000000', NULL, 3);

INSERT INTO usuario (idusuario, nome, email, senha, cargo, cpf, fkFabrica) VALUES
(1, 'Ana Silva', 'ana@techagro.com', 'senha123', 'GestorEmpresa', '12345678900', 1),
(2, 'Carlos Souza', 'carlos@techagro.com', 'senha123', 'GestorFabrica', '98765432100', 1),
(3, 'Beatriz Lima', 'beatriz@agrodata.com', 'senha123', 'AnalistaSuporte', '11122233344', 3);

-- insert Configuração dos Componentes

insert into componente (tipo, medida) values
('cpu', 'porcentagem'),
('ram', 'porcentagem'),
('disco', 'porcentagem');

insert into componenteservidor (fkcomponente, fkmaquina, modelo, identificador, limitecritico, limiteatencao) values
(1, 1, 'intel core i7', 'cpu-001', '90', '75'),
(2, 1, 'corsair 16gb', 'ram-001', '90', '75'),
(3, 1, 'ssd kingston 480gb', 'disco-001', '95', '80');

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


