GRANT ALL PRIVILEGES ON opticarFrio.* TO 'admin'@'%';
FLUSH PRIVILEGES;
use opticarFrio;

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
    telefone char(10),
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

