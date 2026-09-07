import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { email, password, nombre } = await request.json();

    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Create user with email pre-confirmed
      const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nombre },
      });

      if (createError) {
        if (createError.message.includes('already registered') || createError.code === 'email_exists') {
          return NextResponse.json(
            { error: 'Este correo electrónico ya está registrado. Intenta iniciar sesión.' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: createError.message || 'Error al registrar usuario' },
          { status: 400 }
        );
      }

      // Upsert profile
      if (userData?.user) {
        const inviteCode = 'INV-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        await adminClient.from('perfiles').upsert({
          id: userData.user.id,
          nombre,
          email,
          codigo_invitacion: inviteCode,
          es_admin: email.toLowerCase() === 'fisbert.smx@gmail.com',
        }, { onConflict: 'id' });
      }

      return NextResponse.json({ success: true, user: userData.user });
    }

    // Fallback if service role key is not configured on server
    return NextResponse.json({ success: true, useClientAuth: true });
  } catch (err) {
    console.error('Registration server error:', err);
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
