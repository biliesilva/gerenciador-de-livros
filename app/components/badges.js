function createStatusBadge(status) {
  const badge = document.createElement('span');
  badge.className = 'status-badge';
  
  switch (status) {
    case 'Quero ler':
      badge.classList.add('quero-ler');
      break;
    case 'Lendo':
      badge.classList.add('lendo');
      break;
    case 'Lido':
      badge.classList.add('lido');
      break;
  }
  
  const icon = document.createElement('span');
  icon.className = 'status-icon';
  
  const text = document.createTextNode(status);
  
  badge.appendChild(icon);
  badge.appendChild(text);
  
  return badge;
}

function getBadgeClass(status) {
  switch (status) {
    case 'Quero ler':
      return 'quero-ler';
    case 'Lendo':
      return 'lendo';
    case 'Lido':
      return 'lido';
    default:
      return '';
  }
}