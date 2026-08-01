import React, { useState, useEffect } from 'react';
import { Camera, Plus, Copy, Trash2, Upload, ArrowLeft, Check, LogOut, Image as ImageIcon, Heart, Settings } from 'lucide-react';
import { api } from '../services/api';

export function PhotographerDashboard({ user, onLogout, onNavigateToPublic }) {
  const [galerias, setGalerias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGaleria, setSelectedGaleria] = useState(null);
  const [galeriaFotos, setGaleriaFotos] = useState([]);
  const [activeTab, setActiveTab] = useState('todas');

  const [currentUser, setCurrentUser] = useState(user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [studioName, setStudioName] = useState(user?.nome || '');
  const [savingSettings, setSavingSettings] = useState(false);

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    if (user?.nome) setStudioName(user.nome);
    setCurrentUser(user);
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!studioName.trim()) return;

    setSavingSettings(true);
    try {
      const res = await api.put('/api/auth/me', { nome: studioName.trim() });
      const updatedUser = res.data.user;
      setCurrentUser(updatedUser);
      localStorage.setItem('@pickmyshot:user', JSON.stringify(updatedUser));
      showToast('Nome do estúdio atualizado com sucesso!');
      setIsSettingsOpen(false);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      if (err.response?.status === 401) {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        onLogout();
        return;
      }
      const msg = err.response?.data?.details?.[0] || err.response?.data?.error || err.response?.data?.details || err.message || 'Falha ao atualizar nome do estúdio.';
      alert(`Falha ao atualizar nome: ${msg}`);
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    fetchGalerias();
  }, []);

  const fetchGalerias = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/galerias');
      setGalerias(res.data.galerias || []);
    } catch (err) {
      console.error('Erro ao buscar galerias:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGaleria = async (e) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    setCreating(true);
    try {
      await api.post('/api/galerias', { nome: novoNome });
      showToast('Galeria criada com sucesso!');
      setNovoNome('');
      setIsModalOpen(false);
      fetchGalerias();
    } catch (err) {
      console.error('Erro ao criar galeria:', err);
      if (err.response?.status === 401) {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        onLogout();
        return;
      }
      const msg = err.response?.data?.details?.[0] || err.response?.data?.error || err.response?.data?.details || 'Erro ao comunicar com a API. Tente novamente.';
      alert(`Falha ao criar galeria: ${msg}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteGaleria = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Tem certeza que deseja excluir a galeria "${name}"?`)) return;

    try {
      await api.delete(`/api/galerias/${id}`);
      showToast('Galeria excluída com sucesso.');
      if (selectedGaleria?.id === id) setSelectedGaleria(null);
      fetchGalerias();
    } catch (err) {
      console.error('Erro ao excluir galeria:', err);
    }
  };

  const handleOpenGaleria = async (galeria) => {
    setSelectedGaleria(galeria);
    setActiveTab('todas');
    fetchGaleriaFotos(galeria.id);
  };

  const fetchGaleriaFotos = async (galeriaId) => {
    try {
      const res = await api.get(`/api/galerias/${galeriaId}/fotos`);
      setGaleriaFotos(res.data.fotos || []);
    } catch (err) {
      console.error('Erro ao buscar fotos da galeria:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedGaleria) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('fotos', files[i]);
    }

    try {
      await api.post(`/api/galerias/${selectedGaleria.id}/fotos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast(`${files.length} foto(s) enviada(s) com sucesso!`);
      fetchGaleriaFotos(selectedGaleria.id);
      fetchGalerias();
    } catch (err) {
      console.error('Erro no upload de fotos:', err);
      alert('Falha ao enviar fotos.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFoto = async (fotoId, e) => {
    e.stopPropagation();
    if (!window.confirm('Excluir esta foto?')) return;

    try {
      await api.delete(`/api/fotos/${fotoId}`);
      showToast('Foto excluída.');
      if (selectedGaleria) fetchGaleriaFotos(selectedGaleria.id);
    } catch (err) {
      console.error('Erro ao excluir foto:', err);
    }
  };

  const copyPublicLink = (slug, e) => {
    e?.stopPropagation();
    const publicUrl = `${window.location.origin}/#galeria=${slug}`;
    navigator.clipboard.writeText(publicUrl);
    showToast('Link do cliente copiado para a área de transferência!');
  };

  const filteredFotos = activeTab === 'selecionadas'
    ? galeriaFotos.filter(f => f.selecionada)
    : galeriaFotos;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-paper)', color: 'var(--color-ink)' }}>
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#1A1815',
          color: '#F7F5F0',
          padding: '0.85rem 1.4rem',
          borderRadius: '4px',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          boxShadow: 'var(--shadow-card)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={18} color="var(--color-mark-red)" />
          {toastMsg}
        </div>
      )}

      <header style={{
        borderBottom: '1px solid var(--color-warm-grey-light)',
        padding: '0.85rem 1.5rem',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
            {selectedGaleria && (
              <button
                onClick={() => setSelectedGaleria(null)}
                className="btn-outline"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ArrowLeft size={16} /> <span className="btn-text-mobile-hide">Voltar</span>
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
              <div style={{ backgroundColor: '#1A1815', color: '#F7F5F0', padding: '8px', borderRadius: '4px', flexShrink: 0 }}>
                <Camera size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {currentUser?.nome || 'Estúdio Fotográfico'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', display: 'block', color: 'var(--color-warm-grey)', marginTop: '2px' }}>
                  PAINEL DO FOTÓGRAFO
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            {!selectedGaleria && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-mark"
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                <Plus size={16} /> <span className="btn-text-mobile-hide">Nova Galeria</span>
              </button>
            )}
            <button
              onClick={() => {
                setStudioName(currentUser?.nome || '');
                setIsSettingsOpen(true);
              }}
              className="btn-outline"
              style={{ padding: '0.5rem 0.65rem', fontSize: '0.85rem' }}
              title="Configurações do Estúdio"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={onLogout}
              className="btn-outline"
              style={{ padding: '0.5rem 0.65rem', fontSize: '0.85rem' }}
              title="Sair do Sistema"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main style={{ padding: '1.5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {!selectedGaleria ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginTop: '0.2rem' }}>
                  Seus Ensaios Fotográficos
                </h1>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', fontFamily: 'var(--font-mono)', color: 'var(--color-warm-grey)' }}>
                Carregando galerias do banco de dados...
              </div>
            ) : galerias.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '1px dashed var(--color-warm-grey-light)',
                borderRadius: '4px'
              }}>
                <ImageIcon size={48} color="var(--color-warm-grey)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '0.5rem' }}>
                  Nenhuma galeria criada ainda
                </h3>
                <p style={{ color: 'var(--color-warm-grey)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Clique no botão abaixo para criar sua primeira galeria de ensaio.
                </p>
                <button onClick={() => setIsModalOpen(true)} className="btn-mark">
                  <Plus size={18} /> Criar Primeira Galeria
                </button>
              </div>
            ) : (
              <div className="gallery-grid-responsive" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.25rem'
              }}>
                {galerias.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => handleOpenGaleria(g)}
                    className="contact-frame"
                    style={{ cursor: 'pointer', padding: '1.25rem' }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--color-warm-grey)',
                      marginBottom: '0.5rem'
                    }}>
                      <span>LINK: #{g.link_publico.substring(0, 12)}...</span>
                      <span>{new Date(g.created_at).toLocaleDateString()}</span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--color-ink)' }}>
                      {g.nome}
                    </h3>

                    <div style={{
                      backgroundColor: 'var(--color-paper-muted)',
                      padding: '0.75rem 1rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                      border: '1px solid var(--color-warm-grey-light)'
                    }}>
                      <div>
                        <span style={{ color: 'var(--color-warm-grey)', display: 'block', fontSize: '0.65rem' }}>TOTAL FOTOS</span>
                        <strong style={{ fontSize: '1rem', color: 'var(--color-ink)' }}>{g.total_fotos || 0}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--color-warm-grey)', display: 'block', fontSize: '0.65rem' }}>APROVADAS</span>
                        <strong style={{ fontSize: '1rem', color: 'var(--color-mark-red)' }}>{g.total_selecionadas || 0}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => copyPublicLink(g.link_publico, e)}
                        className="btn-outline"
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}
                      >
                        <Copy size={14} /> Copiar Link
                      </button>
                      <button
                        onClick={(e) => handleDeleteGaleria(g.id, g.nome, e)}
                        className="btn-outline"
                        style={{ padding: '0.5rem', color: 'var(--color-mark-red)', borderColor: 'var(--color-warm-grey-light)' }}
                        title="Excluir Galeria"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="frame-tag">GERENCIADOR DE GALERIA</span>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', marginTop: '0.2rem' }}>
                  {selectedGaleria.nome}
                </h1>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-warm-grey)', wordBreak: 'break-all' }}>
                  LINK PÚBLICO: {window.location.origin}/#galeria={selectedGaleria.link_publico}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => copyPublicLink(selectedGaleria.link_publico)}
                  className="btn-mark"
                >
                  <Copy size={16} /> Copiar Link do Cliente
                </button>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px dashed var(--color-warm-grey-light)',
              borderRadius: '4px',
              padding: '1.5rem 1rem',
              textAlign: 'center',
              marginBottom: '1.75rem',
              position: 'relative'
            }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: uploading ? 'not-allowed' : 'pointer'
                }}
              />
              <Upload size={36} color={uploading ? 'var(--color-mark-red)' : 'var(--color-ink)'} style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.25rem' }}>
                {uploading ? 'Enviando fotos para a Galeria...' : 'Arraste ou clique para enviar fotos deste ensaio'}
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-warm-grey)' }}>
                SUPORTA JPEG, PNG, WEBP ATÉ 25MB POR FOTO
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--color-warm-grey-light)', marginBottom: '1.25rem' }}>
              <button
                onClick={() => setActiveTab('todas')}
                style={{
                  padding: '0.6rem 0.85rem',
                  border: 'none',
                  background: 'none',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === 'todas' ? '2px solid #1A1815' : '2px solid transparent',
                  color: activeTab === 'todas' ? '#1A1815' : 'var(--color-warm-grey)'
                }}
              >
                Todas as Fotos ({galeriaFotos.length})
              </button>
              <button
                onClick={() => setActiveTab('selecionadas')}
                style={{
                  padding: '0.6rem 0.85rem',
                  border: 'none',
                  background: 'none',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === 'selecionadas' ? '2px solid var(--color-mark-red)' : '2px solid transparent',
                  color: activeTab === 'selecionadas' ? 'var(--color-mark-red)' : 'var(--color-warm-grey)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Heart size={15} fill={activeTab === 'selecionadas' ? 'var(--color-mark-red)' : 'none'} />
                Aprovadas ({galeriaFotos.filter(f => f.selecionada).length})
              </button>
            </div>

            {filteredFotos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-warm-grey)', fontFamily: 'var(--font-mono)' }}>
                {activeTab === 'selecionadas'
                  ? 'O cliente ainda não aprovou fotos nesta galeria.'
                  : 'Nenhuma foto nesta galeria. Faça o upload acima.'}
              </div>
            ) : (
              <div className="gallery-grid-responsive" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.25rem'
              }}>
                {filteredFotos.map((foto, index) => (
                  <div key={foto.id} className={`contact-frame ${foto.selecionada ? 'selected' : ''}`}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--color-warm-grey)',
                      marginBottom: '6px'
                    }}>
                      <span>#{String(index + 1).padStart(3, '0')}</span>
                      {foto.selecionada && (
                        <span style={{ color: 'var(--color-mark-red)', fontWeight: 700 }}>✓ APROVADA</span>
                      )}
                    </div>

                    <div style={{ width: '100%', height: '180px', overflow: 'hidden', backgroundColor: '#EFECE6', position: 'relative' }}>
                      <img
                        src={foto.url_storage}
                        alt="Foto do ensaio"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      <button
                        onClick={(e) => handleDeleteFoto(foto.id, e)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          backgroundColor: 'rgba(26, 24, 21, 0.8)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '4px 6px',
                          cursor: 'pointer'
                        }}
                        title="Excluir Foto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(26, 24, 21, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#F7F5F0', border: '1px solid #8A8578', borderRadius: '4px',
            width: '100%', maxWidth: '420px', padding: '2rem'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              Nova Galeria de Ensaio
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-warm-grey)', marginBottom: '1.5rem' }}>
              SERÁ GERADO UM LINK PÚBLICO ÚNICO POR GALERIA
            </p>

            <form onSubmit={handleCreateGaleria}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Nome do Ensaio / Cliente
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Casamento Gustavo"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #8A8578',
                    fontFamily: 'var(--font-sans)', fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-outline"
                  style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-mark"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  {creating ? 'Criando...' : 'Criar Galeria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Configurações do Estúdio */}
      {isSettingsOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(26, 24, 21, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#F7F5F0', border: '1px solid #8A8578', borderRadius: '4px',
            width: '100%', maxWidth: '420px', padding: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Settings size={20} color="var(--color-mark-red)" />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0 }}>
                Configurações do Estúdio
              </h3>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Nome do Fotógrafo / Nome do Estúdio
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Studio Gustavo Lara"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #8A8578',
                    fontFamily: 'var(--font-sans)', fontSize: '0.9rem', backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="btn-outline"
                  style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="btn-mark"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  {savingSettings ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
