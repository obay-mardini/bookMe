--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: obay
--

CREATE TABLE comments (
    linkid integer,
    username character varying(255),
    content character varying(255),
    date character varying(50),
    id integer NOT NULL,
    class character varying(255),
    likes integer,
    dislikes integer,
    parent character varying(255)
);


ALTER TABLE comments OWNER TO obay;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: obay
--

CREATE SEQUENCE comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE comments_id_seq OWNER TO obay;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obay
--

ALTER SEQUENCE comments_id_seq OWNED BY comments.id;


--
-- Name: links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE links (
    id integer NOT NULL,
    score integer DEFAULT 1,
    link character varying(255) NOT NULL,
    image character varying(255) DEFAULT 'http://image.flaticon.com/icons/svg/46/46080.svg'::character varying,
    timeposted timestamp with time zone DEFAULT now(),
    description character varying(255) NOT NULL,
    user_id integer
);


ALTER TABLE links OWNER TO postgres;

--
-- Name: links_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE links_id_seq OWNER TO postgres;

--
-- Name: links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE links_id_seq OWNED BY links.id;


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: obay
--

CREATE TABLE purchases (
    purchaseid integer NOT NULL,
    ticketid integer,
    price smallint,
    carrier character varying(50),
    agent character varying(50)
);


ALTER TABLE purchases OWNER TO obay;

--
-- Name: purchases_purchaseid_seq; Type: SEQUENCE; Schema: public; Owner: obay
--

CREATE SEQUENCE purchases_purchaseid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE purchases_purchaseid_seq OWNER TO obay;

--
-- Name: purchases_purchaseid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obay
--

ALTER SEQUENCE purchases_purchaseid_seq OWNED BY purchases.purchaseid;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: obay
--

CREATE TABLE tickets (
    userid character varying,
    ticketid integer NOT NULL,
    origin character varying(50),
    destination character varying(50),
    location character varying(50),
    depart character varying(50),
    return character varying(50),
    adult smallint,
    children smallint,
    infants smallint,
    class character varying(50),
    twoways character varying(20),
    country character varying(50)
);


ALTER TABLE tickets OWNER TO obay;

--
-- Name: tickets_ticketid_seq; Type: SEQUENCE; Schema: public; Owner: obay
--

CREATE SEQUENCE tickets_ticketid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tickets_ticketid_seq OWNER TO obay;

--
-- Name: tickets_ticketid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obay
--

ALTER SEQUENCE tickets_ticketid_seq OWNED BY tickets.ticketid;


--
-- Name: users; Type: TABLE; Schema: public; Owner: obay
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    name character varying(255)
);


ALTER TABLE users OWNER TO obay;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: obay
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO obay;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obay
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: obay
--

