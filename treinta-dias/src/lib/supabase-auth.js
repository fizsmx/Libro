import { supabase, isConfigured } from './supabase';

// ============================================================
// AUTH HELPERS
// ============================================================

export async function getUserProfile(userId) {
  if (!isConfigured() || !userId) return null;

  try {
    const { data } = await supabase
      .from('perfiles')
      .select('*, parejas(*)')
      .eq('id', userId)
      .maybeSingle();

    return data;
  } catch (e) {
    console.warn('Error fetching profile:', e);
    return null;
  }
}

export async function syncUserSession(supabaseUser) {
  if (!supabaseUser) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user');
    }
    return null;
  }

  const profile = await getUserProfile(supabaseUser.id);
  const nombre = profile?.nombre || supabaseUser.user_metadata?.nombre || supabaseUser.email?.split('@')[0] || 'Usuario';
  const codigoInvitacion = profile?.codigo_invitacion || 'INV-' + supabaseUser.id.substring(0, 6).toUpperCase();
  const tieneAccesoCompleto = profile?.parejas?.tiene_acceso_completo || false;
  const parejaId = profile?.pareja_id || null;
  const esAdmin = profile?.es_admin || (supabaseUser.email?.toLowerCase() === 'fisbert.smx@gmail.com');

  const userData = {
    id: supabaseUser.id,
    email: supabaseUser.email,
    nombre,
    codigo_invitacion: codigoInvitacion,
    tiene_acceso_completo: tieneAccesoCompleto,
    pareja_id: parejaId,
    es_admin: esAdmin,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('demo_user', JSON.stringify(userData));
  }

  return userData;
}

export async function getCurrentUser() {
  if (isConfigured()) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return await syncUserSession(session.user);
      }
    } catch (e) {
      console.warn('Error getting supabase session:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser) {
      try {
        return JSON.parse(demoUser);
      } catch (e) {
        return null;
      }
    }
  }

  return null;
}

export async function signUp(email, password, nombre) {
  if (!isConfigured()) {
    const demoCode = 'INV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const demoUser = {
      email,
      nombre,
      codigo_invitacion: demoCode,
      tiene_acceso_completo: false,
      dia_actual: 1,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
    }
    return { user: demoUser, error: null };
  }

  // 1. Try server-side auto-confirmed signup via API
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nombre }),
    });
    const result = await res.json();

    if (!res.ok) {
      return { user: null, error: result.error || 'Error al registrarse' };
    }

    // If server registration succeeded, immediately log in
    if (result.success && !result.useClientAuth) {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        return { user: null, error: loginError.message };
      }

      const userData = await syncUserSession(loginData.user);
      return { user: userData, error: null };
    }
  } catch (apiErr) {
    console.warn('Register API failed, falling back to client signUp:', apiErr);
  }

  // 2. Client fallback
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre },
    },
  });

  if (error) {
    let msg = error.message;
    if (msg.includes('User already registered')) {
      msg = 'Este correo ya está registrado. Por favor inicia sesión.';
    } else if (msg.includes('rate limit')) {
      msg = 'Límite de solicitudes alcanzado. Espera un momento antes de reintentar.';
    }
    return { user: null, error: msg };
  }

  // If session exists immediately
  if (data.session && data.user) {
    try {
      await supabase.from('perfiles').upsert({
        id: data.user.id,
        nombre,
        email,
        es_admin: email.toLowerCase() === 'fisbert.smx@gmail.com',
      }, { onConflict: 'id' });
    } catch (e) {
      console.warn('Could not insert profile:', e);
    }

    const userData = await syncUserSession(data.user);
    return { user: userData, error: null };
  }

  // Email confirmation required by Supabase
  return {
    user: data.user,
    error: null,
    needsEmailConfirmation: true,
  };
}

export async function signIn(email, password) {
  if (!isConfigured()) {
    const demoUser = {
      email,
      nombre: email.split('@')[0],
      codigo_invitacion: 'INV-DEMO123',
      tiene_acceso_completo: false,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
    }
    return { user: demoUser, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let msg = error.message;
    if (msg.includes('Invalid login credentials')) {
      msg = 'Correo o contraseña incorrectos.';
    } else if (msg.includes('Email not confirmed')) {
      msg = 'Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada o contáctanos por WhatsApp.';
    }
    return { user: null, error: msg };
  }

  const userData = await syncUserSession(data.user);
  return { user: userData, error: null };
}

export async function signOutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('partner_info');
    localStorage.removeItem('admin_auth');
  }
  if (isConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error signing out:', e);
    }
  }
}

export async function signOut() {
  return signOutUser();
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
