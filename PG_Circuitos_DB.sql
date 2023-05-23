/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     26/03/2023 10:48:47                          */
/*==============================================================*/


drop index CIRCUITOS_PK;

drop table circuitos;

drop index CIRCUITOS_RESERVAS_FK;

drop index RESERVAS_PK;

drop table reservas;

drop index USUARIOs_PK;

drop table usuarios;

drop index USUARIOS_RESERVAS_FK;

drop index USUARIOS_RESERVAS2_FK;

drop index USUARIOS_RESERVAS_PK;

drop table usuarios_reservas;

drop index USUARIOS_VEHICULOS2_FK;

drop index USUARIOS_VEHICULOS_FK;

drop index USUARIOS_VEHICULOS_PK;

drop table usuarios_vehiculos;

drop index VEHICULOS_PK;

drop table vehiculos;

drop index VEHICULOS_RESERVAS_FK;

drop index VEHICULOS_RESERVAS2_FK;

drop index VEHICULOS_RESERVAS_PK;

drop table vehiculos_reservas;

/*==============================================================*/
/* Table: CIRCUITO                                              */
/*==============================================================*/
create table circuitos (
   ID_CIRCUITO          INT4                 not null,
   NOMBRE               VARCHAR(100)         not null,
   UBICACION            VARCHAR(5)           not null,
   constraint PK_CIRCUITOS primary key (ID_CIRCUITO)
);

/*==============================================================*/
/* Index: CIRCUITO_PK                                           */
/*==============================================================*/
create unique index CIRCUITOS_PK on circuitos (
ID_CIRCUITO
);

/*==============================================================*/
/* Table: RESERVA                                               */
/*==============================================================*/
create table reservas (
   ID_RESERVA           INT4                 not null,
   ID_CIRCUITO          INT4                 not null,
   FECHA                DATE                 not null,
   HORA_INICIO                 TIME                 not null,
   HORA_FIN                 TIME                 not null,
   TITULO               VARCHAR(100)         not null,
   constraint PK_RESERVAS primary key (ID_RESERVA)
);

/*==============================================================*/
/* Index: RESERVA_PK                                            */
/*==============================================================*/
create unique index RESERVAS_PK on reservas (
ID_RESERVA
);

/*==============================================================*/
/* Index: CIRCUITO_RESERVA_FK                                   */
/*==============================================================*/
create  index CIRCUITOS_RESERVAS_FK on reservas (
ID_CIRCUITO
);

/*==============================================================*/
/* Table: USUARIO                                               */
/*==============================================================*/
create table usuarios (
   USER_ID                 VARCHAR(100)         not null,
   ROL                  VARCHAR(50)          not null,
   constraint PK_USUARIOS primary key (USER_ID)
);

/*==============================================================*/
/* Index: USUARIO_PK                                            */
/*==============================================================*/
create unique index USUARIOS_PK on usuarios (
USER_ID
);

/*==============================================================*/
/* Table: USUARIO_CIRCUITO                                      */
/*==============================================================*/

create table usuarios_circuitos (
   ID_CIRCUITO          INT4                 not null,
   USER_ID           VARCHAR(100)         not null,
   constraint PK_USUARIO_CIRCUITO primary key (ID_CIRCUITO, USER_ID)
);

/*==============================================================*/
/* Index: USUARIO_CIRCUITO_PK                                   */
/*==============================================================*/
create unique index USUARIOS_CIRCUITOS_PK on usuarios_circuitos (
ID_CIRCUITO,
USER_ID
);

/*==============================================================*/
/* Index: USUARIO_CIRCUITO_FK                                   */
/*==============================================================*/
create  index USUARIOS_CIRCUITOS_FK on usuarios_circuitos (
ID_CIRCUITO
);

/*==============================================================*/
/* Index: USUARIO_CIRCUITO2_FK                                  */
/*==============================================================*/
create  index USUARIOS_CIRCUITOS2_FK on usuarios_circuitos (
USER_ID
);
/*==============================================================*/
/* Table: USUARIO_RESERVA                                       */
/*==============================================================*/
create table usuarios_reservas (
   ID_RESERVA           INT4                 not null,
   USER_ID                 VARCHAR(100)         not null,
   constraint PK_USUARIOS_RESERVAS primary key (ID_RESERVA, USER_ID)
);

/*==============================================================*/
/* Index: USUARIO_RESERVA_PK                                    */
/*==============================================================*/
create unique index USUARIOS_RESERVAS_PK on usuarios_reservas (
ID_RESERVA,
USER_ID
);

/*==============================================================*/
/* Index: USUARIO_RESERVA2_FK                                   */
/*==============================================================*/
create  index USUARIOS_RESERVAS2_FK on usuarios_reservas (
USER_ID
);

/*==============================================================*/
/* Index: USUARIO_RESERVA_FK                                    */
/*==============================================================*/
create  index USUARIOS_RESERVAS_FK on usuarios_reservas (
ID_RESERVA
);

