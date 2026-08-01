import React from 'react';
import { Camera, ArrowLeft } from 'lucide-react';

export function NotFoundPage({ onBackToLanding }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-paper)',
      color: 'var(--color-ink)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Header Editorial */}
      <header className="header-responsive" style={{
        borderBottom: '1px solid var(--color-warm-grey-light)',
        padding: '1.25rem 2rem',
        backgroundColor: 'var(--color-paper)'
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
      </header>

      {/* Conteúdo Principal */}
      <main style={{
        padding: '3rem 1.5rem',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="contact-frame" style={{
          maxWidth: '420px',
          width: '100%',
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-warm-grey)',
            marginBottom: '0.75rem'
          }}>
            <span>FRAME #404</span>
            <span style={{ color: 'var(--color-mark-red)', fontWeight: 600 }}>✘ NÃO ENCONTRADO</span>
          </div>

          <div style={{
            width: '100%',
            height: '220px',
            backgroundColor: 'var(--color-paper-muted)',
            border: '1px dashed var(--color-warm-grey-light)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '4.5rem',
              fontWeight: 700,
              color: 'var(--color-mark-red)',
              lineHeight: 1
            }}>
              404
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-warm-grey)',
              letterSpacing: '0.1em',
              marginTop: '0.5rem'
            }}>
              MOLDURA VAZIA
            </span>
          </div>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 600,
          marginBottom: '1rem',
          lineHeight: 1.2
        }}>
          Página não encontrada
        </h1>

        <p style={{
          color: 'var(--color-ink-muted)',
          fontSize: '1.05rem',
          maxWidth: '540px',
          margin: '0 auto 2rem'
        }}>
          O link que você tentou acessar não existe, mudou de endereço ou a galeria de ensaio não está mais disponível.
        </p>

        <button
          onClick={onBackToLanding || (() => window.location.href = '/')}
          className="btn-mark"
          style={{ fontSize: '0.95rem', padding: '0.85rem 1.6rem' }}
        >
          <ArrowLeft size={18} /> Voltar à Página Inicial
        </button>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem 1.5rem',
        borderTop: '1px solid var(--color-warm-grey-light)',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        color: 'var(--color-warm-grey)'
      }}>
        <p>© 2026 PickMyShot — Plataforma Editorial de Seleção e Aprovação de Fotos.</p>
      </footer>
    </div>
  );
}
