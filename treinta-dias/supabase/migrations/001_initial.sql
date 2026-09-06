-- ============================================================
-- 30 DÍAS PARA RECONECTAR — Supabase Schema
-- ============================================================

-- 1. PAREJAS (crear primero para evitar dependencia circular)
CREATE TABLE IF NOT EXISTS public.parejas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_1 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usuario_2 UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  dia_actual INTEGER DEFAULT 1,
  activo BOOLEAN DEFAULT TRUE,
  tiene_acceso_completo BOOLEAN DEFAULT FALSE,
  codigo_acceso_usado TEXT,
  fecha_inicio DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PERFILES DE USUARIO
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  pareja_id UUID REFERENCES public.parejas(id),
  codigo_invitacion TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  es_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CÓDIGOS DE ACCESO (monetización)
CREATE TABLE IF NOT EXISTS public.codigos_acceso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  usado_por UUID REFERENCES public.parejas(id),
  precio_bs NUMERIC(10,2) DEFAULT 70.00,
  creado_por UUID REFERENCES auth.users(id),
  fecha_uso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESPUESTAS (privadas por usuario)
CREATE TABLE IF NOT EXISTS public.respuestas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pareja_id UUID NOT NULL REFERENCES public.parejas(id) ON DELETE CASCADE,
  dia INTEGER NOT NULL CHECK (dia BETWEEN 1 AND 30),
  pregunta_index INTEGER NOT NULL CHECK (pregunta_index BETWEEN 0 AND 9),
  respuesta TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(usuario_id, pareja_id, dia, pregunta_index)
);

-- 5. PUNTUACIONES DE CONEXIÓN (escala 1-10)
CREATE TABLE IF NOT EXISTS public.puntuaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pareja_id UUID NOT NULL REFERENCES public.parejas(id) ON DELETE CASCADE,
  dia INTEGER NOT NULL CHECK (dia BETWEEN 1 AND 30),
  puntuacion INTEGER NOT NULL CHECK (puntuacion BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(usuario_id, pareja_id, dia)
);

-- 6. REFLEXIONES DIARIAS
CREATE TABLE IF NOT EXISTS public.reflexiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pareja_id UUID NOT NULL REFERENCES public.parejas(id) ON DELETE CASCADE,
  dia INTEGER NOT NULL CHECK (dia BETWEEN 1 AND 30),
  como_me_senti TEXT,
  que_aprendi TEXT,
  que_quiero_mejorar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(usuario_id, pareja_id, dia)
);

