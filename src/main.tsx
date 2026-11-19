import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './styles/index.css'
import { App } from './App'

// Every fresh page load (first visit, refresh, opening a link) starts at the top of the page, so
// visitors always land on Home as the intro dissolves. The browser must not restore an earlier
// scroll position, and a `#section` left in the address (e.g. `/#projects` after using the menu)
// is dropped instead of jumping to that section. This runs before the router reads the URL;
// in-app navigation (menu links, back/forward) is handled by `ScrollManager` as usual.
history.scrollRestoration = 'manual'
if (location.hash) history.replaceState(history.state, '', location.pathname + location.search)
window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
