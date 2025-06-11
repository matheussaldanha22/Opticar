
-- PARTE 1: Estrutura e dados iniciais do banco opticarFrio
drop database opticarFrio;
CREATE DATABASE IF NOT EXISTS opticarFrio;
USE opticarFrio;

select * from usuario;

SELECT 
            usuario.idusuario AS id,
            usuario.nome,
            usuario.email,
            usuario.cargo,
            empresa.idempresa AS empresaId,
            empresa.nome AS empresaNome,
            usuario.fkFabrica AS idFabrica,
            fabrica.nome AS nomeFabrica
          FROM 
            usuario
          LEFT JOIN 
            fabrica ON usuario.fkFabrica = fabrica.idfabrica
          LEFT JOIN 
            empresa ON (
              fabrica.fkEmpresa = empresa.idempresa
              OR empresa.fkGestorAdmin = usuario.idusuario
            )
          WHERE 
            usuario.email = 'felipe@opticar.com'
            AND usuario.senha = 'senha123';

-- Tabelas

CREATE TABLE usuario (
    idusuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    email VARCHAR(45),
    senha VARCHAR(45),
    cargo ENUM('GestorAdmin', 'GestorInfra', 'AnalistaDados', 'AnalistaSuporte'),
    cpf VARCHAR(45),
    fkFabrica INT
);

CREATE TABLE empresa (
    idempresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    cnpj CHAR(14),
    fkGestorAdmin INT UNIQUE,
    FOREIGN KEY (fkGestorAdmin) REFERENCES usuario(idusuario) ON DELETE CASCADE
);

CREATE TABLE fabrica (
    idfabrica INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) UNIQUE,
    funcao VARCHAR(100),
    telefone CHAR(10),
    limiteAtencao INT,
    limiteCritico INT,
    fkEmpresa INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idempresa) ON DELETE CASCADE
);

ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_fabrica FOREIGN KEY (fkFabrica) REFERENCES fabrica(idfabrica) ON DELETE CASCADE;

CREATE TABLE endereco (
    idendereco INT PRIMARY KEY AUTO_INCREMENT,
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
    idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    sistema_operacional VARCHAR(45),
    ip VARCHAR(45),
    fkFabrica INT,
    Mac_Address BIGINT UNIQUE,
    hostname VARCHAR(45),
    FOREIGN KEY (fkFabrica) REFERENCES fabrica(idfabrica) ON DELETE CASCADE
);

CREATE TABLE componente (
    idcomponente INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(45),
    medida VARCHAR(45),
    indicador VARCHAR(45),
    codigo VARCHAR(400)
);

CREATE TABLE componenteServidor (
    idcomponenteServidor INT PRIMARY KEY AUTO_INCREMENT,
    fkComponente INT,
    fkMaquina INT,
    modelo VARCHAR(45),
    limiteCritico VARCHAR(45),
    limiteAtencao VARCHAR(45),
    FOREIGN KEY (fkComponente) REFERENCES componente(idcomponente) ON DELETE CASCADE,
    FOREIGN KEY (fkMaquina) REFERENCES servidor_maquina(idMaquina) ON DELETE CASCADE
);

-- Inserts obrigatórios para componente (7 componentes)

INSERT INTO componente (tipo, medida, indicador, codigo) VALUES
('Cpu', 'Porcentagem', '%', 'round(psutil.cpu_percent(interval=1), 2)'),
('Cpu', 'Frêquencia', 'MHz', 'round(psutil.cpu_freq().current, 2)'),
('Ram', 'Porcentagem', '%', 'round(psutil.virtual_memory().percent, 2)'),
('Ram', 'Frequencia', 'MHz', 'round(psutil.virtual_memory().available / (1024 ** 3), 2)'),
('Disco', 'Porcentagem', '%', 'round(psutil.disk_usage("/").percent, 2)'),
('Rede', 'Recebida', 'MB', 'round(psutil.net_io_counters().bytes_recv / (1024 ** 2), 2)'),
('Rede', 'Enviada', 'MB', 'round(psutil.net_io_counters().bytes_sent / (1024 ** 2), 2)');

-- Usuário gestor e empresa

INSERT INTO usuario (nome, email, senha, cargo, cpf) VALUES 
('Carlos Silva', 'carlos@opticar.com', 'senha123', 'GestorInfra', '12345678901'),
('Átila Ferreira', 'atila@opticar.com', 'senha123', 'AnalistaSuporte', '98765432100'),
('Beatriz Lima', 'lima@opticar.com', 'senha123', 'AnalistaDados', '45678912322'),
('Robson Duarte', 'robson@opticar.com', 'senha123', 'GestorAdmin', '498528590800'),
('Roberto Carlos', 'roberto@opticar.com', 'senha123', 'GestorInfra', '12345678909'),
('Felipe Brandão', 'felipe@opticar.com', 'senha123', 'GestorInfra', '12345678907');

INSERT INTO empresa (nome, cnpj, fkGestorAdmin) VALUES
('MotorsCars', '12345678000100', 1);

-- Fábricas com diferentes limites para status

INSERT INTO fabrica (nome, funcao, telefone, limiteAtencao, limiteCritico, fkEmpresa) VALUES
('Fábrica Alpha', 'Montagem de chassis', '1199999999', 10, 15, 1),
('Fábrica Beta', 'Pintura de peças', '1198888888', 10, 15, 1),
('Fábrica Gama', 'Inspeção final', '1197777777', 10, 15, 1),
('Fábrica Delta', 'Logística', '1196666666', 10, 15, 1),
('Fábrica Épsilon', 'Soldagem', '1195555555', 10, 15, 1),
('Fábrica Zeta', 'Montagem Elétrica', '1194444444', 10, 15, 1);

-- Relacionar usuários às fábricas

UPDATE usuario SET fkFabrica = 1 WHERE idusuario = 1;
UPDATE usuario SET fkFabrica = 2 WHERE idusuario = 5;
UPDATE usuario SET fkFabrica = 3 WHERE idusuario = 6;
UPDATE usuario SET fkFabrica = 4 WHERE idusuario = 7;
UPDATE usuario SET fkFabrica = 5 WHERE idusuario = 8;
UPDATE usuario SET fkFabrica = 6 WHERE idusuario = 9;

-- Máquinas por fábrica

INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname) VALUES
('Ubuntu', '192.168.1.10', 1, 10101010101, 'alpha-srv01'),
('Ubuntu', '192.168.1.11', 2, 20202020202, 'beta-srv01'),
('Ubuntu', '192.168.1.12', 3, 30303030303, 'gama-srv01'),
('Ubuntu', '192.168.1.13', 4, 10101010102, 'omega-srv01'),
('Ubuntu', '192.168.1.14', 5, 20202020203, 'brito-srv01'),
('Ubuntu', '192.168.1.15', 6, 30303030304, 'ovelha-srv01');

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
(7, 6, 'Modelo REDE TX', '90', '75');