-- 7. CONFIGURACIÓN GLOBAL
CREATE TABLE IF NOT EXISTS public.configuracion (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuración por defecto
INSERT INTO public.configuracion (clave, valor) VALUES
  ('precio_bs', '70'),
  ('whatsapp', '76419099'),
  ('whatsapp_prefijo', '+591'),
  ('nombre_app', '30 Días Para Reconectar'),
  ('mensaje_whatsapp', 'Hola, quiero activar mi código de acceso para el programa 30 Días Para Reconectar 📘')
ON CONFLICT (clave) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parejas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codigos_acceso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puntuaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflexiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

-- PERFILES: usuario puede ver y editar su propio perfil
CREATE POLICY "Usuarios ven su propio perfil" ON public.perfiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuarios editan su propio perfil" ON public.perfiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuarios crean su perfil" ON public.perfiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- PERFILES: ver nombre del compañero
CREATE POLICY "Ver perfil de pareja" ON public.perfiles
  FOR SELECT USING (
    id IN (
      SELECT CASE 
        WHEN usuario_1 = auth.uid() THEN usuario_2 
        ELSE usuario_1 
      END
      FROM public.parejas
      WHERE usuario_1 = auth.uid() OR usuario_2 = auth.uid()
    )
  );

-- PAREJAS: miembros de la pareja pueden ver
CREATE POLICY "Miembros ven su pareja" ON public.parejas
  FOR SELECT USING (usuario_1 = auth.uid() OR usuario_2 = auth.uid());
CREATE POLICY "Crear pareja" ON public.parejas
  FOR INSERT WITH CHECK (usuario_1 = auth.uid());
CREATE POLICY "Actualizar pareja" ON public.parejas
  FOR UPDATE USING (usuario_1 = auth.uid() OR usuario_2 = auth.uid());

-- CÓDIGOS: lectura pública para validar, escritura solo admin
CREATE POLICY "Validar código" ON public.codigos_acceso
  FOR SELECT USING (true);
CREATE POLICY "Usar código" ON public.codigos_acceso
  FOR UPDATE USING (usado = false);

-- RESPUESTAS: usuario ve y edita solo sus respuestas
CREATE POLICY "Ver mis respuestas" ON public.respuestas
  FOR SELECT USING (usuario_id = auth.uid());
CREATE POLICY "Crear respuesta" ON public.respuestas
  FOR INSERT WITH CHECK (usuario_id = auth.uid());
CREATE POLICY "Editar respuesta" ON public.respuestas
  FOR UPDATE USING (usuario_id = auth.uid());

-- RESPUESTAS: ver respuestas del partner cuando ambos respondieron
CREATE POLICY "Ver respuestas de pareja" ON public.respuestas
  FOR SELECT USING (
    pareja_id IN (
      SELECT id FROM public.parejas 
      WHERE usuario_1 = auth.uid() OR usuario_2 = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.respuestas r2
      WHERE r2.pareja_id = respuestas.pareja_id
        AND r2.dia = respuestas.dia
        AND r2.pregunta_index = respuestas.pregunta_index
        AND r2.usuario_id = auth.uid()
    )
  );

-- PUNTUACIONES: solo propias
CREATE POLICY "Ver mis puntuaciones" ON public.puntuaciones
  FOR SELECT USING (usuario_id = auth.uid());
CREATE POLICY "Crear puntuación" ON public.puntuaciones
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

-- PUNTUACIONES: ver del partner
CREATE POLICY "Ver puntuaciones de pareja" ON public.puntuaciones
  FOR SELECT USING (
    pareja_id IN (
      SELECT id FROM public.parejas 
      WHERE usuario_1 = auth.uid() OR usuario_2 = auth.uid()
    )
  );

-- REFLEXIONES: solo propias
CREATE POLICY "Ver mis reflexiones" ON public.reflexiones
  FOR SELECT USING (usuario_id = auth.uid());
CREATE POLICY "Crear reflexión" ON public.reflexiones
  FOR INSERT WITH CHECK (usuario_id = auth.uid());
CREATE POLICY "Editar reflexión" ON public.reflexiones
  FOR UPDATE USING (usuario_id = auth.uid());

-- REFLEXIONES: ver del partner
CREATE POLICY "Ver reflexiones de pareja" ON public.reflexiones
  FOR SELECT USING (
    pareja_id IN (
      SELECT id FROM public.parejas 
      WHERE usuario_1 = auth.uid() OR usuario_2 = auth.uid()
    )
  );

-- CONFIGURACIÓN: lectura pública
CREATE POLICY "Leer configuración" ON public.configuracion
  FOR SELECT USING (true);

-- ============================================================
-- FUNCIONES
-- ============================================================

-- Función para vincular pareja
CREATE OR REPLACE FUNCTION public.vincular_pareja(codigo_inv TEXT)
RETURNS UUID AS $$
DECLARE
  partner_id UUID;
  nueva_pareja_id UUID;
BEGIN
  -- Encontrar al usuario con ese código de invitación
  SELECT id INTO partner_id FROM public.perfiles 
  WHERE codigo_invitacion = codigo_inv AND id != auth.uid();
  
  IF partner_id IS NULL THEN
    RAISE EXCEPTION 'Código de invitación no válido';
  END IF;
  
  -- Verificar que ninguno ya tenga pareja
  IF EXISTS (SELECT 1 FROM public.parejas WHERE 
    (usuario_1 = auth.uid() OR usuario_2 = auth.uid()) AND activo = true) THEN
    RAISE EXCEPTION 'Ya tienes una pareja activa';
  END IF;
  
  IF EXISTS (SELECT 1 FROM public.parejas WHERE 
    (usuario_1 = partner_id OR usuario_2 = partner_id) AND activo = true) THEN
    RAISE EXCEPTION 'Esa persona ya tiene una pareja activa';
  END IF;
  
  -- Crear la pareja
  INSERT INTO public.parejas (usuario_1, usuario_2, fecha_inicio)
  VALUES (partner_id, auth.uid(), CURRENT_DATE)
  RETURNING id INTO nueva_pareja_id;
  
  -- Actualizar perfiles
  UPDATE public.perfiles SET pareja_id = nueva_pareja_id WHERE id IN (auth.uid(), partner_id);
  
  RETURN nueva_pareja_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para activar código de acceso
CREATE OR REPLACE FUNCTION public.activar_codigo(codigo_texto TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  mi_pareja_id UUID;
BEGIN
  -- Obtener pareja del usuario
  SELECT id INTO mi_pareja_id FROM public.parejas
  WHERE (usuario_1 = auth.uid() OR usuario_2 = auth.uid()) AND activo = true;
  
  IF mi_pareja_id IS NULL THEN
    RAISE EXCEPTION 'No tienes una pareja activa';
  END IF;
  
  -- Verificar y usar código
  UPDATE public.codigos_acceso 
  SET usado = true, usado_por = mi_pareja_id, fecha_uso = NOW()
  WHERE codigo = codigo_texto AND usado = false;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Código no válido o ya usado';
  END IF;
  
  -- Activar acceso completo
  UPDATE public.parejas 
  SET tiene_acceso_completo = true, codigo_acceso_usado = codigo_texto
  WHERE id = mi_pareja_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_respuestas_usuario ON public.respuestas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_pareja_dia ON public.respuestas(pareja_id, dia);
CREATE INDEX IF NOT EXISTS idx_puntuaciones_pareja ON public.puntuaciones(pareja_id);
CREATE INDEX IF NOT EXISTS idx_codigos_codigo ON public.codigos_acceso(codigo);
CREATE INDEX IF NOT EXISTS idx_perfiles_codigo_inv ON public.perfiles(codigo_invitacion);
