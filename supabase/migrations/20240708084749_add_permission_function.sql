set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_invader_permission(user_id_input uuid, invader_id integer, permission_level integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
  DECLARE
  column_name TEXT;
  sql TEXT;
  BEGIN

  column_name := 'inv' || invader_id;

  sql := 'UPDATE profiles SET ' || quote_ident(column_name) || ' = $1 WHERE id = $2';

  EXECUTE sql USING permission_level, user_id_input;

  END;
$function$
;


