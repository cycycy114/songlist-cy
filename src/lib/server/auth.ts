import { createHmac, timingSafeEqual } from 'node:crypto';

import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { createClient } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';

const sessionCookieName = 'songboard_admin_session';
const defaultAdminEmail = 'admin@example.com';
const defaultAdminPassword = 'demo-admin';

type AuthMode = 'demo' | 'supabase';

const signValue = (value: string) =>
  createHmac('sha256', privateEnv.AUTH_SECRET || 'songboard-local-secret').update(value).digest('hex');

const buildCookieValue = () => {
  const payload = `admin:${Date.now()}`;
  const signature = signValue(payload);
  return `${payload}.${signature}`;
};

const hasSupabaseAuth = () =>
  Boolean(
    publicEnv.PUBLIC_SUPABASE_URL &&
      publicEnv.PUBLIC_SUPABASE_ANON_KEY &&
      privateEnv.SUPABASE_SERVICE_ROLE_KEY
  );

export const getAuthMode = (): AuthMode => (hasSupabaseAuth() ? 'supabase' : 'demo');

export const getDemoCredentials = () => ({
  email: privateEnv.ADMIN_EMAIL || defaultAdminEmail,
  password: privateEnv.ADMIN_PASSWORD || defaultAdminPassword
});

export const setAdminSession = (cookies: Cookies) => {
  cookies.set(sessionCookieName, buildCookieValue(), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: privateEnv.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7
  });
};

export const clearAdminSession = (cookies: Cookies) => {
  cookies.delete(sessionCookieName, {
    path: '/'
  });
};

export const verifyAdminSession = (cookies: Cookies) => {
  const raw = cookies.get(sessionCookieName);

  if (!raw) {
    return false;
  }

  const lastDotIndex = raw.lastIndexOf('.');

  if (lastDotIndex === -1) {
    return false;
  }

  const payload = raw.slice(0, lastDotIndex);
  const signature = raw.slice(lastDotIndex + 1);
  const expectedSignature = signValue(payload);
  const encoder = new TextEncoder();

  const left = encoder.encode(signature);
  const right = encoder.encode(expectedSignature);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
};

export const loginAdmin = async ({
  email,
  password
}: {
  email: string;
  password: string;
}): Promise<{ ok: true; mode: AuthMode } | { ok: false; message: string }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!normalizedEmail || !normalizedPassword) {
    return {
      ok: false,
      message: '请填写邮箱和密码。'
    };
  }

  if (hasSupabaseAuth()) {
    const client = createClient(publicEnv.PUBLIC_SUPABASE_URL!, publicEnv.PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const { error } = await client.auth.signInWithPassword({
      email: normalizedEmail,
      password: normalizedPassword
    });

    if (error) {
      return {
        ok: false,
        message: error.message || '管理员登录失败。'
      };
    }

    return {
      ok: true,
      mode: 'supabase'
    };
  }

  const demoCredentials = getDemoCredentials();

  if (
    normalizedEmail !== demoCredentials.email.toLowerCase() ||
    normalizedPassword !== demoCredentials.password
  ) {
    return {
      ok: false,
      message: '演示账号或密码不正确。'
    };
  }

  return {
    ok: true,
    mode: 'demo'
  };
};
