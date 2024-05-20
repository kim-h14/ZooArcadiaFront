--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5
-- Dumped by pg_dump version 15.5

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

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: animal_state_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.animal_state_enum AS ENUM (
    'sain',
    'malade',
    'blessé',
    'autre'
);


ALTER TYPE public.animal_state_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    email character varying(255) NOT NULL,
    CONSTRAINT account_role_check CHECK (((role)::text = ANY ((ARRAY['Vétérinaire'::character varying, 'Employé'::character varying])::text[])))
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: account_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_user_id_seq OWNER TO postgres;

--
-- Name: account_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_user_id_seq OWNED BY public.account.user_id;


--
-- Name: animal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.animal (
    animal_id integer NOT NULL,
    animal_name character varying(50) NOT NULL,
    animal_species character varying(100) NOT NULL,
    habitat_name character varying(50)
);


ALTER TABLE public.animal OWNER TO postgres;

--
-- Name: animal_animal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.animal_animal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.animal_animal_id_seq OWNER TO postgres;

--
-- Name: animal_animal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.animal_animal_id_seq OWNED BY public.animal.animal_id;


--
-- Name: foodrecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foodrecord (
    food_record_id integer NOT NULL,
    animal_name character varying(50) NOT NULL,
    username character varying(50),
    date date NOT NULL,
    food_type text NOT NULL,
    food_quantity integer NOT NULL
);


ALTER TABLE public.foodrecord OWNER TO postgres;

--
-- Name: foodrecord_food_record_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.foodrecord_food_record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.foodrecord_food_record_id_seq OWNER TO postgres;

--
-- Name: foodrecord_food_record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.foodrecord_food_record_id_seq OWNED BY public.foodrecord.food_record_id;


--
-- Name: habitat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habitat (
    habitat_id integer NOT NULL,
    habitat_name character varying(255) NOT NULL,
    habitat_description text NOT NULL
);


ALTER TABLE public.habitat OWNER TO postgres;

--
-- Name: habitat_habitat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habitat_habitat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.habitat_habitat_id_seq OWNER TO postgres;

--
-- Name: habitat_habitat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habitat_habitat_id_seq OWNED BY public.habitat.habitat_id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    review_id integer NOT NULL,
    review_text text NOT NULL,
    review_approved boolean,
    city character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    client_name character varying(100) NOT NULL
);


ALTER TABLE public.review OWNER TO postgres;

--
-- Name: review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_review_id_seq OWNER TO postgres;

--
-- Name: review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;


--
-- Name: service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service (
    service_id integer NOT NULL,
    service_name character varying(255) NOT NULL,
    service_description text NOT NULL
);


ALTER TABLE public.service OWNER TO postgres;

--
-- Name: service_service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_service_id_seq OWNER TO postgres;

--
-- Name: service_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_service_id_seq OWNED BY public.service.service_id;


--
-- Name: vethabitatcomment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vethabitatcomment (
    vet_habitat_comment_id integer NOT NULL,
    username character varying(50),
    habitat_name character varying(255) NOT NULL,
    date date NOT NULL,
    vet_comment text NOT NULL
);


ALTER TABLE public.vethabitatcomment OWNER TO postgres;

--
-- Name: vethabitatcomment_vet_habitat_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vethabitatcomment_vet_habitat_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vethabitatcomment_vet_habitat_comment_id_seq OWNER TO postgres;

--
-- Name: vethabitatcomment_vet_habitat_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vethabitatcomment_vet_habitat_comment_id_seq OWNED BY public.vethabitatcomment.vet_habitat_comment_id;


--
-- Name: vetreport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vetreport (
    vet_report_id integer NOT NULL,
    animal_name character varying(50) NOT NULL,
    username character varying(50),
    date date NOT NULL,
    animal_state public.animal_state_enum NOT NULL,
    food_type text NOT NULL,
    food_quantity integer NOT NULL,
    detail_animal_state text
);


ALTER TABLE public.vetreport OWNER TO postgres;

--
-- Name: vetreport_vet_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vetreport_vet_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vetreport_vet_report_id_seq OWNER TO postgres;

--
-- Name: vetreport_vet_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vetreport_vet_report_id_seq OWNED BY public.vetreport.vet_report_id;


--
-- Name: account user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN user_id SET DEFAULT nextval('public.account_user_id_seq'::regclass);


--
-- Name: animal animal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.animal ALTER COLUMN animal_id SET DEFAULT nextval('public.animal_animal_id_seq'::regclass);


--
-- Name: foodrecord food_record_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foodrecord ALTER COLUMN food_record_id SET DEFAULT nextval('public.foodrecord_food_record_id_seq'::regclass);


--
-- Name: habitat habitat_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitat ALTER COLUMN habitat_id SET DEFAULT nextval('public.habitat_habitat_id_seq'::regclass);


