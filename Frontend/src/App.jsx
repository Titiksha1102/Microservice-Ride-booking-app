import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MyComponent from './MyComponent'
import MapComponent from './MapComponent'
import PlacesComponent from './PlacesComponent'
import PlacesComponent2 from './PlacesComponent2'
import PlacesComponent3 from './PlacesComponent3'
import PlacesComponent4 from './PlacesComponent4'
import { Route, Routes } from 'react-router-dom'
import UserSignup from './pages/UserSignup'
import UserLogin from './pages/UserLogin'
import Error from './pages/Error'
import UserProtectedRoute from './components/UserProtectedRoute'
import UserPublicRoute from './components/UserPublicRoute'
import UserHome from './pages/userHome'
import CaptainHome from './pages/CaptainHome'
import Landing from './pages/Landing'
import Layout from './components/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Layout>
        <Routes>
          <Route element={<UserProtectedRoute />}>
            <Route path='/user/home' element={<UserHome />}></Route>
          </Route>
          <Route element={<UserPublicRoute />}>
            <Route path='/' element={<UserLogin />}></Route>
            <Route path='/user/login' element={<UserLogin />}></Route>
            <Route path='/user/signup' element={<UserSignup />}></Route>
          </Route>

          <Route path='/captain/home' element={<CaptainHome />}></Route>
          <Route path='/captain/login'></Route>
          <Route path='/captain/signup'></Route>

          <Route path='/places' element={<PlacesComponent4 />}></Route>
          <Route path='/error' element={<Error />}></Route>
        </Routes>
      </Layout>

      {/* <PlacesComponent4 /> */}
    </>
  )
}

export default App
