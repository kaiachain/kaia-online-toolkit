import { ReactElement } from 'react'
import { Outlet } from 'react-router'
import { ToastContainer, Slide } from 'react-toastify'
import AppProvider from './AppProvider'

function App(): ReactElement {
  return (
    <AppProvider>
      <Outlet />
      <ToastContainer
        position="top-right"
        hideProgressBar
        autoClose={3000}
        transition={Slide}
        limit={3}
        theme="dark"
      />
    </AppProvider>
  )
}

export default App
