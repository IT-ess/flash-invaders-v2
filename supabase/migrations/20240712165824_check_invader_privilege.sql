set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_invader_privilege(profile_id uuid, invader_id integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    column_name text;
    value integer;
BEGIN
        EXECUTE format('SELECT %I FROM profiles WHERE id = $1', 'inv' || invader_id) INTO value USING profile_id;
    RETURN value;
END;
$function$
;


