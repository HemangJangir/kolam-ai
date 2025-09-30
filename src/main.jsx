import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import OrganizeEventPage from './pages/OrganizeEventPage.jsx'
import GeneratorPage from './pages/GeneratorPage.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/organize-event', element: <OrganizeEventPage /> },
  { path: '/generate', element: <GeneratorPage /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)


