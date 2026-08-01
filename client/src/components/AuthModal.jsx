import React, { useState } from 'react';
import { X, Camera, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { api } from '../services/api';

export function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email, senha: formData.senha }
        : { nome: formData.nome, email: formData.email, senha: formData.senha };

      const response = await api.post(endpoint, payload);
      const { token, user } = response.data;

      localStorage.setItem('@pickmyshot:token', token);
      localStorage.setItem('@pickmyshot:user', JSON.stringify(user));

      onSuccess(user);
      onClose();
    } catch (err) {
      console.error('Erro na autenticação:', err);
      const msg = err.response?.data?.error || err.response?.data?.details?.[0] || 'Ocorreu um erro ao processar sua solicitação.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(26, 24, 21, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#F7F5F0',
        border: '1px solid #8A8578',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8A8578'
          }}
        >
          <X size={20} />
        </button>

        {/* Header do Modal */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#1A1815',
            color: '#F7F5F0',
            marginBottom: '1rem'
          }}>
            <Camera size={24} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: '#1A1815', marginBottom: '0.25rem' }}>
            {isLogin ? 'Acessar Painel do Fotógrafo' : 'Criar Conta de Fotógrafo'}
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#8A8578' }}>
            {isLogin ? 'CONTATO SHEET — LOGIN' : 'REGISTRO DE NOVO ESTÚDIO'}
          </p>
        </div>

        {/* Alternador Login / Cadastro */}
        <div style={{
          display: 'flex',
          backgroundColor: '#EFECE6',
          borderRadius: '4px',
          padding: '4px',
          marginBottom: '1.5rem',
          border: '1px solid #D9D5CC'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: '3px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              backgroundColor: isLogin ? '#1A1815' : 'transparent',
              color: isLogin ? '#F7F5F0' : '#8A8578',
              transition: 'all 0.2s'
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: '3px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              backgroundColor: !isLogin ? '#1A1815' : 'transparent',
              color: !isLogin ? '#F7F5F0' : '#8A8578',
              transition: 'all 0.2s'
            }}
          >
            Criar Conta
          </button>
        </div>

        {/* Alerta de Erro */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(193, 59, 46, 0.1)',
            borderLeft: '3px solid #C13B2E',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#C13B2E',
            fontSize: '0.85rem',
            borderRadius: '2px'
          }}>
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#1A1815' }}>
                Nome do Fotógrafo ou Estúdio
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A8578' }} />
                <input
                  type="text"
                  name="nome"
                  required
                  placeholder="Ex: Studio Mariana Silva"
                  value={formData.nome}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    borderRadius: '4px',
                    border: '1px solid #8A8578',
                    backgroundColor: '#FFFFFF',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    color: '#1A1815'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#1A1815' }}>
              E-mail Profissional
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A8578' }} />
              <input
                type="email"
                name="email"
                required
                placeholder="seu.email@estudio.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '4px',
                  border: '1px solid #8A8578',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  color: '#1A1815'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#1A1815' }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A8578' }} />
              <input
                type="password"
                name="senha"
                required
                placeholder="••••••••"
                value={formData.senha}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '4px',
                  border: '1px solid #8A8578',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  color: '#1A1815'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar no Painel' : 'Criar Minha Conta')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
