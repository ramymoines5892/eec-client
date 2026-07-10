-- Restrict SECURITY DEFINER functions so anon cannot execute them directly.
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- has_role stays callable by authenticated users (used inside RLS policies).
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;