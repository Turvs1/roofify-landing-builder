-- Fix security linter warnings for functions

-- Update is_admin_user function to fix search path security warning
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_uuid
      AND role = 'admin'
  );
$$;

-- Update handle_form_submission function to fix search path security warning  
CREATE OR REPLACE FUNCTION public.handle_form_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the submission
  PERFORM pg_notify('form_submission', json_build_object(
    'table', TG_TABLE_NAME,
    'type', TG_OP,
    'id', NEW.id,
    'record', row_to_json(NEW)
  )::text);
  
  RETURN NEW;
END;
$$;