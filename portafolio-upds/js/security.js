const REGEX_RULES = {
  name: /^[a-zA-ZÀ-ÿ\s]{3,45}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[67][0-9]{7}$/,
  message: /^[^<>]{10,120}$/
};

const FORMAT_HINTS = {
  name: 'Formato invalido: usa solo letras y espacios (3 a 45 caracteres).',
  email: 'Formato invalido: ejemplo esperado estudiante@upds.edu.bo',
  phone: 'Formato invalido: debe iniciar con 6 o 7 y tener 8 digitos (Ej: 71234567).',
  message: 'Formato invalido: escribe entre 10 y 120 caracteres sin signos < o >.'
};

export function sanitizeText(rawValue) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return String(rawValue).replace(/[&<>"'/]/g, (char) => map[char]);
}

export function validateField(fieldName, value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, error: 'Este campo es obligatorio.' };
  }
  const rule = REGEX_RULES[fieldName];
  if (!rule) {
    return { valid: true, error: '' };
  }
  const isValid = rule.test(trimmed);
  return {
    valid: isValid,
    error: isValid ? '' : FORMAT_HINTS[fieldName]
  };
}