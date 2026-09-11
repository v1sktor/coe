REVOKE EXECUTE ON FUNCTION public.corregedoria_criar_usuario(text, text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.corregedoria_definir_senha(uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.corregedoria_criar_usuario(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.corregedoria_definir_senha(uuid, text) TO authenticated;