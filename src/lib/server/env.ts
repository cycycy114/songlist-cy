import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { BackendMode } from '$lib/types';

export const hasSupabaseConfig = () =>
  Boolean(
    publicEnv.PUBLIC_SUPABASE_URL &&
      publicEnv.PUBLIC_SUPABASE_ANON_KEY &&
      privateEnv.SUPABASE_SERVICE_ROLE_KEY
  );

export const getBackendMode = (): BackendMode => (hasSupabaseConfig() ? 'supabase' : 'memory');

export const getSupabaseConfig = () => ({
  url: publicEnv.PUBLIC_SUPABASE_URL!,
  anonKey: publicEnv.PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: privateEnv.SUPABASE_SERVICE_ROLE_KEY!
});
