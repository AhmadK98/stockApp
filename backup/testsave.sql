PGDMP                          x            postgres    11.5    12.1 	    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    14007    postgres    DATABASE     z   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
    DROP DATABASE postgres;
                postgres    false            �           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    3837            �            1259    16463    stocks    TABLE       CREATE TABLE public.stocks (
    ticker character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    country character varying(100),
    data jsonb DEFAULT '[]'::jsonb,
    fund character varying(10),
    price numeric,
    currency character varying
);
    DROP TABLE public.stocks;
       public            postgres    false            �          0    16463    stocks 
   TABLE DATA           T   COPY public.stocks (ticker, name, country, data, fund, price, currency) FROM stdin;
    public          postgres    false    198   �       {           2606    16470    stocks stocks_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.stocks
    ADD CONSTRAINT stocks_pkey PRIMARY KEY (ticker);
 <   ALTER TABLE ONLY public.stocks DROP CONSTRAINT stocks_pkey;
       public            postgres    false    198            }           2606    16472    stocks unique_name 
   CONSTRAINT     M   ALTER TABLE ONLY public.stocks
    ADD CONSTRAINT unique_name UNIQUE (name);
 <   ALTER TABLE ONLY public.stocks DROP CONSTRAINT unique_name;
       public            postgres    false    198            �     x���MO�0��/�����-뭆�N�Q�A=���	f�]V�a:�O�>}��VQQY��rH	�f[�sS�Agh�D��@nZĬ�";�������'h�2{�o�,��L�,��.���C̅�O�^@�,r~J�b(ѨC���4����R�	/��t�ޞ�=a���?�ܧ�
vM]�
u�6�>�������Y݉�1�A�I�.BX�4+��y���N�66N���Qz$-�r���s��M��l���R%��7���7@:#{��Gj�A�     