/*==============================================================*/
/* Table: USUARIO_VEHICULO                                      */
/*==============================================================*/
create table usuarios_vehiculos (
   MATRICULA            VARCHAR(7)           not null,
   USER_ID                 VARCHAR(100)         not null,
   constraint PK_USUARIOS_VEHICULOS primary key (MATRICULA, USER_ID)
);

/*==============================================================*/
/* Index: USUARIO_VEHICULO_PK                                   */
/*==============================================================*/
create unique index USUARIOS_VEHICULOS_PK on usuarios_vehiculos (
MATRICULA,
USER_ID
);

/*==============================================================*/
/* Index: USUARIO_VEHICULO_FK                                   */
/*==============================================================*/
create  index USUARIOS_VEHICULOS_FK on usuarios_vehiculos (
MATRICULA
);

/*==============================================================*/
/* Index: USUARIO_VEHICULO2_FK                                  */
/*==============================================================*/
create  index USUARIOS_VEHICULOS2_FK on usuarios_vehiculos (
USER_ID
);

/*==============================================================*/
/* Table: VEHICULO                                              */
/*==============================================================*/
create table vehiculos (
   MATRICULA            VARCHAR(7)           not null,
   NOMBRE_CONDUCTOR     VARCHAR(100)         not null,
   DNI_TITULAR          VARCHAR(9)           not null,
   NOMBRE_TITULAR       VARCHAR(100)         null,
   constraint PK_VEHICULOS primary key (MATRICULA),
   CONSTRAINT CK_MATRICULA CHECK (MATRICULA ~* '^[0-9]{4}[A-Z]{3}$'),
   CONSTRAINT CK_DNI CHECK (DNI_TITULAR ~* '^[0-9]{8}[A-Z]{1}$')
);

/*==============================================================*/
/* Index: VEHICULO_PK                                           */
/*==============================================================*/
create unique index VEHICULOS_PK on vehiculos (
MATRICULA
);

/*==============================================================*/
/* Table: VEHICULO_RESERVA                                      */
/*==============================================================*/
create table vehiculos_reservas (
   ID_RESERVA           INT4                 not null,
   MATRICULA            VARCHAR(7)           not null,
   constraint PK_VEHICULO_RESERVA primary key (ID_RESERVA, MATRICULA)
);

/*==============================================================*/
/* Index: VEHICULO_RESERVA_PK                                   */
/*==============================================================*/
create unique index VEHICULOS_RESERVAS_PK on vehiculos_reservas (
ID_RESERVA,
MATRICULA
);

/*==============================================================*/
/* Index: VEHICULO_RESERVA2_FK                                  */
/*==============================================================*/
create  index VEHICULOS_RESERVAS2_FK on vehiculos_reservas (
MATRICULA
);

/*==============================================================*/
/* Index: VEHICULO_RESERVA_FK                                   */
/*==============================================================*/
create  index VEHICULOS_RESERVAS_FK on vehiculos_reservas (
ID_RESERVA
);

alter table reservas
   add constraint FK_RESERVAS_CIRCUITOS__CIRCUITOS foreign key (ID_CIRCUITO)
      references circuitos (ID_CIRCUITO)
      on delete restrict on update restrict;

alter table usuarios_reservas
   add constraint FK_USUARIOS__USUARIOS_R_RESERVAS foreign key (ID_RESERVA)
      references reservas (ID_RESERVA)
      on delete restrict on update restrict;

alter table usuarios_reservas
   add constraint FK_USUARIOS__USUARIOS_R_USUARIOS foreign key (USER_ID)
      references usuarios (USER_ID)
      on delete restrict on update restrict;

alter table usuarios_vehiculos
   add constraint FK_USUARIOS__USUARIOS_V_VEHICULOS foreign key (MATRICULA)
      references vehiculos (MATRICULA)
      on delete restrict on update restrict;

alter table usuarios_vehiculos
   add constraint FK_USUARIOS__USUARIOS_V_USUARIOS foreign key (USER_ID)
      references usuarios (USER_ID)
      on delete restrict on update restrict;

alter table vehiculos_reservas
   add constraint FK_VEHICULOS_VEHICULOS__RESERVAS foreign key (ID_RESERVA)
      references reservas (ID_RESERVA)
      on delete restrict on update restrict;

alter table vehiculos_reservas
   add constraint FK_VEHICULOS_VEHICULOS__VEHICULOS foreign key (MATRICULA)
      references vehiculos (MATRICULA)
      on delete restrict on update restrict;

alter table usuarios_circuitos
   add constraint FK_USUARIOS__USUARIOS_C_CIRCUITOS foreign key (ID_CIRCUITO)
      references circuitos (ID_CIRCUITO)
      on delete restrict on update restrict;

alter table usuarios_circuitos
   add constraint FK_USUARIOS__USUARIOS_C_USUARIOS foreign key (USER_ID)
      references usuarios (USER_ID)
      on delete restrict on update restrict;