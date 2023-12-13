CREATE SEQUENCE question_id_seq START 1;

CREATE TABLE IF NOT EXISTS public.question
(
    id integer NOT NULL DEFAULT nextval('question_id_seq'::regclass),
    questiontext text COLLATE pg_catalog."default" NOT NULL,
    points integer NOT NULL,
    multipleselect boolean NOT NULL,
    image bytea[],
    CONSTRAINT question_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.question
    OWNER to admin;

CREATE SEQUENCE test_id_seq START 1;

CREATE TABLE IF NOT EXISTS public.test
(
    id integer NOT NULL DEFAULT nextval('test_id_seq'::regclass),
    title text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    questions integer[] NOT NULL,
    category text COLLATE pg_catalog."default" NOT NULL,
    duration integer NOT NULL,
    maxscore integer NOT NULL,
    isvisible boolean NOT NULL,
    image bytea[],
    CONSTRAINT test_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.test
    OWNER to admin;

CREATE SEQUENCE option_id_seq START 1;

CREATE TABLE IF NOT EXISTS public.option
(
    id integer NOT NULL DEFAULT nextval('option_id_seq'::regclass),
    questionid integer NOT NULL,
    optiontext text COLLATE pg_catalog."default" NOT NULL,
    iscorrect boolean NOT NULL,
    CONSTRAINT question FOREIGN KEY (questionid)
        REFERENCES public.question (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.option
    OWNER to admin;

CREATE SEQUENCE user_id_seq START 1;

CREATE TABLE IF NOT EXISTS public."user"
(
    id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    surname text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    image bytea[],
    isstudent boolean,
    isadmin boolean,
    CONSTRAINT user_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to admin;

CREATE SEQUENCE attempt_id_seq START 1;
	
CREATE TABLE IF NOT EXISTS public.attempt
(
    id integer NOT NULL DEFAULT nextval('attempt_id_seq'::regclass),
    userid integer NOT NULL,
    testid integer NOT NULL,
    score integer NOT NULL,
    passed boolean NOT NULL,
    maxscore integer,
    percentage double precision,
    CONSTRAINT attempt_pkey PRIMARY KEY (id),
    CONSTRAINT test FOREIGN KEY (testid)
        REFERENCES public.test (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "user" FOREIGN KEY (userid)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.attempt
    OWNER to admin;

CREATE SEQUENCE userresponse_id_seq START 1;

CREATE TABLE IF NOT EXISTS public.userresponse
(
    id integer NOT NULL DEFAULT nextval('userresponse_id_seq'::regclass),
    attemptid integer NOT NULL,
    questionid integer NOT NULL,
    selectedoptions integer[] NOT NULL,
    iscorrect boolean NOT NULL,
    CONSTRAINT userresponse_pkey PRIMARY KEY (id),
    CONSTRAINT attempt FOREIGN KEY (attemptid)
        REFERENCES public.attempt (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT question FOREIGN KEY (questionid)
        REFERENCES public.question (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.userresponse
    OWNER to admin;

CREATE SEQUENCE authenticationtoken_id_seq START 1;

CREATE TABLE IF NOT EXISTS public.authenticationtoken
(
    id integer NOT NULL DEFAULT nextval('authenticationtoken_id_seq'::regclass),
    value text COLLATE pg_catalog."default" NOT NULL,
    userid integer NOT NULL,
    CONSTRAINT authenticationtoken_pkey PRIMARY KEY (id),
    CONSTRAINT "user" FOREIGN KEY (userid)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.authenticationtoken
    OWNER to admin;