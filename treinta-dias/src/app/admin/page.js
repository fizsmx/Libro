'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [codes, setCodes] = useState([]);
  const [newCodesCount, setNewCodesCount] = useState(5);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsAdmin(true);
      loadCodes();
      loadStats();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin30dias') {
      setIsAdmin(true);
      localStorage.setItem('admin_auth', 'true');
      loadCodes();
      loadStats();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const loadCodes = () => {
    const savedCodes = localStorage.getItem('admin_codes');
    if (savedCodes) setCodes(JSON.parse(savedCodes));
  };

  const loadStats = () => {
    const completedDays = JSON.parse(localStorage.getItem('completed_days') || '[]');
    const scores = JSON.parse(localStorage.getItem('connection_scores') || '{}');
    const scoreValues = Object.values(scores).map(Number);
    const avgScore = scoreValues.length > 0
      ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1) : 0;

    // Count answered questions
    let totalAnswered = 0;
    for (let i = 1; i <= 14; i++) {
      const a = localStorage.getItem(`answers_day_${i}`);
      if (a) totalAnswered += Object.keys(JSON.parse(a)).length;
    }

    // Count reflections
    let totalReflections = 0;
    for (let i = 1; i <= 14; i++) {
      if (localStorage.getItem(`reflection_day_${i}`)) totalReflections++;
    }

    setStats({
      completedDays: completedDays.length,
      avgScore,
      totalAnswered,
      totalReflections,
      retentionDay7: completedDays.includes(7) ? 100 : completedDays.length >= 7 ? 0 : null,
      retentionDay15: completedDays.includes(15) ? 100 : completedDays.length >= 15 ? 0 : null,
      retentionDay30: completedDays.includes(30) ? 100 : completedDays.length >= 30 ? 0 : null,
      scoreHistory: scores,
      completedList: completedDays,
    });
  };

  const generateCodes = () => {
    const newCodes = [];
    for (let i = 0; i < newCodesCount; i++) {
      const code = '14DIAS-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      newCodes.push({
        id: Date.now() + i,
        codigo: code,
        usado: false,
        usado_por: null,
        creado: new Date().toISOString(),
      });
    }
    const updated = [...codes, ...newCodes];
    setCodes(updated);
    localStorage.setItem('admin_codes', JSON.stringify(updated));
    showToast(`${newCodesCount} códigos generados`, 'success');
  };

  const toggleCodeStatus = (id) => {
    const updated = codes.map(c => c.id === id ? { ...c, usado: !c.usado } : c);
    setCodes(updated);
    localStorage.setItem('admin_codes', JSON.stringify(updated));
  };

  const deleteCode = (id) => {
    const updated = codes.filter(c => c.id !== id);
    setCodes(updated);
    localStorage.setItem('admin_codes', JSON.stringify(updated));
    showToast('Código eliminado', 'info');
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast('Código copiado al portapapeles', 'success');
  };

  const exportCodesCSV = () => {
    let csv = 'Código,Estado,Creado,Usado Por\n';
    codes.forEach(c => {
      csv += `${c.codigo},${c.usado ? 'Usado' : 'Disponible'},${new Date(c.creado).toLocaleDateString('es')},${c.usado_por || ''}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'codigos_acceso.csv';
    link.click();
    showToast('CSV descargado', 'success');
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAdmin(false);
  };

  const activeCodes = codes.filter(c => !c.usado);
  const usedCodes = codes.filter(c => c.usado);

  // Admin login
  if (!isAdmin) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="text-center mb-xl">
            <span style={{ fontSize: '2.5rem' }}>🔐</span>
          </div>
          <h2 className="auth-title">Panel de Administración</h2>
          <p className="auth-subtitle">Ingresa la contraseña de administrador</p>

          {error && (
            <div style={{
              padding: 'var(--space-md)',
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              fontSize: '0.9rem',
              marginBottom: 'var(--space-md)',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="admin-pass">Contraseña</label>
              <input
                id="admin-pass"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-md">
              🔓 Ingresar
            </button>
          </form>

          <div className="auth-footer">
            <Link href="/">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <>
      {/* Admin Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          🔐 Admin Panel
        </div>
        <nav className="admin-sidebar-nav">
          <button
            className={`admin-sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`admin-sidebar-link ${activeTab === 'codigos' ? 'active' : ''}`}
            onClick={() => setActiveTab('codigos')}
          >
            🔑 Códigos
          </button>
          <button
            className={`admin-sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analíticas
          </button>
          <button
            className={`admin-sidebar-link ${activeTab === 'marketing' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketing')}
          >
            📣 Marketing
          </button>
          <button
            className={`admin-sidebar-link ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            ⚙️ Configuración
          </button>
          <div style={{ flex: 1 }}></div>
          <button className="admin-sidebar-link" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
          <Link href="/" className="admin-sidebar-link">
            🏠 Ir al Sitio
          </Link>
        </nav>
      </div>

      {/* Admin Content */}
      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <>
            <h1 style={{ marginBottom: 'var(--space-2xl)' }}>📊 Dashboard</h1>

            <div className="admin-stat-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
              <div className="admin-stat-card">
                <div className="admin-stat-value">{codes.length}</div>
                <div className="admin-stat-label">Total Códigos</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value" style={{ color: 'var(--color-success)' }}>
                  {activeCodes.length}
                </div>
                <div className="admin-stat-label">Disponibles</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value" style={{ color: 'var(--color-accent)' }}>
                  {usedCodes.length}
                </div>
                <div className="admin-stat-label">Vendidos</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value" style={{ color: 'var(--color-accent)' }}>
                  {usedCodes.length * 70} Bs
                </div>
                <div className="admin-stat-label">Ingresos</div>
              </div>
            </div>

            {/* User Activity Stats */}
            <div className="admin-stat-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
              <div className="admin-stat-card">
                <div className="admin-stat-value" style={{ color: 'var(--color-info)' }}>
                  {stats.completedDays || 0}
                </div>
                <div className="admin-stat-label">Días Completados</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value" style={{ color: 'var(--color-primary-light)' }}>
                  {stats.totalAnswered || 0}
                </div>
                <div className="admin-stat-label">Respuestas Totales</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value" style={{ color: 'var(--color-secondary-light)' }}>
                  {stats.totalReflections || 0}
                </div>
                <div className="admin-stat-label">Reflexiones</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value" style={{ color: 'var(--color-success)' }}>
                  {stats.avgScore || 0}/10
                </div>
                <div className="admin-stat-label">Conexión Promedio</div>
              </div>
            </div>

            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Acciones Rápidas</h3>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => setActiveTab('codigos')}>
                  🔑 Gestionar Códigos
                </button>
                <button className="btn btn-secondary" onClick={exportCodesCSV}>
                  📥 Exportar CSV
                </button>
                <a
                  href="https://wa.me/59176419099"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  📲 WhatsApp
                </a>
              </div>
            </div>
          </>
        )}

        {activeTab === 'codigos' && (
          <>
            <h1 style={{ marginBottom: 'var(--space-2xl)' }}>🔑 Códigos de Acceso</h1>

            <div className="glass-card" style={{ marginBottom: 'var(--space-2xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Generar Nuevos Códigos</h3>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="input-group" style={{ width: '120px' }}>
                  <label>Cantidad</label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    max="50"
                    value={newCodesCount}
                    onChange={(e) => setNewCodesCount(parseInt(e.target.value) || 1)}
                  />
                </div>
                <button className="btn btn-accent" onClick={generateCodes}>
                  ✨ Generar {newCodesCount} Códigos
                </button>
                <button className="btn btn-secondary" onClick={exportCodesCSV}>
                  📥 Exportar CSV
                </button>
              </div>
            </div>

            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>
                Todos los Códigos ({codes.length})
              </h3>

              {codes.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
                  No hay códigos generados aún.
                </p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Estado</th>
                        <th>Creado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {codes.map((code) => (
                        <tr key={code.id}>
                          <td>
                            <span style={{
                              fontFamily: 'monospace',
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              color: code.usado ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                            }}>
                              {code.codigo}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${code.usado ? '' : 'badge-free'}`}
                              style={code.usado ? { background: 'rgba(248,113,113,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(248,113,113,0.3)' } : {}}>
                              {code.usado ? '❌ Usado' : '✅ Disponible'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>
                            {new Date(code.creado).toLocaleDateString('es')}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => copyCode(code.codigo)} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>📋</button>
                              <button className="btn btn-secondary btn-sm" onClick={() => toggleCodeStatus(code.id)} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>{code.usado ? '🔓' : '🔒'}</button>
                              <button className="btn btn-secondary btn-sm" onClick={() => deleteCode(code.id)} style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--color-danger)' }}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <h1 style={{ marginBottom: 'var(--space-2xl)' }}>📈 Analíticas</h1>

            {/* Retention funnel */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>🎯 Embudo de Retención</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {[
                  { label: 'Registro', value: 100, color: 'var(--color-primary)' },
                  { label: 'Completó Día 1', value: stats.completedDays >= 1 ? 100 : 0, color: 'var(--color-info)' },
                  { label: 'Completó Día 7', value: (stats.completedList || []).includes(7) ? 100 : 0, color: 'var(--color-accent)' },
                  { label: 'Completó Día 15', value: (stats.completedList || []).includes(15) ? 100 : 0, color: 'var(--color-secondary-light)' },
                  { label: 'Completó Día 21', value: (stats.completedList || []).includes(21) ? 100 : 0, color: 'var(--color-warning)' },
                  { label: 'Completó Día 30', value: (stats.completedList || []).includes(30) ? 100 : 0, color: 'var(--color-success)' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <span style={{ width: '140px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{item.label}</span>
                    <div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${item.value}%`,
                        height: '100%',
                        background: item.color,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 1s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '8px',
                      }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>{item.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connection score chart */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>📊 Conexión por Día</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px', borderBottom: '1px solid var(--color-border)' }}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                  const score = stats.scoreHistory?.[day] || 0;
                  const h = score ? (score / 10) * 140 : 0;
                  return (
                    <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }} title={`Día ${day}: ${score}/10`}>
                      <div style={{
                        width: '100%', maxWidth: '20px', height: `${h}px`,
                        background: score >= 7 ? 'var(--color-success)' : score >= 4 ? 'var(--color-warning)' : score > 0 ? 'var(--color-danger)' : 'rgba(255,255,255,0.05)',
                        borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease',
                      }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
              </div>
            </div>

            {/* Key metrics */}
            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>📋 Métricas Clave</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {[
                  { label: 'Tasa de Completado', value: `${Math.round((stats.completedDays || 0) / 30 * 100)}%` },
                  { label: 'Promedio Respuestas/Día', value: stats.completedDays > 0 ? ((stats.totalAnswered || 0) / stats.completedDays).toFixed(1) : '0' },
                  { label: 'Días con Reflexión', value: `${stats.totalReflections || 0}/30` },
                  { label: 'Conexión Promedio', value: `${stats.avgScore || 0}/10` },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'marketing' && (
          <>
            <h1 style={{ marginBottom: 'var(--space-2xl)' }}>📣 Marketing</h1>

            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>📱 Texto WhatsApp (Copiar y Pegar)</h3>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap', fontSize: '0.88rem', lineHeight: 1.6 }}>
{`📘 CUADERNILLO DE TERAPIA DE PAREJA – PROGRAMA DE 30 DÍAS

Un material práctico para trabajar juntos temas importantes de la relación, reflexionar, conversar y fortalecer la conexión.

🎁 POR PROMOCIÓN: SOLO 70 Bs

Además, recibirás:
✅ Cuadernillo de Terapia de Pareja – 14 días
✅ Libro: Cómo manejar conversaciones difíciles
✅ 🤖 Chatbot especializado
✅ 🎧 Podcast sobre terapia y conexión de pareja
✅ 🎥 Video explicativo

📲 Escríbeme "QUIERO EL CUADERNILLO" al 76419099`}
              </div>
              <button
                className="btn btn-primary mt-md"
                onClick={() => {
                  navigator.clipboard.writeText(`📘 CUADERNILLO DE TERAPIA DE PAREJA – PROGRAMA DE 30 DÍAS\n\nUn material práctico para trabajar juntos temas importantes de la relación, reflexionar, conversar y fortalecer la conexión.\n\n🎁 POR PROMOCIÓN: SOLO 70 Bs\n\nAdemás, recibirás:\n✅ Cuadernillo de Terapia de Pareja – 14 días\n✅ Libro: Cómo manejar conversaciones difíciles\n✅ 🤖 Chatbot especializado\n✅ 🎧 Podcast sobre terapia y conexión de pareja\n✅ 🎥 Video explicativo\n\n📲 Escríbeme "QUIERO EL CUADERNILLO" al 76419099`);
                  showToast('Texto copiado', 'success');
                }}
              >
                📋 Copiar Texto
              </button>
            </div>

            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>🎯 Segmentación Facebook Ads</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                {[
                  {
                    title: 'Público 1: Parejas y Relaciones',
                    interests: 'Relaciones, Matrimonio, Parejas, Psicología, Salud mental, Bienestar, Desarrollo personal, Inteligencia emocional',
                    audience: '25-55 años, Hombres y Mujeres, Santa Cruz, Bolivia',
                  },
                  {
                    title: 'Público 2: Psicología + Desarrollo Personal',
                    interests: 'Psicología, Psicoterapia, Salud mental, Autoayuda, Inteligencia emocional, Bienestar, Mindfulness, Comunicación',
                    audience: '25-55 años, Hombres y Mujeres, Santa Cruz, Bolivia',
                  },
                  {
                    title: 'Público 3: Matrimonio/Familia',
                    interests: 'Matrimonio, Familia, Relaciones, Padres',
                    audience: '30-50 años, Hombres y Mujeres, Santa Cruz, Bolivia',
                  },
                ].map((pub, i) => (
                  <div key={i} style={{ padding: 'var(--space-md)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-sm)', color: 'var(--color-accent)' }}>{pub.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      <strong>Intereses:</strong> {pub.interests}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <strong>Audiencia:</strong> {pub.audience}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'config' && (
          <>
            <h1 style={{ marginBottom: 'var(--space-2xl)' }}>⚙️ Configuración</h1>

            <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Datos del Negocio</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label>Precio (Bs)</label>
                  <input type="text" className="input" defaultValue="70" style={{ maxWidth: '200px' }} />
                </div>
                <div className="input-group">
                  <label>WhatsApp</label>
                  <input type="text" className="input" defaultValue="+591 76419099" style={{ maxWidth: '300px' }} />
                </div>
                <div className="input-group">
                  <label>Contraseña Admin</label>
                  <input type="password" className="input" defaultValue="admin30dias" style={{ maxWidth: '300px' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)' }}>
                    ⚠️ Cambia esta contraseña por defecto
                  </span>
                </div>
              </div>
              <button className="btn btn-primary mt-lg" onClick={() => showToast('Configuración guardada', 'success')}>
                💾 Guardar Cambios
              </button>
            </div>

            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>🔗 Supabase</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
                Para conectar con una base de datos real, configura las credenciales en <code style={{ color: 'var(--color-accent)' }}>.env.local</code>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label>NEXT_PUBLIC_SUPABASE_URL</label>
                  <input type="text" className="input" placeholder="https://xxxxx.supabase.co" />
                </div>
                <div className="input-group">
                  <label>NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
                  <input type="text" className="input" placeholder="eyJhbGci..." />
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)' }}>
                Nota: Estas credenciales deben configurarse en el servidor, no aquí.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
