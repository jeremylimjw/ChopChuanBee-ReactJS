import React from 'react'
import 'antd/dist/antd.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Sidebar from './components/layout/Sidebar'
import LoginPage from './pages/LoginPage'
import Navbar from './components/layout/Navbar'
import ContentContainer from './components/layout/ContentContainer'

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Layout>
          <Sidebar />
          <ContentContainer>
            <Routes>
              <Route path='/accounting/create/expense' element={<div />} />
              <Route path='/accounting/create/income' element={<div />} />
              <Route path='/accounting/pnl' element={<div />} />
              <Route path='/accounting' element={<div />} />

              <Route path='/sales/return' element={<div />} />
              <Route path='/sales/create' element={<div />} />
              <Route path='/sales/:invoiceId' element={<div />} />
              <Route path='/sales' element={<div />} />

              <Route path='/customers/accounts' element={<div />} />
              <Route path='/customers/create' element={<div />} />
              <Route path='/customers/:custId' element={<div />} />
              <Route path='/customers' element={<div />} />

              <Route path='/products/create' element={<div />} />
              <Route path='/products/:productId' element={<div />} />
              <Route path='/products' element={<div />} />

              <Route path='/inventory/supplier-invoices/create' element={<div />} />
              <Route path='/inventory/supplier-invoices' element={<div />} />
              <Route path='/inventory/record/damaged' element={<div />} />
              <Route path='/inventory/record/return' element={<div />} />
              <Route path='/inventory/:inventoryId' element={<div />} />
              <Route path='/inventory' element={<div />} />

              <Route path='/suppliers/accounts' element={<div />} />
              <Route path='/suppliers/create' element={<div />} />
              <Route path='/suppliers/:supplierId' element={<div />} />
              <Route path='/suppliers' element={<div />} />

              <Route path='/human-resource/leaves/:leaveId' element={<div />} />
              <Route path='/human-resource/leaves/create' element={<div />} />
              <Route path='/human-resource/leaves' element={<div />} />
              <Route path='/human-resource/employees' element={<div />} />
              <Route path='/human-resource/employees/:employeeId' element={<div />} />

              <Route path='/admin/logs' element={<div />} />
              <Route path='/admin/accounts/:accountId' element={<div />} />
              <Route path='/admin/accounts/create' element={<div />} />
              <Route path='/admin/accounts/' element={<div />} />

              <Route path='/user/leave/apply' element={<div />} />
              <Route path='/user/leave' element={<div />} />
              <Route path='/user/profile' element={<div />} />

              <Route path='/home' element={<div />} />
              <Route path='/resetPassword' element={<div />} />
              <Route path='/' element={<LoginPage />} />
            </Routes>
          </ContentContainer>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App
