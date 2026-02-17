'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { login, senha });
      localStorage.setItem('@gestao-obras:token', response.data.dados.token);
      router.push('/dashboard');
    } catch (err: any) {
      setErro('Acesso Negado: Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <span className="text-6xl">🏗️</span>
          <h1 className="mt-4 text-3xl font-extrabold text-blue-800 dark:text-blue-500 uppercase tracking-tighter">
            SOP-CE | Obras
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sistema de Gestão e Medições</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuário</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Digite seu login"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {erro && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200 animate-pulse">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Autenticando..." : "Entrar no Sistema"}
            </button>
            <div className="mt-4 text-center">
              <Link href="/register" className="text-sm text-blue-700 dark:text-blue-400 hover:underline">
                Não tem uma conta? Cadastre-se
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500">© 2026 Altwes - Gestão de Obras</p>
      </div>
    </main>
  );
}