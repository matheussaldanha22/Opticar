use mydb;
select * from capturaMaq2;
select * from capturaMaq1 where idCapturaMaq1 = 1000;

select avg(cpu_percent) as "media Maq1" from capturaMaq1;
select avg(cpu_percent) as "media Maq2" from capturaMaq2;

create view ComparacaoMediaMaq as
 select (select avg(cpu_percent) as "media Maq1" from capturaMaq1) as "media CPU Maq1",
 (select avg(cpu_percent) as "media Maq2" from capturaMaq2) as "media CPU Maq2";
 select * from ComparacaoMediaMaq;
 
select avg(cpu_percent) as mediaCpuManha from capturaMaq1 where hour(data_hora) < 12;
select avg(cpu_percent) as mediaCpu from capturaMaq1 where hour(data_hora) >= 12;
  
select avg(cpu_percent) as mediaCpuManhafrom from capturaMaq2  where hour(data_hora) < 12;
select avg(cpu_percent) as mediaCpu from capturaMaq2 where hour(data_hora) >= 12;

create view comparacaoHorario as
	select (select avg(cpu_percent) as mediaCpuManha from capturaMaq1 where hour(data_hora) < 12) as "Média utilização CPU manhã Maq1",
    (select avg(cpu_percent) as mediaCpuManha from capturaMaq2  where hour(data_hora) < 12 ) as "Média utilização CPU manhã Maq2", 
    (select avg(cpu_percent) as mediaCpuManhafrom from capturaMaq2  where hour(data_hora) < 12) as "Média utilização CPU Tarde Maq1",
    (select avg(cpu_percent) as mediaCpu from capturaMaq2 where hour(data_hora) >= 12) as "Média utilização CPU Tarde Maq2";
    
select * from comparacaoHorario;