ALTER TABLE ONLY comments ALTER COLUMN id SET DEFAULT nextval('comments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY links ALTER COLUMN id SET DEFAULT nextval('links_id_seq'::regclass);


--
-- Name: purchaseid; Type: DEFAULT; Schema: public; Owner: obay
--

ALTER TABLE ONLY purchases ALTER COLUMN purchaseid SET DEFAULT nextval('purchases_purchaseid_seq'::regclass);


--
-- Name: ticketid; Type: DEFAULT; Schema: public; Owner: obay
--

ALTER TABLE ONLY tickets ALTER COLUMN ticketid SET DEFAULT nextval('tickets_ticketid_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: obay
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: obay
--

COPY comments (linkid, username, content, date, id, class, likes, dislikes, parent) FROM stdin;
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obay
--

SELECT pg_catalog.setval('comments_id_seq', 70, true);


--
-- Data for Name: links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY links (id, score, link, image, timeposted, description, user_id) FROM stdin;
1	1	https://www.ineedtosellmykidney.com	http://image.flaticon.com/icons/svg/46/46080.svg	2016-09-28 16:59:59.856646+02	I really need to do this guys	\N
2	1	https://www.silkroad.tor	http://image.flaticon.com/icons/svg/46/46080.svg	2016-09-28 17:27:04.066639+02	I have just the page for you!	1
3	1	https://www.hauntedhouse.co.uk	http://image.flaticon.com/icons/svg/46/46080.svg	2016-09-28 19:27:39.333436+02	Have you ever wondered what happens in the haunted house after every1's gone home?	1
4	1	https://www.google.de	http://image.flaticon.com/icons/svg/46/46080.svg	2016-09-29 11:54:05.793776+02	Hey, I found this awesome site, it lets you find almost anything on the web if you ask it right!	1
5	1	https://www.youtube.com	http://image.flaticon.com/icons/svg/46/46080.svg	2016-09-29 15:35:18.79348+02	Have you heard about this site yet? You can post funny videos of cats and stuff!	1
6	1	https://www.pornhub.com	http://image.flaticon.com/icons/svg/46/46080.svg	2016-09-30 15:03:05.459852+02	you want believe it	1
7	1	https://www.google.com	http://image.flaticon.com/icons/svg/46/46080.svg	2016-09-30 15:31:08.556297+02	"<img src=0 onerror="alert(1)">	1
8	1	https://www.reddit.com	http://image.flaticon.com/icons/svg/46/46080.svg	2016-10-05 11:26:05.541587+02	this is a great site	1
11	1	https://newlink.com	http://image.flaticon.com/icons/svg/46/46080.svg	2016-10-05 12:27:14.250743+02	new link	1
12	1	https:www.1.com	http://image.flaticon.com/icons/svg/46/46080.svg	2016-10-05 13:19:25.069603+02	one	1
\.


--
-- Name: links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('links_id_seq', 12, true);


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: obay
--

COPY purchases (purchaseid, ticketid, price, carrier, agent) FROM stdin;
1	\N	591	Gulf Air	Expedia
2	\N	591	Gulf Air	Expedia
3	\N	591	Gulf Air	Expedia
4	136	591	Gulf Air	Expedia
5	136	436	Jet Airways	Opodo
6	136	766	Qatar Airways	Opodo
7	144	1209	Air Berlin	airberlin
8	153	595	Qatar Airways	Qatar Airways
\.


--
-- Name: purchases_purchaseid_seq; Type: SEQUENCE SET; Schema: public; Owner: obay
--

SELECT pg_catalog.setval('purchases_purchaseid_seq', 8, true);


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: obay
--

COPY tickets (userid, ticketid, origin, destination, location, depart, return, adult, children, infants, class, twoways, country) FROM stdin;
\N	1	dubai	bangkok	germany	11-15-2016	12321	1	0	0	Economy	true	\N
\N	2	DXBA-sky	BKKT-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
\N	9	dubai	bangkok	germany	11-15-2016	12321	1	0	0	Economy	true	\N
\N	10	dubai	bangkok	germany	11-15-2016	12321	1	0	0	Economy	true	\N
dana@gmail.com	12	DXBA-sky	BKKT-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	13	DXBA-sky	BKKT-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	14	DXBA-sky	BKKT-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	15	DXBA-sky	BKKT-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	16	DXBA-sky	BKKT-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	17	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	18	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	19	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	20	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	21	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	22	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	23	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	24	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	25	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	26	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	27	BKKT-sky	DXBA-sky	{}	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	28	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	29	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	30	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	31	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	32	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	33	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	34	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	35	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	36	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	37	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	38	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	39	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	40	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	41	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	42	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	43	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	44	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	45	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	46	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	47	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	48	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	49	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	50	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	51	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	52	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	53	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	54	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	55	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	56	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	57	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	58	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	59	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	60	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	61	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	62	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	63	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	64	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	65	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	66	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	67	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	68	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
dana@gmail.com	69	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	70	BEY-sky	CAI-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	71	BEY-sky	CAI-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	72	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	73	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	74	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	75	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	76	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	77	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	78	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	79	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	80	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	81	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	82	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	83	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	84	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	85	CAI-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	86	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	87	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	88	CAI-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	89	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	90	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	91	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	92	MCT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	93	MCT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	94	DXBA-sky	BKKT-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	95	DXBA-sky	BKKT-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	96	MCT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	97	MCT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	98	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	99	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	100	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	101	DXBA-sky	BKKT-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	102	DXBA-sky	BKKT-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	103	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	104	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	105	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	106	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	107	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	108	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	109	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	110	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	111	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	112	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	113	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	114	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	115	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	116	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	117	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	118	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	119	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	120	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	121	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	122	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	123	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	124	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	125	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	126	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	0	0	Economy	\N	\N
obay123@gmail.com	127	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
obay123@gmail.com	128	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	135	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	136	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	137	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	138	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	139	NYCA-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	140	NYCA-sky	CAI-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	141	NYCA-sky	MGQ-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	142	NYCA-sky	BKKT-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	143	BKKT-sky	MGQ-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	144	NYCA-sky	TXL-sky	Berlin (Reinickendorf)	2016-12-15	2016-12-31	1	0	\N	Economy	\N	\N
visitor	145	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	146	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	147	BKKT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	148	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	149	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	150	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	151	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	152	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	153	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	154	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	155	DXBA-sky	BKKT-sky	Berlin	2016-11-04	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	156	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	157	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	158	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	159	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	160	BKKT-sky	DXBA-sky	Berlin	2016-11-04	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	161	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	162	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	163	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	164	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	165	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	166	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	167	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	168	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	169	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	170	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	171	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	172	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	173	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	174	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	175	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	176	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	177	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	178	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	179	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	180	NYCA-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	181	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	182	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	183	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	184	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	185	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	186	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	187	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	188	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	189	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	190	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	191	NYCA-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	192	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	193	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	194	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	195	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	196	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	197	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	198	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	199	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	200	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	201	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	202	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	203	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-20	1	\N	\N	Economy	\N	\N
visitor	204	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	205	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	206	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	207	BKKT-sky	DXBA-sky	Berlin	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	208	DXBA-sky	BKKT-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	209	DXBA-sky	BKKT-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	210	MCT-sky	DXBA-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
visitor	211	MCT-sky	BKKT-sky	Berlin (Reinickendorf)	2016-11-14	2017-02-14	1	\N	\N	Economy	\N	\N
\.


--
-- Name: tickets_ticketid_seq; Type: SEQUENCE SET; Schema: public; Owner: obay
--

SELECT pg_catalog.setval('tickets_ticketid_seq', 211, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: obay
--

COPY users (id, email, password, name) FROM stdin;
11	dana@gmail.com	1	first
12	obay123@gmail.com	obay123	obay
13	visitor	\N	\N
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obay
--

SELECT pg_catalog.setval('users_id_seq', 13, true);


--
-- Name: links_link_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY links
    ADD CONSTRAINT links_link_key UNIQUE (link);


--
-- Name: links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY links
    ADD CONSTRAINT links_pkey PRIMARY KEY (id);


--
-- Name: purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: obay
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (purchaseid);


--
-- Name: tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: obay
--

ALTER TABLE ONLY tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (ticketid);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: obay
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);


--
-- Name: comments_linkid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obay
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT comments_linkid_fkey FOREIGN KEY (linkid) REFERENCES links(id);


--
-- Name: purchases_ticketid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obay
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT purchases_ticketid_fkey FOREIGN KEY (ticketid) REFERENCES tickets(ticketid);


--
-- Name: tickets_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obay
--

ALTER TABLE ONLY tickets
    ADD CONSTRAINT tickets_userid_fkey FOREIGN KEY (userid) REFERENCES users(email);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

