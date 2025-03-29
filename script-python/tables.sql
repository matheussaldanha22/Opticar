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
    upload DECIMAL(5,2)
);