--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: energy_consumption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.energy_consumption (
    id integer NOT NULL,
    average_monthly_consumption numeric NOT NULL,
    current_energy_cost numeric,
    number_of_bulbs integer NOT NULL,
    income numeric,
    owns_television boolean NOT NULL,
    owns_fridge boolean NOT NULL,
    fridge_size character varying(10),
    primary_energy_source character varying(50) NOT NULL,
    user_id integer NOT NULL,
    screen_size character varying,
    grid_unit_cost numeric DEFAULT 0.05
);


ALTER TABLE public.energy_consumption OWNER TO postgres;

--
-- Name: energy_consumption_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.energy_consumption_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.energy_consumption_id_seq OWNER TO postgres;

--
-- Name: energy_consumption_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.energy_consumption_id_seq OWNED BY public.energy_consumption.id;


--
-- Name: equipment_cost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment_cost (
    profile text NOT NULL,
    "300w_solar_panel" text,
    "100mah_battery" text,
    "500w_inverter" text,
    "1000w_inverter" text,
    "1500w_inverter" text
);


ALTER TABLE public.equipment_cost OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    message text,
    read_status text,
    created_at date,
    username text
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    equipment_type text,
    specification text,
    quantity integer,
    client_id integer,
    order_cost integer,
    supplier_username text
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: supplier_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_products (
    supplier_id integer,
    equipment_type text,
    battery_specification character varying,
    inverter_specification text,
    unit_cost numeric,
    quantity numeric,
    panel_specification text
);


ALTER TABLE public.supplier_products OWNER TO postgres;

--
-- Name: system_recommendation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_recommendation (
    id integer NOT NULL,
    panels integer NOT NULL,
    batteries integer NOT NULL,
    inverter_size bigint NOT NULL,
    user_id integer NOT NULL,
    daily_energy_requirement numeric NOT NULL
);


ALTER TABLE public.system_recommendation OWNER TO postgres;

--
-- Name: system_recommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_recommendation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.system_recommendation_id_seq OWNER TO postgres;

