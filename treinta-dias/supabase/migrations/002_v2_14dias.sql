-- Migration: v2 14 Días Para Reconectar
-- Adjusts schema for single-device, turn-based model

-- Add persona column to respuestas (1 or 2)
ALTER TABLE public.respuestas ADD COLUMN IF NOT EXISTS persona INTEGER DEFAULT 1 CHECK (persona IN (1, 2));

-- Daily AI analysis table
CREATE TABLE IF NOT EXISTS public.analisis_diario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pareja_id UUID REFERENCES public.parejas(id),
  dia INTEGER NOT NULL CHECK (dia BETWEEN 1 AND 14),
  conclusion TEXT,
  fortalezas JSONB,
  area_trabajo TEXT,
  tip TEXT,
  reto TEXT,
  semaforo TEXT CHECK (semaforo IN ('verde', 'amarillo', 'rojo')),
  alerta_profesional TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pareja_id, dia)
);

-- Enable RLS on analisis_diario
ALTER TABLE public.analisis_diario ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own analysis
CREATE POLICY "Users can view own analysis" ON public.analisis_diario
  FOR SELECT USING (
    pareja_id IN (
      SELECT id FROM public.parejas WHERE persona1_id = auth.uid() OR persona2_id = auth.uid()
    )
  );

-- Allow users to insert own analysis
CREATE POLICY "Users can insert own analysis" ON public.analisis_diario
  FOR INSERT WITH CHECK (
    pareja_id IN (
      SELECT id FROM public.parejas WHERE persona1_id = auth.uid() OR persona2_id = auth.uid()
    )
  );

-- Cuadernillos table (multi-cuadernillo platform preparation)
CREATE TABLE IF NOT EXISTS public.cuadernillos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  dias_total INTEGER DEFAULT 14,
  preguntas_por_dia INTEGER DEFAULT 10,
  precio_bs NUMERIC(10,2) DEFAULT 70.00,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the first cuadernillo
INSERT INTO public.cuadernillos (slug, titulo, descripcion, dias_total, preguntas_por_dia, precio_bs)
VALUES (
  '14-dias-reconectar',
  '14 Días Para Reconectar',
  'Un programa de 14 días diseñado para que tú y tu pareja trabajen juntos en fortalecer su conexión emocional.',
  14,
  10,
  70.00
) ON CONFLICT (slug) DO NOTHING;
