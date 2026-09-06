import { supabase, isConfigured } from './supabase';

// ============================================================
// AUTH HELPERS
// ============================================================

export async function signUp(email, password, nombre) {
  if (!isConfigured()) return { user: null, error: 'Supabase no configurado' };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre },
    },
  });

  if (error) return { user: null, error: error.message };

  // Create profile
  if (data.user) {
    await supabase.from('perfiles').insert({
      id: data.user.id,
      nombre,
      email,
    });
  }

  return { user: data.user, error: null };
}

export async function signIn(email, password) {
  if (!isConfigured()) return { user: null, error: 'Supabase no configurado' };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

export async function signOut() {
  if (!isConfigured()) return;
  await supabase.auth.signOut();
}

export async function getSession() {
  if (!isConfigured()) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser() {
  if (!isConfigured()) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export function onAuthChange(callback) {
  if (!isConfigured()) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

// Get user profile with partner info
export async function getUserProfile(userId) {
  if (!isConfigured()) return null;

  const { data } = await supabase
    .from('perfiles')
    .select('*, parejas(*)')
    .eq('id', userId)
    .single();

  return data;
}
