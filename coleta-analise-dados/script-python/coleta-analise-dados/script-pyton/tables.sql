CREATE DATABASE mydb;
use mydb;
select * from processos;
CREATE TABLE capturaMaq1(
	idCapturaMaq1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mac_address VARCHAR(45) NULL,
    cpu_percent DECIMAL(5,2),
    cpu_freq DECIMAL(6,2),
    ram_percent DECIMAL(5,2),
    ram_byte BIGINT,
	  disk_percent DECIMAL(5,2),
    disk_byte BIGINT,
    download DECIMAL(5,2),
    upload DECIMAL(5,2),
);

CREATE TABLE processos(
    idProcesso INT PRIMARY KEY AUTO_INCREMENT,
    pid INT,
    nomeProcessos VARCHAR(45),
    fkcapturaMaq1 INT,
    constraint FOREIGN KEY (fkcapturaMaq1) REFERENCES capturaMaq1 (idCapturaMaq1)
);


INSERT INTO(pid, nomeProcessos,nomeProcessos, fkCapturaMaq1) VALUES()
ALTER TABLE capturaMaq1 
ADD COLUMN hostName VARCHAR(45);

ALTER TABLE capturaMaq1
ADD COLUMN data_hora DATETIME DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE capturaMaq2(
	idCapturaMaq1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mac_address VARCHAR(45) NULL,
    cpu_percent DECIMAL(5,2),
    cpu_freq DECIMAL(6,2),
    ram_percent DECIMAL(5,2),
    ram_byte BIGINT,
	  disk_percent DECIMAL(5,2),
    disk_byte BIGINT,
    download DECIMAL(5,2),
    upload DECIMAL(5,2)
);


select * from capturaMaq2;
select * from capturaMaq1;