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

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsAdmin(true);
      loadCodes();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Default admin password — change this!
    if (password === 'admin30dias') {
      setIsAdmin(true);
      localStorage.setItem('admin_auth', 'true');
      loadCodes();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const loadCodes = () => {
    const savedCodes = localStorage.getItem('admin_codes');
    if (savedCodes) {
      setCodes(JSON.parse(savedCodes));
    }
  };

  const generateCodes = () => {
    const newCodes = [];
    for (let i = 0; i < newCodesCount; i++) {
      const code = '30DIAS-' + Math.random().toString(36).substr(2, 6).toUpperCase();
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
    const updated = codes.map(c =>
      c.id === id ? { ...c, usado: !c.usado } : c
    );
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
                <div className="admin-stat-label">Usados</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value" style={{ color: 'var(--color-accent)' }}>
                  {usedCodes.length * 70} Bs
                </div>
                <div className="admin-stat-label">Ingresos Estimados</div>
              </div>
            </div>

            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Acciones Rápidas</h3>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => setActiveTab('codigos')}>
                  🔑 Gestionar Códigos
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

            {/* Generate Codes */}
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
              </div>
            </div>

            {/* Codes Table */}
            <div className="glass-card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>
                Todos los Códigos ({codes.length})
              </h3>

              {codes.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
                  No hay códigos generados aún. Genera algunos arriba.
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
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => copyCode(code.codigo)}
                                title="Copiar"
                                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              >
                                📋
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => toggleCodeStatus(code.id)}
                                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              >
                                {code.usado ? '🔓' : '🔒'}
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => deleteCode(code.id)}
                                style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--color-danger)' }}
                              >
                                🗑️
                              </button>
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
                Para conectar con una base de datos real, configura las credenciales de Supabase
                en el archivo <code style={{ color: 'var(--color-accent)' }}>.env.local</code>
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
                Nota: Estas credenciales deben configurarse en el servidor, no en este formulario.
                Copia los valores al archivo .env.local
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
