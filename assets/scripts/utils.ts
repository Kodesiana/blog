export type Theme = 'dark' | 'light' | 'system' | 'dark:only' | 'light:only';

export const defaultTheme: Theme = 'dark';

export function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function attachEvent(selector: any, event: any, fn: (e: any, elem: any) => void) {
  const matches = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
  if (matches && matches.length) {
    matches.forEach((elem) => {
      elem.addEventListener(event, (e) => fn(e, elem), false);
    });
  }
}
