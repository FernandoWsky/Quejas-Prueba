const form = document.getElementById('complaintForm');
const identifiedFields = document.getElementById('identifiedFields');
const identityOptions = document.querySelectorAll('input[name="identity"]');
const anonymousOption = document.getElementById('anonymousOption');
const identifiedOption = document.getElementById('identifiedOption');
const description = document.getElementById('description');
const charCount = document.getElementById('charCount');
const attachment = document.getElementById('attachment');
const fileName = document.getElementById('fileName');
const successPanel = document.getElementById('successPanel');
const folioValue = document.getElementById('folioValue');

// Alterna entre reporte anónimo y reporte identificado.
identityOptions.forEach(option => {
  option.addEventListener('change', () => {
    const identified = option.value === 'identified' && option.checked;
    identifiedFields.hidden = !identified;
    anonymousOption.classList.toggle('selected', !identified);
    identifiedOption.classList.toggle('selected', identified);
    document.getElementById('fullName').required = identified;
    document.getElementById('email').required = identified;
  });
});

// Contador de caracteres del campo de descripción.
description.addEventListener('input', () => {
  charCount.textContent = `${description.value.length} / 1500`;
});

// Muestra el nombre del archivo elegido (aún no se carga a un servidor).
attachment.addEventListener('change', () => {
  const file = attachment.files[0];
  if (!file) {
    fileName.textContent = 'Ningún archivo seleccionado';
    return;
  }
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    attachment.value = '';
    fileName.textContent = 'El archivo supera el límite de 5 MB.';
    fileName.classList.add('file-error');
    return;
  }
  fileName.classList.remove('file-error');
  fileName.textContent = file.name;
});

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(node => node.textContent = '');
  document.querySelectorAll('[aria-invalid="true"]').forEach(node => node.removeAttribute('aria-invalid'));
}

function showError(field, message) {
  const error = document.querySelector(`[data-error="${field}"]`);
  if (error) error.textContent = message;
  const input = document.getElementById(field);
  if (input) input.setAttribute('aria-invalid', 'true');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  clearErrors();
  let valid = true;
  const category = document.getElementById('category');
  const subject = document.getElementById('subject');
  const consent = document.getElementById('consent');
  const isIdentified = document.querySelector('input[name="identity"]:checked').value === 'identified';
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');

  if (!category.value) { showError('category', 'Selecciona una categoría.'); valid = false; }
  if (!subject.value.trim()) { showError('subject', 'Escribe un asunto para tu reporte.'); valid = false; }
  if (description.value.trim().length < 20) { showError('description', 'Describe la situación con al menos 20 caracteres.'); valid = false; }
  if (isIdentified && !fullName.value.trim()) { fullName.setAttribute('aria-invalid', 'true'); valid = false; }
  if (isIdentified && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.setAttribute('aria-invalid', 'true'); valid = false; }
  if (!consent.checked) { showError('consent', 'Debes aceptar esta confirmación para continuar.'); valid = false; }

  if (!valid) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }

  // DEMO: el folio se genera localmente. No se almacena ni se envía a ningún servidor.
  const demoNumber = String(Math.floor(10000 + Math.random() * 90000));
  folioValue.textContent = `QIA-DEMO-${demoNumber}`;
  form.hidden = true;
  document.querySelector('.form-card-head').hidden = true;
  successPanel.hidden = false;
  successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.getElementById('copyFolio').addEventListener('click', async () => {
  const button = document.getElementById('copyFolio');
  try {
    await navigator.clipboard.writeText(folioValue.textContent);
    button.textContent = 'Copiado';
  } catch {
    button.textContent = 'Selecciona el folio';
  }
});

document.getElementById('newReport').addEventListener('click', () => {
  form.reset();
  clearErrors();
  identifiedFields.hidden = true;
  document.getElementById('fullName').required = false;
  document.getElementById('email').required = false;
  anonymousOption.classList.add('selected');
  identifiedOption.classList.remove('selected');
  charCount.textContent = '0 / 1500';
  fileName.textContent = 'Ningún archivo seleccionado';
  successPanel.hidden = true;
  form.hidden = false;
  document.querySelector('.form-card-head').hidden = false;
  document.getElementById('copyFolio').textContent = 'Copiar';
});

// El seguimiento se habilitará cuando exista una base de datos conectada.
document.getElementById('trackingForm').addEventListener('submit', event => {
  event.preventDefault();
  const code = document.getElementById('trackingCode').value.trim();
  const message = document.getElementById('trackingMessage');
  message.textContent = code
    ? 'La consulta todavía no está conectada. En esta etapa el formulario es una vista previa.'
    : 'Escribe tu número de folio para continuar.';
});

// Menú móvil.
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
