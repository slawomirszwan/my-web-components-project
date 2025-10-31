// Pomocnicze funkcje dla Web Components
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function generateId(prefix = 'comp') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export function dispatchCustomEvent(element, eventName, detail = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true
  });
  element.dispatchEvent(event);
}