--
-- Name: system_recommendation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_recommendation_id_seq OWNED BY public.system_recommendation.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname text,
    lastname text,
    username text NOT NULL,
    password text NOT NULL,
    user_type text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: energy_consumption id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumption ALTER COLUMN id SET DEFAULT nextval('public.energy_consumption_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: system_recommendation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_recommendation ALTER COLUMN id SET DEFAULT nextval('public.system_recommendation_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: energy_consumption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.energy_consumption (id, average_monthly_consumption, current_energy_cost, number_of_bulbs, income, owns_television, owns_fridge, fridge_size, primary_energy_source, user_id, screen_size, grid_unit_cost) FROM stdin;
18	80	23	4	2323	f	f	\N	grid	23	\N	0.2
6	73	3000	3	100	t	t	large		17	<21	0.3
26	90	2400	5	1000	f	f	\N	grid	40	\N	0.3
\.


--
-- Data for Name: equipment_cost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipment_cost (profile, "300w_solar_panel", "100mah_battery", "500w_inverter", "1000w_inverter", "1500w_inverter") FROM stdin;
default	40	100	100	200	300
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, message, read_status, created_at, username) FROM stdin;
2	30	New order received: 1x battery (100Ah), Total Cost: 100	true	2024-04-02	\N
3	30	New order received: 1x battery (100Ah), Total Cost: 100	true	2024-04-02	\N
6	33	Your order of 1x battery (100Ah) has been submitted, Total Cost: 100	true	2024-04-03	\N
8	33	Your order of 1x panel (100W) has been submitted, Total Cost: 100	true	2024-04-03	\N
10	33	Your order of 1x battery (200Ah) has been submitted, Total Cost: 200	true	2024-04-03	\N
12	33	Your order of 1x inverter (500w) has been submitted, Total Cost: 500	true	2024-04-03	\N
14	33	Your order of 1x inverter (1000w) has been submitted, Total Cost: 500	true	2024-04-03	\N
20	33	Your order of 1x panel (200W) has been submitted, Total Cost: 300	false	2024-04-04	\N
16	33	Your order of 2x panel (200W) has been submitted, Total Cost: 600	true	2024-04-04	\N
9	32	New order received: 1x battery (200Ah), Total Cost: 200	true	2024-04-03	\N
7	32	New order received: 1x panel (100W), Total Cost: 100	true	2024-04-03	\N
13	32	New order received: 1x inverter (1000w), Total Cost: 500	true	2024-04-03	\N
5	32	New order received: 1x battery (100Ah), Total Cost: 100	true	2024-04-03	\N
11	32	New order received: 1x inverter (500w), Total Cost: 500	true	2024-04-03	\N
19	32	New order received: 1x panel (200W), Total Cost: 300	true	2024-04-04	\N
17	32	New order received: 1x inverter (1500W), Total Cost: 1000	true	2024-04-04	\N
15	32	New order received: 2x panel (200W), Total Cost: 600	true	2024-04-04	\N
18	17	Your order of 1x inverter (1500W) has been submitted, Total Cost: 1000	true	2024-04-04	\N
4	17	Your order of 1x battery (100Ah) has been submitted, Total Cost: 100	true	2024-04-02	\N
21	30	New order received: 2x inverter (1500W), Total Cost: 2000	false	2024-04-19	\N
22	17	Your order of 2x inverter (1500W) has been submitted, Total Cost: 2000	true	2024-04-19	\N
23	32	New order received: 1x battery (200Ah), Total Cost: 400	false	2024-04-24	\N
25	31	New order received: 1x panel (300W), Total Cost: 200	false	2024-05-07	\N
26	17	Your order of 1x panel (300W) has been submitted, Total Cost: 200	true	2024-05-07	\N
24	17	Your order of 1x battery (200Ah) has been submitted, Total Cost: 400	true	2024-04-24	\N
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, equipment_type, specification, quantity, client_id, order_cost, supplier_username) FROM stdin;
1	battery	100Ah	1	17	\N	ex@example.com
2	inverter	500w	1	17	500	ex@example.com
3	panel	200W	1	17	300	ex@example.com
4	panel	200W	1	17	300	ex@example.com
5	battery	100Ah	1	17	100	ex@example.com
6	inverter	1500W	1	17	2000	ray@example.com
7	panel	100W	1	17	100	ray@example.com
8	inverter	500w	1	17	500	ex@example.com
9	battery	100Ah	1	17	100	ex@example.com
10	inverter	500w	1	17	500	ex@example.com
11	panel	100W	1	17	100	ex@example.com
12	battery	100Ah	1	17	100	ex@example.com
13	battery	100Ah	1	17	100	ex@example.com
14	battery	100Ah	1	17	100	ex@example.com
15	battery	100Ah	1	17	100	ex@example.com
16	battery	100Ah	1	17	100	ex@example.com
17	battery	100Ah	1	33	100	lubowaspl@gmail.com
18	panel	100W	1	33	100	lubowaspl@gmail.com
19	battery	200Ah	1	33	200	lubowaspl@gmail.com
20	inverter	500w	1	33	500	lubowaspl@gmail.com
21	inverter	1000w	1	33	500	lubowaspl@gmail.com
22	panel	200W	2	33	600	lubowaspl@gmail.com
23	inverter	1500W	1	17	1000	lubowaspl@gmail.com
24	panel	200W	1	33	300	lubowaspl@gmail.com
25	inverter	1500W	2	17	2000	ex@example.com
26	battery	200Ah	1	17	400	lubowaspl@gmail.com
27	panel	300W	1	17	200	ray@example.com
\.


--
-- Data for Name: supplier_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_products (supplier_id, equipment_type, battery_specification, inverter_specification, unit_cost, quantity, panel_specification) FROM stdin;
30	battery	200Ah	\N	200	2	\N
31	inverter	\N	1500W	2000	1	\N
32	battery	100Ah	\N	250	5	\N
32	battery	200Ah	\N	400	5	\N
32	inverter	\N	500w	150	10	\N
32	inverter	\N	1000w	500	5	\N
32	inverter	\N	1500W	1000	5	\N
30	inverter	\N	500w	500	13	\N
30	panel	\N	\N	200	5	300W
30	inverter	\N	1000w	2000	12	\N
30	battery	100Ah	\N	100	2	\N
\.


