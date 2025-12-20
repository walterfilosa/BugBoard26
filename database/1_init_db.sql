CREATE SCHEMA bugboard26;

ALTER SCHEMA bugboard26 OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE bugboard26.issue (
    idissue integer NOT NULL,
    tipo character varying(50) NOT NULL,
    titolo character varying(50) NOT NULL,
    descrizione text NOT NULL,
    "priorità" integer,
    immagine text,
    stato character varying(50) DEFAULT 'ToDo'::character varying NOT NULL,
    idprogetto integer NOT NULL,
    idcreatore integer NOT NULL,
    idassegnato integer,
    CONSTRAINT "chk_priorità" CHECK ((("priorità" <= 5) AND ("priorità" >= 1))),
    CONSTRAINT chk_stato CHECK ((((stato)::text = 'ToDo'::text) OR ((stato)::text = 'Assegnata'::text) OR ((stato)::text = 'Risolta'::text))),
    CONSTRAINT chk_tipo CHECK ((((tipo)::text = 'Question'::text) OR ((tipo)::text = 'Bug'::text) OR ((tipo)::text = 'Documentation'::text) OR ((tipo)::text = 'Feature'::text)))
);


ALTER TABLE bugboard26.issue OWNER TO postgres;

CREATE SEQUENCE bugboard26.issue_idissue_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE bugboard26.issue_idissue_seq OWNER TO postgres;

ALTER SEQUENCE bugboard26.issue_idissue_seq OWNED BY bugboard26.issue.idissue;


CREATE TABLE bugboard26.lavora (
    idprogetto integer NOT NULL,
    idutente integer NOT NULL
);


ALTER TABLE bugboard26.lavora OWNER TO postgres;


CREATE TABLE bugboard26.progetto (
    idprogetto integer NOT NULL,
    titolo character varying(50) NOT NULL,
    descrizione text,
    stato character varying(50) DEFAULT 'Attivo'::character varying NOT NULL,
    CONSTRAINT chk_stato CHECK ((((stato)::text = 'Attivo'::text) OR ((stato)::text = 'InSospeso'::text) OR ((stato)::text = 'Chiuso'::text)))
);


ALTER TABLE bugboard26.progetto OWNER TO postgres;


CREATE SEQUENCE bugboard26.progetto_idprogetto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE bugboard26.progetto_idprogetto_seq OWNER TO postgres;

ALTER SEQUENCE bugboard26.progetto_idprogetto_seq OWNED BY bugboard26.progetto.idprogetto;


CREATE TABLE bugboard26.utente (
    idutente integer NOT NULL,
    nome character varying(50) NOT NULL,
    cognome character varying(50) NOT NULL,
    datadinascita date NOT NULL,
    email character varying(50) NOT NULL,
    numeroditelefono character varying(20) NOT NULL,
    password character varying(80) NOT NULL,
    isadmin boolean NOT NULL
);


ALTER TABLE bugboard26.utente OWNER TO postgres;



CREATE SEQUENCE bugboard26.utente_idutente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE bugboard26.utente_idutente_seq OWNER TO postgres;


ALTER SEQUENCE bugboard26.utente_idutente_seq OWNED BY bugboard26.utente.idutente;


ALTER TABLE ONLY bugboard26.issue ALTER COLUMN idissue SET DEFAULT nextval('bugboard26.issue_idissue_seq'::regclass);


ALTER TABLE ONLY bugboard26.progetto ALTER COLUMN idprogetto SET DEFAULT nextval('bugboard26.progetto_idprogetto_seq'::regclass);


ALTER TABLE ONLY bugboard26.utente ALTER COLUMN idutente SET DEFAULT nextval('bugboard26.utente_idutente_seq'::regclass);

