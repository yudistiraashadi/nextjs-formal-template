SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.6 (Ubuntu 15.6-1.pgdg20.04+1)

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '6fb32a61-079e-4322-8f0e-424f8ef4605f', 'authenticated', 'authenticated', 'user@email.com', '$2a$10$lP6HJgd10JVkFP7icaPWMunWX1dem9ZOFPVwAAZj/lUsTQmdMpMRO', '2024-04-18 16:20:11.412049+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-05-20 04:02:10.070372+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-04-18 16:20:11.402706+00', '2024-05-20 04:02:10.073372+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'da01e1d1-c15b-4a5d-b53c-ecdd24d50191', 'authenticated', 'authenticated', 'admin@email.com', '$2a$10$paVugJP.PCrIymVLopAmH.MV8eEhW883VAG3aSr6qSPa7WTOSzPLG', '2024-04-17 07:31:17.581007+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-05-20 04:06:02.906086+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-04-17 07:31:17.578044+00', '2024-05-20 04:06:02.909626+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('da01e1d1-c15b-4a5d-b53c-ecdd24d50191', 'da01e1d1-c15b-4a5d-b53c-ecdd24d50191', '{"sub": "da01e1d1-c15b-4a5d-b53c-ecdd24d50191", "email": "admin@email.com", "email_verified": false, "phone_verified": false}', 'email', '2024-04-17 07:31:17.579359+00', '2024-04-17 07:31:17.579413+00', '2024-04-17 07:31:17.579413+00', '46935330-7e21-4a7f-aa99-d1da68daa2dd'),
	('6fb32a61-079e-4322-8f0e-424f8ef4605f', '6fb32a61-079e-4322-8f0e-424f8ef4605f', '{"sub": "6fb32a61-079e-4322-8f0e-424f8ef4605f", "email": "user@email.com", "email_verified": false, "phone_verified": false}', 'email', '2024-04-18 16:20:11.408183+00', '2024-04-18 16:20:11.408246+00', '2024-04-18 16:20:11.408246+00', '2c67def2-f08b-4e12-8aed-04c7b272d4ff');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "created_at", "name") VALUES
	(1, '2024-04-17 04:49:52.727836+00', 'user'),
	(2, '2024-04-17 04:50:08.505138+00', 'admin');


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profiles" ("id", "created_at", "updated_at", "name", "user_role_id") VALUES
	('da01e1d1-c15b-4a5d-b53c-ecdd24d50191', '2024-04-17 07:31:17.577682+00', '2024-04-17 07:31:17.577682+00', 'Admin', 2),
	('6fb32a61-079e-4322-8f0e-424f8ef4605f', '2024-04-18 16:20:11.402342+00', '2024-04-18 16:20:11.402342+00', 'User', 1);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."user_roles_id_seq"', 2, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
