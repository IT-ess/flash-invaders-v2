revoke delete on table "public"."countries" from "anon";

revoke insert on table "public"."countries" from "anon";

revoke references on table "public"."countries" from "anon";

revoke select on table "public"."countries" from "anon";

revoke trigger on table "public"."countries" from "anon";

revoke truncate on table "public"."countries" from "anon";

revoke update on table "public"."countries" from "anon";

revoke delete on table "public"."countries" from "authenticated";

revoke insert on table "public"."countries" from "authenticated";

revoke references on table "public"."countries" from "authenticated";

revoke select on table "public"."countries" from "authenticated";

revoke trigger on table "public"."countries" from "authenticated";

revoke truncate on table "public"."countries" from "authenticated";

revoke update on table "public"."countries" from "authenticated";

revoke delete on table "public"."countries" from "service_role";

revoke insert on table "public"."countries" from "service_role";

revoke references on table "public"."countries" from "service_role";

revoke select on table "public"."countries" from "service_role";

revoke trigger on table "public"."countries" from "service_role";

revoke truncate on table "public"."countries" from "service_role";

revoke update on table "public"."countries" from "service_role";

alter table "public"."countries" drop constraint "countries_pkey";

drop index if exists "public"."countries_pkey";

drop table "public"."countries";

alter table "public"."profiles" drop column "website";

alter table "public"."profiles" add column "inv0" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv1" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv2" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv3" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv4" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv5" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv6" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv7" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv8" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv9" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv10" smallint not null default '0'::smallint;

alter table "public"."profiles" add column "inv11" smallint not null default '0'::smallint;

drop sequence if exists "public"."countries_id_seq";
