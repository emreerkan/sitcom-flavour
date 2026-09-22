// Copy-to-clipboard for every `button[data-copy]` on the page. The value is
// read at click time, so pages can update `data-copy` as state changes.

for (const btn of document.querySelectorAll<HTMLButtonElement>('button[data-copy]')) {
  btn.addEventListener('click', async () => {
    if (btn.disabled) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy ?? '');
    } catch {
      return;
    }
    btn.dataset.done = '';
    const status = btn.querySelector('.copied');
    if (status) status.textContent = 'Copied';
    setTimeout(() => {
      delete btn.dataset.done;
      if (status) status.textContent = '';
    }, 1600);
  });
}
