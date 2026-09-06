import { supabase, isConfigured } from './supabase';

// ============================================================
// RESPUESTAS
// ============================================================

export async function saveAnswer(userId, parejaId, dia, preguntaIndex, respuesta) {
  if (!isConfigured()) return null;

  const { data, error } = await supabase
    .from('respuestas')
    .upsert({
      usuario_id: userId,
      pareja_id: parejaId,
      dia,
      pregunta_index: preguntaIndex,
      respuesta,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'usuario_id,pareja_id,dia,pregunta_index',
    })
    .select()
    .single();

  return { data, error };
}

export async function getAnswers(userId, parejaId, dia) {
  if (!isConfigured()) return [];

  const { data } = await supabase
    .from('respuestas')
    .select('*')
    .eq('usuario_id', userId)
    .eq('pareja_id', parejaId)
    .eq('dia', dia);

  return data || [];
}

export async function getPartnerAnswers(userId, parejaId, dia) {
  if (!isConfigured()) return [];

  const { data } = await supabase
    .from('respuestas')
    .select('*')
    .neq('usuario_id', userId)
    .eq('pareja_id', parejaId)
    .eq('dia', dia);

  return data || [];
}

// ============================================================
// PUNTUACIONES
// ============================================================

export async function saveScore(userId, parejaId, dia, puntuacion) {
  if (!isConfigured()) return null;

  const { data, error } = await supabase
    .from('puntuaciones')
    .upsert({
      usuario_id: userId,
      pareja_id: parejaId,
      dia,
      puntuacion,
    }, {
      onConflict: 'usuario_id,pareja_id,dia',
    })
    .select()
    .single();

  return { data, error };
}

export async function getScores(userId, parejaId) {
  if (!isConfigured()) return [];

  const { data } = await supabase
    .from('puntuaciones')
    .select('*')
    .eq('usuario_id', userId)
    .eq('pareja_id', parejaId)
    .order('dia');

  return data || [];
}

// ============================================================
// REFLEXIONES
// ============================================================

export async function saveReflection(userId, parejaId, dia, reflection) {
  if (!isConfigured()) return null;

  const { data, error } = await supabase
    .from('reflexiones')
    .upsert({
      usuario_id: userId,
      pareja_id: parejaId,
      dia,
      como_me_senti: reflection.como_me_senti,
      que_aprendi: reflection.que_aprendi,
      que_quiero_mejorar: reflection.que_quiero_mejorar,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'usuario_id,pareja_id,dia',
    })
    .select()
    .single();

  return { data, error };
}

export async function getReflections(userId, parejaId) {
  if (!isConfigured()) return [];

  const { data } = await supabase
    .from('reflexiones')
    .select('*')
    .eq('usuario_id', userId)
    .eq('pareja_id', parejaId)
    .order('dia');

  return data || [];
}

// ============================================================
// PAREJAS
// ============================================================

export async function linkPartner(codigoInvitacion) {
  if (!isConfigured()) return { data: null, error: 'No configurado' };

  const { data, error } = await supabase.rpc('vincular_pareja', {
    codigo_inv: codigoInvitacion,
  });

  return { data, error: error?.message || null };
}

export async function getPartnerInfo(userId) {
  if (!isConfigured()) return null;

  const { data: pareja } = await supabase
    .from('parejas')
    .select('*')
    .or(`usuario_1.eq.${userId},usuario_2.eq.${userId}`)
    .eq('activo', true)
    .single();

  if (!pareja) return null;

  const partnerId = pareja.usuario_1 === userId ? pareja.usuario_2 : pareja.usuario_1;

  const { data: partner } = await supabase
    .from('perfiles')
    .select('nombre, email')
    .eq('id', partnerId)
    .single();

  return { pareja, partner };
}

// ============================================================
// CÓDIGOS DE ACCESO
// ============================================================

export async function activateCode(codigoTexto) {
  if (!isConfigured()) return { success: false, error: 'No configurado' };

  const { data, error } = await supabase.rpc('activar_codigo', {
    codigo_texto: codigoTexto,
  });

  return { success: !error, error: error?.message || null };
}

export async function generateCodes(count, adminUserId) {
  if (!isConfigured()) return [];

  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = '30DIAS-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    codes.push({
      codigo: code,
      creado_por: adminUserId,
    });
  }

  const { data, error } = await supabase
    .from('codigos_acceso')
    .insert(codes)
    .select();

  return data || [];
}

export async function getAllCodes() {
  if (!isConfigured()) return [];

  const { data } = await supabase
    .from('codigos_acceso')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

// ============================================================
// DÍAS COMPLETADOS
// ============================================================

export async function getCompletedDays(userId, parejaId) {
  if (!isConfigured()) return [];

  const { data } = await supabase
    .from('respuestas')
    .select('dia')
    .eq('usuario_id', userId)
    .eq('pareja_id', parejaId);

  // A day is "completed" if there are at least 5 answers
  const dayCounts = {};
  (data || []).forEach(r => {
    dayCounts[r.dia] = (dayCounts[r.dia] || 0) + 1;
  });

  return Object.entries(dayCounts)
    .filter(([, count]) => count >= 5)
    .map(([dia]) => parseInt(dia));
}
