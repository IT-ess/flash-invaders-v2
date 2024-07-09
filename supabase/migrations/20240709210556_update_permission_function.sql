drop function if exists "public"."update_invader_permission"(user_id_input uuid, invader_id integer, permission_level integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_permissions_and_score(user_id_input uuid, invader_id integer, permission_level integer, incremented_score integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    column_name TEXT;
    sql TEXT;
BEGIN
    -- Construct the column name
    column_name := 'inv' || invader_id;

    -- Begin transaction block
    BEGIN
        -- Construct and execute the dynamic SQL statement to update the specified column
        sql := 'UPDATE profiles SET ' || quote_ident(column_name) || ' = $1 WHERE id = $2';
        EXECUTE sql USING permission_level, user_id_input;
        
        -- Update the score column by incrementing its value
        UPDATE profiles
        SET score = score + incremented_score
        WHERE id = user_id_input;
    EXCEPTION
        WHEN others THEN
            -- If any error occurs, raise it
            RAISE NOTICE 'Error updating user: %', SQLERRM;
            -- Optionally, you can RAISE the error if you want the transaction to be aborted
            RAISE;
    END;
END;
$function$
;


