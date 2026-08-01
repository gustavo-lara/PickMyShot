import React, { useState } from 'react';
import { Camera, ArrowRight, CheckCircle2, Film, Heart, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

export function LandingPage({ onLoginSuccess }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Estado da Contact Sheet interativa na Hero (Marcar/Desmarcar frames)
  const [selectedFrames, setSelectedFrames] = useState([1, 3]);

  const toggleFrame = (id) => {
    if (selectedFrames.includes(id)) {
      setSelectedFrames(selectedFrames.filter(item => item !== id));
    } else {
      setSelectedFrames([...selectedFrames, id]);
    }
  };

  // Exemplo de fotos artísticas de estúdio para a folha de contato demonstrativa
  const samplePhotos = [
    { id: 1, tag: '#001', title: 'Ensaio Retrato - Sombra e Luz', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { id: 2, tag: '#002', title: 'Editorial Urbano 35mm', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { id: 3, tag: '#003', title: 'Casamento Natural - Cerimônia', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80' },
    { id: 4, tag: '#004', title: 'Studio Black & White', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-paper)', color: 'var(--color-ink)' }}>
      {/* Header / Navbar Editorial */}
      <header className="header-responsive" style={{
        borderBottom: '1px solid var(--color-warm-grey-light)',
        padding: '1.25rem 2rem',
        backgroundColor: 'var(--color-paper)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-paper)',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Camera size={20} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              PickMyShot
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', display: 'block', color: 'var(--color-warm-grey)', marginTop: '-2px' }}>
              EDITORIAL CONTACT SHEET
            </span>
          </div>
        </div>

        <div className="header-actions-responsive">
          <button
            onClick={() => setIsAuthOpen(true)}
            className="btn-outline"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
          >
            Entrar no Estúdio
          </button>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
          >
            Criar Conta
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '4rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            color: 'var(--color-ink)'
          }}>
            Seus ensaios merecem uma <em style={{ fontStyle: 'italic', color: 'var(--color-mark-red)' }}>aprovação à altura</em>.
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#3D3935', maxWidth: '680px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Compartilhe galerias com seus clientes através de um link único sem pedir cadastros ou senhas. O cliente escolhe as fotos direto pelo celular e você acompanha o resultado no seu painel.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="btn-mark"
              style={{ fontSize: '1rem', padding: '1rem 2rem' }}
            >
              Começar Agora sem Custo
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Demonstração Interativa da Folha de Contato */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-ink)',
          borderRadius: '4px',
          padding: '2rem 1.5rem',
          boxShadow: 'var(--shadow-card)',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-warm-grey-light)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <span className="frame-tag" style={{ color: 'var(--color-mark-red)', fontWeight: 700 }}>
                ● DEMONSTRAÇÃO INTERATIVA
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '0.2rem' }}>
                Folha de Contato #35MM — Ensaio Editorial
              </h3>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-warm-grey)' }}>
              CLIQUE NAS FOTOS PARA MARCAR COM CANETA VERMELHA
            </div>
          </div>

          {/* Grid estilo Contact Sheet de Película */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            {samplePhotos.map((photo) => {
              const isSelected = selectedFrames.includes(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => toggleFrame(photo.id)}
                  className={`contact-frame ${isSelected ? 'selected' : ''}`}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-warm-grey)'
                  }}>
                    <span>{photo.tag}</span>
                    <span style={{ color: isSelected ? 'var(--color-mark-red)' : 'inherit', fontWeight: isSelected ? 600 : 400 }}>
                      {isSelected ? '✓ SELECIONADA' : 'NÃO MARCADA'}
                    </span>
                  </div>

                  <div style={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden', backgroundColor: '#EFECE6' }}>
                    <img
                      src={photo.url}
                      alt={photo.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isSelected ? 'contrast(1.05)' : 'grayscale(0.15)',
                        transition: 'filter 0.3s'
                      }}
                    />

                    {/* Elemento de Assinatura: Traço de Caneta Vermelha de Contato */}
                    {isSelected && (
                      <svg
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none'
                        }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {/* Círculo oval orgânico simulando marcação manual com caneta vermelha */}
                        <path
                          d="M 10 15 C 30 5, 85 8, 92 25 C 98 45, 95 80, 80 90 C 65 98, 15 95, 8 75 C 2 55, 12 25, 30 12"
                          fill="none"
                          stroke="var(--color-mark-red)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          className="grease-pencil-circle"
                        />
                      </svg>
                    )}
                  </div>

                  <div style={{ marginTop: '10px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                    {photo.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção Como Funciona (3 Passos Editoriais) */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-warm-grey-light)',
        borderBottom: '1px solid var(--color-warm-grey-light)',
        padding: '5rem 2rem'
      }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="frame-tag" style={{ color: 'var(--color-mark-red)' }}>O FLUXO DE TRABALHO</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', marginTop: '0.4rem', color: 'var(--color-ink)' }}>
              Como o PickMyShot simplifica sua entrega
            </h2>
            <p style={{ color: 'var(--color-warm-grey)', fontSize: '1.05rem', maxWidth: '600px', margin: '0.75rem auto 0' }}>
              Entenda como transformar o processo de seleção de fotos em uma experiência rápida para o seu cliente e organizada para o seu estúdio.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {/* Passo 1 */}
            <div style={{
              backgroundColor: 'var(--color-paper)',
              border: '1px solid var(--color-warm-grey-light)',
              padding: '2.25rem 2rem',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-mark-red)' }}>
                  #001
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: '0.75rem 0 0.5rem' }}>
                  Upload Ágil do Ensaio
                </h3>
                <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Crie a galeria do cliente em segundos e faça o upload em massa das fotos do ensaio. O sistema organiza tudo automaticamente em molduras numeradas no formato de folha de contato 35mm.
                </p>
              </div>

              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-warm-grey)',
                borderTop: '1px dashed var(--color-warm-grey-light)',
                paddingTop: '0.85rem'
              }}>
                ✓ Suporte a múltiplos arquivos até 25MB<br />
                ✓ Armazenamento otimizado na nuvem
              </div>
            </div>

            {/* Passo 2 */}
            <div style={{
              backgroundColor: 'var(--color-paper)',
              border: '1px solid var(--color-warm-grey-light)',
              padding: '2.25rem 2rem',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-mark-red)' }}>
                  #002
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: '0.75rem 0 0.5rem' }}>
                  Link Único sem Login
                </h3>
                <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Gere um link público exclusivo com o slug do ensaio e envie no WhatsApp do cliente. Ele acessa a galeria instantaneamente no celular ou PC sem precisar criar conta ou memorizar senhas.
                </p>
              </div>

              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-warm-grey)',
                borderTop: '1px dashed var(--color-warm-grey-light)',
                paddingTop: '0.85rem'
              }}>
                ✓ Acesso com 1 clique pelo navegador<br />
                ✓ Zero atrito para o cliente
              </div>
            </div>

            {/* Passo 3 */}
            <div style={{
              backgroundColor: 'var(--color-paper)',
              border: '1px solid var(--color-warm-grey-light)',
              padding: '2.25rem 2rem',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-mark-red)' }}>
                  #003
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: '0.75rem 0 0.5rem' }}>
                  Seleção de Fotos
                </h3>
                <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  O cliente marca as fotos preferidas visualizando o traço vermelho de caneta sobre as molduras. No seu painel, você acompanha a contagem em tempo real e acessa a lista exata para tratamento.
                </p>
              </div>

              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-warm-grey)',
                borderTop: '1px dashed var(--color-warm-grey-light)',
                paddingTop: '0.85rem'
              }}>
                ✓ Traço vermelho de aprovação<br />
                ✓ Relatório em tempo real
              </div>
            </div>
          </div>

          {/* Destaques adicionais / Por que usar */}
          <div style={{
            marginTop: '4rem',
            backgroundColor: 'var(--color-paper)',
            border: '1px solid var(--color-warm-grey-light)',
            padding: '2.5rem 2rem',
            borderRadius: '4px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-ink)' }}>
                Fim da troca de e-mails
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)' }}>
                Chega de receber listas digitadas por e-mail com números de fotos confusos. Tudo fica registrado de forma visual e precisa.
              </p>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-ink)' }}>
                Identidade Fotográfica
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)' }}>
                Apresente seu trabalho em uma galeria com estética de folha de contato e mesa de luz que valoriza a arte do seu ensaio.
              </p>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-ink)' }}>
                Controle Total do Estúdio
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)' }}>
                Você decide quando criar, visualizar ou remover galerias. As fotos ficam seguras com acesso controlado no seu painel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Editorial */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid var(--color-warm-grey-light)',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        color: 'var(--color-warm-grey)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-ink)', fontWeight: 600 }}>
            PickMyShot
          </span>
        </div>
        <p>© 2026 PickMyShot — Plataforma Editorial de Seleção e Aprovação de Fotos.</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
          Desenvolvido por{' '}
          <a
            href="https://instagram.com/g.menegassi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-mark-red)', textDecoration: 'none', fontWeight: 600 }}
          >
            @gustavo
          </a>
        </p>
      </footer>

      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          if (onLoginSuccess) onLoginSuccess(user);
        }}
      />
    </div>
  );
}
