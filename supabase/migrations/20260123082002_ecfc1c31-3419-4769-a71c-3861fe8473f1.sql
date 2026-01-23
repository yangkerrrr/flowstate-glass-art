-- Add RLS policy to allow users to view only their own orders
CREATE POLICY "Users can view own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.email() = user_email);

-- Add explicit deny policy for direct INSERT (orders must be created via edge functions with service role)
CREATE POLICY "No direct order insertion"
ON public.orders
FOR INSERT
WITH CHECK (false);