INSERT INTO bugboard26.issue VALUES (13, 'Question', 'Non capisco una mazza', 'Ciao sono nuovo', 2, 'https://i1.rgstatic.net/ii/profile.image/272449132560396-1441968344623_Q512/Sergio-Di-Martino.jpg', 'Risolta', 1, 6, 9);
INSERT INTO bugboard26.issue VALUES (3, 'Bug', 'Problema con gli Id', 'Speriamo che funzioni', 5, 'https://i1.rgstatic.net/ii/profile.image/272449132560396-1441968344623_Q512/Sergio-Di-Martino.jpg', 'Risolta', 1, 2, 4);
INSERT INTO bugboard26.issue VALUES (11, 'Question', 'Quando gioca il Napoli?', 'Forza Napoli', 2, 'https://i1.rgstatic.net/ii/profile.image/272449132560396-1441968344623_Q512/Sergio-Di-Martino.jpg', 'ToDo', 3, 2, NULL);
INSERT INTO bugboard26.issue VALUES (10, 'Documentation', 'Prova', 'Speriamo che funzioni', 5, 'https://i1.rgstatic.net/ii/profile.image/272449132560396-1441968344623_Q512/Sergio-Di-Martino.jpg', 'Assegnata', 1, 6, 6);
INSERT INTO bugboard26.issue VALUES (12, 'Documentation', 'Documentazione assente ', 'Forza Napoli', 2, 'https://i1.rgstatic.net/ii/profile.image/272449132560396-1441968344623_Q512/Sergio-Di-Martino.jpg', 'Assegnata', 1, 6, 6);
INSERT INTO bugboard26.issue VALUES (1, 'Question', 'Funzionerà?', 'Funziona?!', 5, 'https://blog.obilet.com/wp-content/uploads/2020/05/Napoli-%C4%B0talya.jpeg', 'Assegnata', 1, 2, 2);


INSERT INTO bugboard26.lavora VALUES (3, 2);
INSERT INTO bugboard26.lavora VALUES (2, 2);
INSERT INTO bugboard26.lavora VALUES (1, 2);
INSERT INTO bugboard26.lavora VALUES (2, 4);
INSERT INTO bugboard26.lavora VALUES (1, 4);
INSERT INTO bugboard26.lavora VALUES (3, 6);
INSERT INTO bugboard26.lavora VALUES (3, 18);
INSERT INTO bugboard26.lavora VALUES (3, 9);
INSERT INTO bugboard26.lavora VALUES (1, 9);
INSERT INTO bugboard26.lavora VALUES (1, 6);
INSERT INTO bugboard26.lavora VALUES (1, 10);

INSERT INTO bugboard26.progetto VALUES (1, 'BugBoard27', 'Stocazzo', 'Attivo');
INSERT INTO bugboard26.progetto VALUES (2, 'DietiDeals24', 'Una Chiavica', 'Attivo');
INSERT INTO bugboard26.progetto VALUES (3, 'RacingGame', NULL, 'Attivo');
INSERT INTO bugboard26.progetto VALUES (4, 'BugBoard', 'Best App', 'Attivo');


