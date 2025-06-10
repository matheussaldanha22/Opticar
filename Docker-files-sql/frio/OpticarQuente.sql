GRANT ALL PRIVILEGES ON opticarQuente.* TO 'admin'@'%';
FLUSH PRIVILEGES;

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








