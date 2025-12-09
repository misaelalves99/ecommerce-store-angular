// src/app/core/utils/validation.utils.ts

/**
 * Funções de validação reutilizáveis em formulários.
 */

export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function hasMinLength(
  value: string | null | undefined,
  min: number,
): boolean {
  if (!value) return false;
  return value.trim().length >= min;
}

export function isEmailValid(
  value: string | null | undefined,
): boolean {
  if (!value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.toLowerCase());
}

export function isCepBrValid(
  value: string | null | undefined,
): boolean {
  if (!value) return false;
  const numeric = value.replace(/\D/g, '');
  return numeric.length === 8;
}

export function isCnpjValid(
  value: string | null | undefined,
): boolean {
  if (!value) return false;
  const cnpj = value.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(0))) return false;

  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === Number(digitos.charAt(1));
}

/**
 * Mapeia erros do Firebase Auth para mensagens amigáveis.
 * Aceita `unknown` para funcionar bem com `catchError`.
 */
export function mapFirebaseAuthErrorToMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  const e = error as { code?: string; message?: string };

  const code = e?.code ?? '';
  if (!code) {
    return e?.message ?? fallbackMessage;
  }

  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Falha de rede ao comunicar com o servidor de autenticação.';
    default:
      return fallbackMessage;
  }
}
