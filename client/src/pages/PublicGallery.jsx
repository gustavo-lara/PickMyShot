import React, { useState, useEffect } from 'react';
import { Camera, Heart, ArrowLeft, ArrowRight, X, Maximize2, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export function PublicGallery({ slug, onBackToLanding }) {
  const [galeria, setGaleria] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPublicData();
    }
  }, [slug]);

  const fetchPublicData = async () => {
    setLoading(true);
    setError('');
    try {
      const galeriaRes = await api.get(`/api/galerias/public/${slug}`);
      setGaleria(galeriaRes.data.galeria);

      const fotosRes = await api.get(`/api/public/${slug}/fotos`);
      setFotos(fotosRes.data.fotos || []);
    } catch (err) {
      console.error('Erro ao carregar galeria pública:', err);
      setError('Galeria não encontrada ou link inválido.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelecao = async (fotoId, e) => {
    if (e) e.stopPropagation();

    setFotos(prevFotos =>
      prevFotos.map(f =>
        f.id === fotoId ? { ...f, selecionada: !f.selecionada } : f
      )
    );

    try {
      const res = await api.post(`/api/fotos/${fotoId}/selecao`);
      const updatedSelecao = res.data.selecao;
      setFotos(prevFotos =>
        prevFotos.map(f =>
          f.id === fotoId ? { ...f, selecionada: updatedSelecao.aprovado } : f
        )
      );
    } catch (err) {
      console.error('Erro ao alternar seleção:', err);
      fetchPublicData();
    }
  };

  const selectedCount = fotos.filter(f => f.selecionada).length;

  const handleNextPhoto = (e) => {
    if (e) e.stopPropagation();
    if (activePhotoIndex !== null && activePhotoIndex < fotos.length - 1) {
      setActivePhotoIndex(activePhotoIndex + 1);
    }
  };

  const handlePrevPhoto = (e) => {
    if (e) e.stopPropagation();
    if (activePhotoIndex !== null && activePhotoIndex > 0) {
      setActivePhotoIndex(activePhotoIndex - 1);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: 'var(--color-paper)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', color: 'var(--color-warm-grey)'
      }}>
        Carregando...
      </div>
    );
  }

  if (error || !galeria) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: 'var(--color-paper)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', textAlign: 'center'
      }}>
        <Camera size={48} color="var(--color-mark-red)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Galeria Não Encontrada
        </h2>
        <p style={{ color: 'var(--color-warm-grey)', marginBottom: '1.5rem' }}>
          {error || 'O link que você acessou não existe ou foi desativado.'}
        </p>
        {onBackToLanding && (
          <button onClick={onBackToLanding} className="btn-primary">
            <ArrowLeft size={16} /> Voltar à Página Inicial
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-paper)', color: 'var(--color-ink)' }}>
      <header className="header-responsive" style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-warm-grey-light)',
        padding: '0.75rem 1rem',
        boxShadow: 'var(--shadow-paper)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ backgroundColor: 'var(--color-ink)', color: '#F7F5F0', padding: '6px', borderRadius: '4px' }}>
            <Camera size={18} />
          </div>
          <div>
            <span className="frame-tag" style={{ fontSize: '0.6rem' }}>GALERIA DE SELEÇÃO</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', margin: 0, lineHeight: 1.2 }}>
              {galeria.nome}
            </h2>
          </div>
        </div>

        <div className="header-actions-responsive">
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            backgroundColor: 'var(--color-paper-muted)',
            padding: '0.35rem 0.6rem',
            borderRadius: '4px',
            border: '1px solid var(--color-warm-grey-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Heart size={14} color="var(--color-mark-red)" fill={selectedCount > 0 ? "var(--color-mark-red)" : "none"} />
            <strong>{selectedCount}</strong> / {fotos.length} <span className="hide-on-xs">SELECIONADAS</span>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            disabled={selectedCount === 0}
            className="btn-mark"
            style={{
              opacity: selectedCount === 0 ? 0.5 : 1,
              cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
              padding: '0.5rem 0.85rem',
              fontSize: '0.8rem'
            }}
          >
            <Send size={15} /> Confirmar <span className="hide-on-xs">Seleção</span>
          </button>
        </div>
      </header>

      <main style={{ padding: '1.5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-warm-grey)' }}>
            CLIQUE NO ÍCONE DE CORAÇÃO OU NA FOTO PARA MARCAR SUA ESCOLHA
          </p>
        </div>

        {fotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'var(--font-mono)', color: 'var(--color-warm-grey)' }}>
            Nenhuma foto disponível nesta galeria ainda.
          </div>
        ) : (
          <div className="gallery-grid-responsive" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {fotos.map((foto, index) => {
              const frameNumber = `#${String(index + 1).padStart(3, '0')}`;
              return (
                <div
                  key={foto.id}
                  onClick={() => setActivePhotoIndex(index)}
                  className={`contact-frame ${foto.selecionada ? 'selected' : ''}`}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-warm-grey)',
                    marginBottom: '8px'
                  }}>
                    <span>{frameNumber}</span>
                    <button
                      onClick={(e) => handleToggleSelecao(foto.id, e)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        color: foto.selecionada ? 'var(--color-mark-red)' : 'var(--color-warm-grey)',
                        fontWeight: foto.selecionada ? 600 : 400
                      }}
                    >
                      <Heart size={16} fill={foto.selecionada ? "var(--color-mark-red)" : "none"} color="var(--color-mark-red)" />
                      {foto.selecionada ? 'SELECIONADA' : 'MARCAR'}
                    </button>
                  </div>

                  <div style={{ width: '100%', height: '240px', overflow: 'hidden', backgroundColor: '#EFECE6', position: 'relative' }}>
                    <img
                      src={foto.url_storage}
                      alt={`Foto ${frameNumber}`}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        filter: foto.selecionada ? 'contrast(1.05)' : 'grayscale(0.1)'
                      }}
                    />

                    {foto.selecionada && (
                      <svg
                        style={{
                          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'
                        }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M 10 15 C 30 5, 85 8, 92 25 C 98 45, 95 80, 80 90 C 65 98, 15 95, 8 75 C 2 55, 12 25, 30 12"
                          fill="none" stroke="var(--color-mark-red)" strokeWidth="3.5" strokeLinecap="round"
                          className="grease-pencil-circle"
                        />
                      </svg>
                    )}

                    <div style={{
                      position: 'absolute', bottom: '8px', right: '8px',
                      backgroundColor: 'rgba(26, 24, 21, 0.6)', color: '#FFFFFF',
                      padding: '4px 6px', borderRadius: '3px', display: 'flex', alignItems: 'center'
                    }}>
                      <Maximize2 size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {activePhotoIndex !== null && fotos[activePhotoIndex] && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(26, 24, 21, 0.92)', backdropFilter: 'blur(8px)',
            zIndex: 1000, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute', top: '1.5rem', left: '2rem', right: '2rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#F7F5F0'
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              FRAME #{String(activePhotoIndex + 1).padStart(3, '0')} DE #{String(fotos.length).padStart(3, '0')}
            </span>

            <button
              onClick={() => setActivePhotoIndex(null)}
              style={{ background: 'none', border: 'none', color: '#F7F5F0', cursor: 'pointer' }}
            >
              <X size={28} />
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative', maxWidth: '90vw', maxHeight: '75vh',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <img
              src={fotos[activePhotoIndex].url_storage}
              alt="Foto em tela cheia"
              style={{
                maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '2px solid #3D3935'
              }}
            />
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.65rem',
              width: '100%',
              maxWidth: '500px'
            }}
          >
            <button
              onClick={handlePrevPhoto}
              disabled={activePhotoIndex === 0}
              className="btn-outline"
              style={{
                color: '#F7F5F0',
                borderColor: '#8A8578',
                opacity: activePhotoIndex === 0 ? 0.3 : 1,
                padding: '0.55rem 0.85rem',
                fontSize: '0.8rem'
              }}
            >
              <ArrowLeft size={16} /> <span className="btn-text-mobile-hide">Anterior</span>
            </button>

            <button
              onClick={(e) => handleToggleSelecao(fotos[activePhotoIndex].id, e)}
              className="btn-mark"
              style={{ padding: '0.65rem 1.1rem', fontSize: '0.85rem' }}
            >
              <Heart
                size={16}
                fill={fotos[activePhotoIndex].selecionada ? "#FFFFFF" : "none"}
              />
              {fotos[activePhotoIndex].selecionada ? 'DESMARCAR' : 'SELECIONAR'}
            </button>

            <button
              onClick={handleNextPhoto}
              disabled={activePhotoIndex === fotos.length - 1}
              className="btn-outline"
              style={{
                color: '#F7F5F0',
                borderColor: '#8A8578',
                opacity: activePhotoIndex === fotos.length - 1 ? 0.3 : 1,
                padding: '0.55rem 0.85rem',
                fontSize: '0.8rem'
              }}
            >
              <span className="btn-text-mobile-hide">Próxima</span> <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {isSubmitModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(26, 24, 21, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#F7F5F0', border: '1px solid #8A8578', borderRadius: '4px',
            width: '100%', maxWidth: '440px', padding: '2.5rem 2rem', textAlign: 'center'
          }}>
            {!submitted ? (
              <>
                <div style={{
                  display: 'inline-flex', padding: '12px', borderRadius: '50%',
                  backgroundColor: 'rgba(193, 59, 46, 0.1)', color: 'var(--color-mark-red)',
                  marginBottom: '1rem'
                }}>
                  <Send size={28} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                  Confirmar Seleção Final?
                </h3>
                <p style={{ color: '#3D3935', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Você marcou <strong>{selectedCount} foto(s)</strong> para este ensaio. O fotógrafo receberá a notificação da sua escolha imediatamente.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="btn-outline"
                  >
                    Revisar Fotos
                  </button>
                  <button
                    onClick={() => setSubmitted(true)}
                    className="btn-mark"
                  >
                    Confirmar & Enviar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  display: 'inline-flex', padding: '12px', borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a',
                  marginBottom: '1rem'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                  Seleção Enviada!
                </h3>
                <p style={{ color: '#3D3935', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Sua escolha de <strong>{selectedCount} foto(s)</strong> foi gravada e enviada com sucesso ao fotógrafo.
                </p>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Concluir
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