--
-- Name: review review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);


--
-- Name: service service_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service ALTER COLUMN service_id SET DEFAULT nextval('public.service_service_id_seq'::regclass);


--
-- Name: vethabitatcomment vet_habitat_comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vethabitatcomment ALTER COLUMN vet_habitat_comment_id SET DEFAULT nextval('public.vethabitatcomment_vet_habitat_comment_id_seq'::regclass);


--
-- Name: vetreport vet_report_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vetreport ALTER COLUMN vet_report_id SET DEFAULT nextval('public.vetreport_vet_report_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (user_id, username, password, role, email) FROM stdin;
17	Jessy	$2b$10$TDWzD.xJvsGTOLurI08hZuTTiOLrAz4NSoddxxsCJMBhlirV52z0q	Vétérinaire	jessy@test.com
18	Bernard	$2b$10$r3USi4JTpFVXo9xHg9K/7OehA7ELauAW3d2odiaX0uEQupwlu9E8a	Employé	bernard@test.com
19	Charlène	$2b$10$SNLtELCJe0gfStnzO5e5sOxRltzPBRfcEjNGFutDq1LVV6BamjGIq	Vétérinaire	charlene@test.com
20	Brigitte	$2b$10$dR7keO44vaKTB6lx5U8nIOY1RHwraJyqQflw27b1VtesLBpCUDlaG	Employé	brigitte@test.com
21	Isabelle	$2b$10$l89HvSUY.30sFZcT14fPqeOPEXvrGeZelNTgwoYPTS3byGf3uMSiW	Vétérinaire	isa@test.com
22	Kim	$2b$10$lsp9wa2.tP7Di5mBu.UGaOlzp9YbFqnf38qx06.JBgMjSl3MQCb3m	Vétérinaire	kim@test.com
23	Fati	$2b$10$5juryq4pVOOkn20VvyblDOM.kCfdgMLf883orlrKoOGnJI9H.KwXe	Vétérinaire	fati@test.com
24	JF	$2b$10$gTV76CPYwzoDj8D5zBjaDeSgF3zhfQp4CQWk4gE/IdVhfyR.z1o6u	Employé	jf@test.com
25	Pierre	$2b$10$cABCO8XqpCST/kwMkFG/EeZHpe32KxWfiP6LysBCRMMd8KyYc0CzO	Employé	pierre@test.com
26	Marc	$2b$10$iFoirg4qTDGVGY8vH0PGqeTm7jSCKNjbAQq0uGFTXTpyHJxhIZZfq	Vétérinaire	marc@test.com
27	Greg	$2b$10$ylMTSV3xxa08kRI6GheClO.CcyNFkwV47vPxdEXRzTjtjLQNFuoIm	Employé	greg@test.com
\.


--
-- Data for Name: animal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.animal (animal_id, animal_name, animal_species, habitat_name) FROM stdin;
2	Biscotto	Chimpanzé	Jungle
3	Flash	Paresseux	Jungle
4	Kala	Gorille	Jungle
5	King Julien	Lémurien	Jungle
6	Spotty	Jaguar	Jungle
7	Tigroo	Tigre	Jungle
8	Dumbo	Éléphant d'Afrique	Savane
9	Pencil	Autruche	Savane
11	Slimy	Hippopotame	Savane
10	Simba	Lion	Savane
12	Sophie	Girafe	Savane
13	Zoom	Guépard	Savane
14	Alaska	Castor	Marais
15	Croc	Crocodile	Marais
16	Ducky	Canard sauvage	Marais
17	Otty	Loutre	Marais
18	Webfoot	Cygne tuberculé	Marais
21	test modification 1	test modif	Savane
19	test animal sanitize	test animal sanitize	Jungle
\.


--
-- Data for Name: foodrecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.foodrecord (food_record_id, animal_name, username, date, food_type, food_quantity) FROM stdin;
3	Flash	\N	2024-12-04	Feuilles	700
4	Kala	\N	2024-12-04	Fruits	1000
5	Tigroo	\N	2024-12-04	Viande	2000
7	Croc	\N	2024-05-19	Viande	3000
\.


--
-- Data for Name: habitat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.habitat (habitat_id, habitat_name, habitat_description) FROM stdin;
2	Savane	Dans notre habitat savane, plongez au cœur des vastes plaines africaines où les horizons infinis se mêlent à la vie sauvage. Sous le soleil ardent, découvrez une diversité extraordinaire d'animaux emblématiques, des majestueux lions aux éléphants imposants, en passant par les élégantes girafes. Parcourez des sentiers bordés d'acacias, où le vent murmure à travers les herbes dorées et où les antilopes bondissent gracieusement. L'atmosphère résonne des bruits de la savane, des rugissements lointains aux sons des animaux en mouvement. Plongez dans l'essence même de l'Afrique au cœur de notre habitat savane, où chaque instant vous transporte dans un monde d'aventure et de découverte.
3	Marais	Dans notre habitat marais, explorez les mystères des terres humides où la vie foisonne dans un écosystème unique. Entre les roseaux ondulants et les étendues d'eau tranquille, découvrez une diversité fascinante d'espèces, des énigmatiques alligators aux travailleurs infatigables que sont les castors. Parcourez des sentiers en bois sur pilotis, offrant des vues imprenables sur les marécages et les habitants qui les peuplent. L'air est chargé d'humidité et de vie, rempli des sons apaisants des canards sauvages et des majestueux cygnes tuberculés glissant gracieusement sur les eaux calmes. Immergez-vous dans ce monde envoûtant au cœur de notre habitat marais, où chaque instant révèle une nouvelle facette de cet écosystème fragile et fascinant.
1	Jungle	Dans notre habitat jungle exotique, plongez au cœur de la luxuriante végétation tropicale où les mystères de la jungle s'animent. Entre les frondaisons denses et les lianes pendantes, découvrez une multitude d'espèces fascinantes, des singes espiègles aux majestueux félins. Marchez sur des sentiers sinueux, traversant des ruisseaux murmureurs et des cascades rafraîchissantes. L'air est vibrant de vie, rempli des sons envoûtants de la faune et de la flore de la jungle. Une immersion sensorielle inoubliable vous attend au cœur de notre habitat jungle, où chaque coin réserve une nouvelle surprise de ce monde sauvage et exotique.
5	Test habitat modification 1	Test habitat 2 modification 1
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review (review_id, review_text, review_approved, city, email, client_name) FROM stdin;
7	Ma visite au zoo Arcadia a été une expérience captivante et mémorable. Dès mon arrivée, j'ai été impressionné par la variété des espèces animales présentées et par la qualité des installations. Les habitats sont spacieux et bien entretenus, offrant aux animaux un environnement proche de leur habitat naturel.\n\nJ'ai particulièrement apprécié les efforts de conservation du zoo, visibles à travers les programmes de reproduction et de réintroduction des espèces menacées. Cela témoigne de l'engagement du zoo envers la préservation de la biodiversité.	t	Paris	jean@test.com	Jean
5	Super zoo. La visite guidée avec soigneur est géniale.	t	Tournefeuille	domi@test.com	Dominique
6	On s'est bien amusé. Le petit train est top quand les enfants en ont marre de marcher.	t	Lile	clara@test.com	Clara
8	TOP. LES ANIMAUX SONT MAGNIFIQUES	t	Marseille	mathieu@test.com	Mathieu
9	balhbforaefdbla	t	Lyon	damien@test.com	Damien
11	Le zoo Arcadia est magnifique. Les animaux sont heureux et les habitats très bien entretenu.	\N	Toulouse	marie@test.com	Marie
\.


--
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service (service_id, service_name, service_description) FROM stdin;
1	Restaurants	Découvrez une expérience culinaire unique au Zoo Arcadia avec nos trois restaurants situés dans différents habitats. Que vous soyez amateur de cuisine asiatique, du sud des États-Unis ou de mets à emporter, il y en a pour tous les goûts au Zoo Arcadia !
2	Visite Guidée	Nous sommes fiers d'offrir à nos visiteurs la possibilité de participer à quatre visites guidées gratuites par jour, menées par nos soigneurs expérimentés. Lors de ces visites, nos soigneurs partagent leurs connaissances approfondies sur nos animaux et leurs habitats, offrant ainsi une expérience enrichissante et éducative.\n\nLes avantages de participer à une visite guidée avec un soigneur sont nombreux. Tout d'abord, vous avez l'opportunité de poser des questions directement à un professionnel passionné par les animaux, ce qui vous permet d'en apprendre davantage sur nos espèces et sur les efforts de conservation que nous menons. De plus, nos soigneurs vous fournissent des informations exclusives et des anecdotes fascinantes sur nos résidents, vous permettant ainsi de découvrir des détails que vous n'auriez peut-être pas remarqués par vous-même.\n\nEn participant à nos visites guidées, vous avez également la chance d'observer nos animaux dans leur environnement naturel tout en bénéficiant d'un aperçu privilégié de leur comportement et de leurs interactions. C'est une expérience unique qui vous permet de développer une connexion plus profonde avec la nature et de repartir avec des souvenirs inoubliables de votre visite au Zoo Arcadia.
3	Notre Petit Train	Au Zoo Arcadia, nous offrons à nos visiteurs une expérience de découverte unique avec notre petit train. Avec des gares situées dans chaque habitat, notre train vous permet de vous déplacer facilement à travers le parc tout en profitant de vues magnifiques sur nos animaux et leurs habitats naturels.\n\nNous proposons deux options de billets pour notre train. Le premier est un billet pour la journée, qui vous donne un accès illimité au train pendant toute la durée de votre visite, vous permettant d'explorer tous les habitats à votre rythme. Alternativement, vous pouvez choisir un billet avec un trajet particulier, idéal si vous préférez une expérience plus ciblée ou si vous avez peu de temps.\n\nQuel que soit votre choix, notre petit train est un moyen pratique et pittoresque de découvrir les merveilles de notre parc animalier, offrant une expérience inoubliable pour les visiteurs de tous âges.
5	Test redirection	Test redirection
9	Test modificaiton1	Test modification 1
7	Test modification employé	Test modification employé 1
6	Test sanitize 1	Test sanitize 1
\.


--
-- Data for Name: vethabitatcomment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vethabitatcomment (vet_habitat_comment_id, username, habitat_name, date, vet_comment) FROM stdin;
2	\N	Marais	2024-12-04	Test qualité eau OK
3	\N	Jungle	2024-12-04	Demander au jardinier de vérifier la santé des palmiers de la zone 1
7	\N	Savane	2024-12-05	Verif points d'eau ok
\.


--
-- Data for Name: vetreport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vetreport (vet_report_id, animal_name, username, date, animal_state, food_type, food_quantity, detail_animal_state) FROM stdin;
1	Flash	\N	2024-12-04	sain	Feuilles	700	Tout va bien
2	Biscotto	\N	2024-12-04	sain	Fruits	1000	Tout va bien
\.


--
-- Name: account_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_user_id_seq', 27, true);


--
-- Name: animal_animal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.animal_animal_id_seq', 22, true);


--
-- Name: foodrecord_food_record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.foodrecord_food_record_id_seq', 7, true);


--
-- Name: habitat_habitat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habitat_habitat_id_seq', 6, true);


--
-- Name: review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_review_id_seq', 11, true);


--
-- Name: service_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_service_id_seq', 12, true);


--
-- Name: vethabitatcomment_vet_habitat_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vethabitatcomment_vet_habitat_comment_id_seq', 7, true);


--
-- Name: vetreport_vet_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vetreport_vet_report_id_seq', 2, true);


--
-- Name: account account_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);


