import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const requireEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`${name} must be configured.`);
  }

  return value;
};

export const getSupabaseConfig = () => ({
  url: requireEnv(publicEnv.PUBLIC_SUPABASE_URL, 'PUBLIC_SUPABASE_URL'),
  publishableKey: requireEnv(publicEnv.PUBLIC_SUPABASE_PUBLISHABLE_KEY, 'PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
  serviceRoleKey: requireEnv(privateEnv.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY')
});
