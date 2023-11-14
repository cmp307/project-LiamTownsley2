import { useState } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom'
import Home from './pages/Home'
import Assets from './pages/Assets'
import './styles/index.scss'
import Employees from './pages/Employees'
import CreateAssets from './pages/CreateAsset'
import Error404 from './pages/Error404'
import Asset from './pages/Asset'
import Employee from './pages/Employee'
import Login from './pages/Login'

function App() {
  const [user, setUser] = useState(undefined as any);
  if(!user) return <Login setUser={setUser} user={user} />

  return (
    <>
      <HashRouter>
        <Routes>
          <Route index element={<Home setUser={setUser} user={user} />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/:id" element={<Asset />} />
          <Route path="/assets/create" element={<CreateAssets />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/:id" element={<Employee />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
