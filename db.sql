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
-- Name: id; Type: DEFAULT; Schema: public; Owner: obay
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: obay
--

COPY comments (linkid, username, content, date, id, class, likes, dislikes, parent) FROM stdin;
1	userName	comment	2016-10-03T11:56:20.463Z	24	\N	0	0	\N
1	userName	reply	2016-10-03T11:56:23.190Z	25	\N	0	0	24
1	userName	reply2	2016-10-03T11:56:35.820Z	26	\N	0	0	25
1	userName	hello	2016-10-04T11:19:19.234Z	27	\N	0	0	26
1	userName	new comment link 2	2016-10-04T14:35:32.079Z	28	\N	0	0	\N
2	userName	link2	2016-10-04T14:43:25.849Z	29	\N	0	0	\N
3	userName	hello is it me you are looking for??	2016-10-04T14:44:01.118Z	30	\N	0	0	\N
3	userName	noooooo fuck you	2016-10-04T14:44:07.095Z	31	\N	0	0	30
2	userName	fdsa	2016-10-05T09:01:21.659Z	32	\N	0	0	29
1	userName	hello world	2016-10-05T09:03:11.563Z	33	\N	0	0	28
1	userName	\N	2016-10-05T09:03:48.305Z	34	\N	0	0	24
1	userName	\N	2016-10-05T09:04:06.543Z	35	\N	0	0	25
1	userName	\N	2016-10-05T09:04:18.390Z	36	\N	0	0	\N
1	userName	fsd	2016-10-05T09:04:51.792Z	37	\N	0	0	\N
1	userName	\N	Wed Oct 05 2016 11:13:01 GM	38	\N	0	0	24
1	userName	\N	Wed Oct 05 2016 11:13:06 GM	39	\N	0	0	37
1	userName	\N	2016-10-05T09:14:14.355Z	40	\N	0	0	\N
1	userName	\N	2016-10-05T09:14:15.730Z	41	\N	0	0	\N
1	userName	\N	2016-10-05T09:14:17.139Z	42	\N	0	0	\N
1	userName	\N	2016-10-05T09:14:20.622Z	43	\N	0	0	42
8	userName	our first comment	2016-10-05T09:29:40.024Z	44	\N	0	0	\N
8	userName	first reply to the first comment	2016-10-05T09:32:20.657Z	45	\N	0	0	44
8	userName	r to r	2016-10-05T09:33:32.138Z	46	\N	0	0	\N
8	userName	r to r to r	2016-10-05T09:33:42.278Z	47	\N	0	0	\N
8	userName	r	2016-10-05T09:33:50.161Z	48	\N	0	0	\N
8	userName	new comment	2016-10-05T10:24:25.088Z	49	\N	0	0	\N
8	userName	something	2016-10-05T10:24:32.595Z	50	\N	0	0	49
11	userName	first comment	2016-10-05T10:27:20.836Z	51	\N	0	0	\N
11	userName	r	2016-10-05T10:27:23.860Z	52	\N	0	0	51
11	userName	rr	2016-10-05T10:27:31.685Z	53	\N	0	0	\N
11	userName	rrrr	2016-10-05T10:29:33.284Z	54	\N	0	0	52
11	userName	rrr	2016-10-05T10:30:28.098Z	55	\N	0	0	52
12	userName	new comment	2016-10-05T11:19:35.774Z	56	\N	0	0	\N
12	userName	r	2016-10-05T11:19:41.119Z	57	\N	0	0	56
12	userName	rr	2016-10-05T11:19:48.861Z	58	\N	0	0	\N
12	userName	rrr	2016-10-05T11:20:04.719Z	59	\N	0	0	\N
12	userName	rrrr	2016-10-05T11:20:14.408Z	60	\N	0	0	\N
4	userName	first comment	2016-10-05T11:23:52.415Z	61	\N	0	0	\N
4	userName	r	2016-10-05T11:23:55.394Z	62	\N	0	0	61
4	userName	rr	2016-10-05T11:24:04.889Z	63	\N	0	0	\N
4	userName	rrr	2016-10-05T11:24:16.737Z	64	\N	0	0	\N
6	userName	new comment	2016-10-05T11:27:38.388Z	65	\N	0	0	\N
7	userName	new	2016-10-05T11:28:25.697Z	66	\N	0	0	\N
7	userName	r	2016-10-05T11:28:28.414Z	67	\N	0	0	66
7	userName	rr	2016-10-05T11:28:33.706Z	68	\N	0	0	67
7	userName	rrr	2016-10-05T11:28:42.994Z	69	\N	0	0	68
7	userName	rrr	2016-10-05T11:28:47.761Z	70	\N	0	0	69
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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: obay
--

COPY users (id, email, password, name) FROM stdin;
1	obay@gmail.com	123456	obay
2	o	o	o
4	x	x	o
5	q	q	q
7	w	w	w
8	david@gmail.com	1	david
10	a	a	a
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obay
--

SELECT pg_catalog.setval('users_id_seq', 10, true);


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
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

