set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.count_found_invaders(profile_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    column_name text;
    value integer;
    positive_count integer := 0;
BEGIN
    FOR i IN 0..11 LOOP
        EXECUTE format('SELECT %I FROM profiles WHERE id = $1', 'inv' || i) INTO value USING profile_id;
        IF value > 0 THEN
            positive_count := positive_count + 1;
        END IF;
    END LOOP;
    RETURN positive_count;
END;
$function$
;