--
-- Name: account account_password_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_password_key UNIQUE (password);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (user_id);


--
-- Name: animal animal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT animal_pkey PRIMARY KEY (animal_id);


--
-- Name: foodrecord foodrecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foodrecord
    ADD CONSTRAINT foodrecord_pkey PRIMARY KEY (food_record_id);


--
-- Name: habitat habitat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitat
    ADD CONSTRAINT habitat_pkey PRIMARY KEY (habitat_id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- Name: service service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT service_pkey PRIMARY KEY (service_id);


--
-- Name: animal unique_animal_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT unique_animal_name UNIQUE (animal_name);


--
-- Name: account unique_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: habitat unique_habitat_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitat
    ADD CONSTRAINT unique_habitat_name UNIQUE (habitat_name);


--
-- Name: account unique_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: vethabitatcomment vethabitatcomment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vethabitatcomment
    ADD CONSTRAINT vethabitatcomment_pkey PRIMARY KEY (vet_habitat_comment_id);


--
-- Name: vetreport vetreport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vetreport
    ADD CONSTRAINT vetreport_pkey PRIMARY KEY (vet_report_id);


--
-- Name: animal animal_habitat_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT animal_habitat_name_fkey FOREIGN KEY (habitat_name) REFERENCES public.habitat(habitat_name);


--
-- Name: foodrecord foodrecord_animal_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foodrecord
    ADD CONSTRAINT foodrecord_animal_name_fkey FOREIGN KEY (animal_name) REFERENCES public.animal(animal_name);


--
-- Name: foodrecord foodrecord_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foodrecord
    ADD CONSTRAINT foodrecord_username_fkey FOREIGN KEY (username) REFERENCES public.account(username) ON DELETE SET NULL;


--
-- Name: vethabitatcomment vethabitatcomment_habitat_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vethabitatcomment
    ADD CONSTRAINT vethabitatcomment_habitat_name_fkey FOREIGN KEY (habitat_name) REFERENCES public.habitat(habitat_name);


--
-- Name: vethabitatcomment vethabitatcomment_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vethabitatcomment
    ADD CONSTRAINT vethabitatcomment_username_fkey FOREIGN KEY (username) REFERENCES public.account(username) ON DELETE SET NULL;


--
-- Name: vetreport vetreport_animal_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vetreport
    ADD CONSTRAINT vetreport_animal_name_fkey FOREIGN KEY (animal_name) REFERENCES public.animal(animal_name);


--
-- Name: vetreport vetreport_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vetreport
    ADD CONSTRAINT vetreport_user_id_fkey FOREIGN KEY (username) REFERENCES public.account(username) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

