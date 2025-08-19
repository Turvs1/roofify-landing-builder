-- Fix critical security vulnerability: Restrict enquiries table access to admin users only

-- First, create user roles system for proper access control
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table to track admin users
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has admin role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_uuid
      AND role = 'admin'
  );
$$;

-- Drop the existing overly permissive enquiries SELECT policy
DROP POLICY IF EXISTS "Allow admin to read enquiries" ON public.enquiries;

-- Create new secure policy that only allows authenticated admin users to read enquiries
CREATE POLICY "Admin users can read enquiries"
ON public.enquiries
FOR SELECT
TO authenticated
USING (public.is_admin_user());

-- Create policy to allow admins to manage user roles
CREATE POLICY "Admin users can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Create policy to allow users to see their own roles
CREATE POLICY "Users can see their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Also secure the bookings table with the same admin-only access
DROP POLICY IF EXISTS "Allow admin to read bookings" ON public.bookings;

CREATE POLICY "Admin users can read bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.is_admin_user());