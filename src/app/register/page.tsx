'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
	const [login, setLogin] = useState('');
	const [senha, setSenha] = useState('');
	const [role, setRole] = useState('ADMIN');
	const [erro, setErro] = useState('');
	const [sucesso, setSucesso] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();
		setErro('');
		setSucesso('');
		setLoading(true);

		try {
			await api.post('/auth/register', { login, senha, role });
			setSucesso('Conta criada com sucesso! Redirecionando...');
			setTimeout(() => {
				router.push('/');
			}, 1500);
		} catch (err: any) {
			setErro(err.response?.data?.mensagem || 'Erro ao realizar cadastro.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 font-sans">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<span className="text-6xl">📝</span>
					<h1 className="mt-4 text-3xl font-extrabold text-blue-800 dark:text-blue-500 uppercase tracking-tighter">
						SOP-CE | Cadastro
					</h1>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Crie seu acesso ao sistema</p>
				</div>

				<div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
					<form className="space-y-6" onSubmit={handleRegister}>
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Novo Usuário</label>
							<input
								type="text"
								className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
								placeholder="Escolha um login"
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

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nível de Acesso</label>
							<select
								className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
								value={role}
								onChange={(e) => setRole(e.target.value)}
							>
								<option value="ADMIN">ADMINISTRADOR</option>
								<option value="USER">USUÁRIO COMUM</option>
							</select>
						</div>

						{erro && (
							<div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
								{erro}
							</div>
						)}

						{sucesso && (
							<div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
								{sucesso}
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-3 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Processando..." : "Criar Minha Conta"}
						</button>
					</form>

					<div className="mt-6 text-center">
						<Link href="/" className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline">
							← Voltar para o Login
						</Link>
					</div>
				</div>

				<p className="text-center text-xs text-gray-500">© 2026 Altwes - Gestão de Obras</p>
			</div>
		</main>
	);
}