CREATE TABLE IF NOT EXISTS public.question
(
    id integer NOT NULL DEFAULT nextval('question_id_seq'::regclass),
    questiontext text COLLATE pg_catalog."default" NOT NULL,
    image bytea[],
    points integer NOT NULL,
    multipleselect boolean NOT NULL,
    CONSTRAINT question_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.question
    OWNER to admin;

CREATE TABLE IF NOT EXISTS public.test
(
    id integer NOT NULL DEFAULT nextval('test_id_seq'::regclass),
    title text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    questions integer[] NOT NULL,
    category text COLLATE pg_catalog."default" NOT NULL,
    duration integer NOT NULL,
    image bytea[] NOT NULL,
    CONSTRAINT test_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.test
    OWNER to admin;

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

	CREATE TABLE IF NOT EXISTS public.student
(
    id integer NOT NULL DEFAULT nextval('student_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    surname text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT student_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.student
    OWNER to admin;
	
CREATE TABLE IF NOT EXISTS public.attempt
(
    id integer NOT NULL DEFAULT nextval('attempt_id_seq'::regclass),
    studentid integer NOT NULL,
    testid integer NOT NULL,
    score integer NOT NULL,
    passed boolean NOT NULL,
    CONSTRAINT attempt_pkey PRIMARY KEY (id),
    CONSTRAINT student FOREIGN KEY (studentid)
        REFERENCES public.student (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT test FOREIGN KEY (testid)
        REFERENCES public.test (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.attempt
    OWNER to admin;

CREATE TABLE IF NOT EXISTS public.studentresponse
(
    id integer NOT NULL DEFAULT nextval('studentresponse_id_seq'::regclass),
    attemptid integer NOT NULL,
    questionid integer NOT NULL,
    selectedoptions integer[] NOT NULL,
    iscorrect boolean NOT NULL,
    CONSTRAINT studentresponse_pkey PRIMARY KEY (id),
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

ALTER TABLE IF EXISTS public.studentresponse
    OWNER to admin;