--
-- Data for Name: system_recommendation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_recommendation (id, panels, batteries, inverter_size, user_id, daily_energy_requirement) FROM stdin;
309	1	1	301	23	1
634	2	3	4350	34	3
946	2	3	3901	35	3
428	2	4	5775	33	4
143	3	6	7584	17	6
1001	1	1	489	37	1
1015	2	3	4350	38	3
1026	1	1	864	39	1
1068	1	1	564	40	1
979	2	3	3825	36	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, firstname, lastname, username, password, user_type) FROM stdin;
18	jerry	rice	jerry@example.com	$2b$10$tjkoLo/imWYLY/Oo5WaSGu8VX0y/1PLRVLcPSPy13N9yUASCLsQkC	client
23	eric	page	eric@example.com	$2b$10$eX7MHa8iWkohWWb8zlTC4.kBmhUyLj6MPM5vAUoFVmpX0dUIQ8Gb.	client
28	hey	you	hey@example.com	$2b$10$.y2WAmFjPIfFMOkHvM5udO5a88.9RXlmSPhwJS646oGqhiJ7h04uu	client
29	boo	chr	boo@eample.com	$2b$10$cxw6Pq7yrddwmUtTlVw08uVOoL9ppZ6wCuhBGfkKxeBTPAXUN9QZ.	supplier
31	ray	pac	ray@example.com	$2b$10$CPMjgT/TGYeeI5ffI4Q4YeCS3xWMP31cpRVrEmMpRbT0i9CNhhoFu	supplier
32	Jack	Baeur	lubowaspl@gmail.com	$2b$10$QDNo04FvvOgsJzvgZ3ATOeHPl741iIzuQNB/OhJokVLbmp8/HK8LW	supplier
33	Simon	Peter	karx_lps@yahoo.com	$2b$10$Vbgm3wPzoTG8zsK8PNHIbeWINtfXpko./zJWZ/pWwsQszgXddzsVW	client
17	Jana	Fred	jane@example.com	$2b$10$7uxmRKVN/m9HochD0C8SP.rsiHnareSLrkd7qnr9nLEL64nUaa9qq	client
34	colin	cowherd	colin@example.com	$2b$10$r/qAFdflOvcvifeKQ8NDI.pIX0e3zlhKAwru8D59Vxpx3uWkFp40S	client
35	Bod	Stocks	stock@example.com	$2b$10$l3QdNEuoXOPc2R/c8P2Q4uDUp8cTbzKrJJQ6730DtbEWMXNfVtrGm	client
36	Jack	Strange	Jack@example.com	$2b$10$9PBXFvRC9Jf6XhwheASWrePTllmdluzAsrzhVFNoTVaLV44air1Ly	client
37	dree	breee	dree@example.com	$2b$10$VotsmbwbkV0IqH5RSVT2ce9BgRv5L93piqWiLlfGjVgpUDP6mgTHK	client
38	phil	Dung	phil@example.com	$2b$10$b96zUhlDEZP9GG3qqnRERuFPMDQcPf1PgrCQFdW2afSoNe/gE5q7i	client
39	grac	nono	grac@example.com	$2b$10$aC4BiLNW9BVP266ZgF4/x.QWF4GutWwc7iZs7NbTDz6PQ9Qh7vvrO	client
30	ex	boy	ex@example.com	$2b$10$4ACEXFVgvenHRMSfyonxs.JQLKwT35Y3MrZApTL3r9AUaaDF2BzJC	supplier
40	Klus	Holger	klus@renewapp.com	$2b$10$7dGlrW9SsmuL5axF86ZiKeT16wzShj74fbLmzQ4c2AKfFyX.5DMOq	client
\.


--
-- Name: energy_consumption_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.energy_consumption_id_seq', 26, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 26, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 27, true);


--
-- Name: system_recommendation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_recommendation_id_seq', 1080, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 40, true);


--
-- Name: energy_consumption energy_consumption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumption
    ADD CONSTRAINT energy_consumption_pkey PRIMARY KEY (id);


--
-- Name: equipment_cost equipment_cost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_cost
    ADD CONSTRAINT equipment_cost_pkey PRIMARY KEY (profile);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: system_recommendation system_recommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_recommendation
    ADD CONSTRAINT system_recommendation_pkey PRIMARY KEY (id);


--
-- Name: system_recommendation system_recommendation_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_recommendation
    ADD CONSTRAINT system_recommendation_user_id_key UNIQUE (user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: supplier_products supplier_products_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_products
    ADD CONSTRAINT supplier_products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: system_recommendation system_recommendation_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_recommendation
    ADD CONSTRAINT system_recommendation_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: energy_consumption user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumption
    ADD CONSTRAINT "user" FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