INSERT INTO bugboard26.utente VALUES (4, 'Walter', 'Filosa', '2003-12-21', 'Walter', '21212121', '$2a$12$7jPyLt48sI1xJogS.V6ZCuZ8.B0fcZcw69Pckx9D8kpYL7ol/MxJa', false);
INSERT INTO bugboard26.utente VALUES (6, 'Prova', 'Prova', '2001-12-07', 'prova@gmail.com', '+39+3956464424424', '$2a$12$aqUy4sVkFvdemxnrtt429.4DMtaoopl0ginYQThSslN5BzBVrWSxm', false);
INSERT INTO bugboard26.utente VALUES (2, 'Vincenzo', 'Donadio', '2001-12-07', 'vin@gmail.com', '+3953453636464', '$2a$12$ixbnPBVmzpsRdfE/b3sXo.YAdUWyCiZ/cKgH4GKbjgQs5HM9h/zAG', true);
INSERT INTO bugboard26.utente VALUES (9, 'Peppe', 'Mayo', '1989-04-26', 'peppe@mayo.com', '+39 23120121921', '$2a$12$i1IU7EUgRLn0AEe8KBpRVeUsi.hpqFSVPZsLgguX9SxXGVupHM9/a', false);
INSERT INTO bugboard26.utente VALUES (10, 'Jan ', 'Haladej', '1989-04-26', 'Jan@gmail.com', '+420 33212123204', '$2a$12$0AHxnblwIeDmuj9cL7cxPuP6rVyuJsFGxD8cvWIwMXMyGEjuj/NXK', true);
INSERT INTO bugboard26.utente VALUES (11, 'Napoli', 'Regna', '2025-11-19', 'Provola@napoli.com', '+39 12123234233', '$2a$12$713uIQOMUIHP2q5B1WLdQuw7BM6L8RVuubIpB7RaRKDfM8vx2VtJ2', false);
INSERT INTO bugboard26.utente VALUES (18, 'Ciao', 'Ciao', '1999-12-31', 'Ciao@ciao.com', '+39 32343432545', '$2a$12$Y7KDWU3BBTNnYo2nLEnuFuYnGRrfGmbVzjQIe7VZJ1IF/qWdQz5QK', false);


SELECT pg_catalog.setval('bugboard26.issue_idissue_seq', 14, true);

SELECT pg_catalog.setval('bugboard26.progetto_idprogetto_seq', 4, true);

SELECT pg_catalog.setval('bugboard26.utente_idutente_seq', 18, true);


ALTER TABLE ONLY bugboard26.issue
    ADD CONSTRAINT issue_pkey PRIMARY KEY (idissue);


ALTER TABLE ONLY bugboard26.lavora
    ADD CONSTRAINT pk_lavora PRIMARY KEY (idprogetto, idutente);


ALTER TABLE ONLY bugboard26.progetto
    ADD CONSTRAINT progetto_pkey PRIMARY KEY (idprogetto);



ALTER TABLE ONLY bugboard26.utente
    ADD CONSTRAINT utente_email_key UNIQUE (email);



ALTER TABLE ONLY bugboard26.utente
    ADD CONSTRAINT utente_numeroditelefono_key UNIQUE (numeroditelefono);


ALTER TABLE ONLY bugboard26.utente
    ADD CONSTRAINT utente_pkey PRIMARY KEY (idutente);

ALTER TABLE ONLY bugboard26.issue
    ADD CONSTRAINT fk_progetto FOREIGN KEY (idprogetto) REFERENCES bugboard26.progetto(idprogetto);



ALTER TABLE ONLY bugboard26.lavora
    ADD CONSTRAINT fk_progetto FOREIGN KEY (idprogetto) REFERENCES bugboard26.progetto(idprogetto);



ALTER TABLE ONLY bugboard26.lavora
    ADD CONSTRAINT fk_utente FOREIGN KEY (idutente) REFERENCES bugboard26.utente(idutente);


ALTER TABLE ONLY bugboard26.issue
    ADD CONSTRAINT fk_utenteassegnato FOREIGN KEY (idassegnato) REFERENCES bugboard26.utente(idutente);


ALTER TABLE ONLY bugboard26.issue
    ADD CONSTRAINT fk_utentecreatore FOREIGN KEY (idcreatore) REFERENCES bugboard26.utente(idutente);


REVOKE ALL ON TABLE bugboard26.issue FROM postgres;
GRANT ALL ON TABLE bugboard26.issue TO postgres WITH GRANT OPTION;

REVOKE ALL ON TABLE bugboard26.lavora FROM postgres;
GRANT ALL ON TABLE bugboard26.lavora TO postgres WITH GRANT OPTION;

REVOKE ALL ON TABLE bugboard26.utente FROM postgres;
GRANT ALL ON TABLE bugboard26.utente TO postgres WITH GRANT OPTION;



ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA bugboard26 GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;
