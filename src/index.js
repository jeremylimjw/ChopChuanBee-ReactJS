import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import LoginPage from './pages/LoginPage';
import { AppProvider } from './providers/AppProvider';
import RequireAuth from './auth/RequireAuth';
import MyTemplate from './pages/MyTemplate';
import MyLayout from './components/layout/MyLayout';


// Add on more routes here
const routes = [
  {
    path: '/',
    bannerPath: ['Employee', 'Leave'],
    bannerTitle: 'Template',
    component: <MyTemplate />,
  },
  {
    path: '/customers',
    bannerPath: ['Customer'],
    bannerTitle: 'Customers Component',
    component: <div>Customers Component</div>,
    viewAccess: "CRM",
  },

]

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RequireAuth><App /></RequireAuth>}>

              { routes.map((route, index) => <Route path={route.path} key={index}
                element={
                  <RequireAuth viewAccess={route.viewAccess}>
                    <MyLayout bannerPath={route.bannerPath} bannerTitle={route.bannerTitle}>
                      {route.component}
                    </MyLayout>
                  </RequireAuth>} />)
              }

              {/* --- Please do not write this way anymore! --- */}
              {/* <Route path='/suppliers' element={<RequireAuth viewAccess="SCM"><div>Suppliers Component</div></RequireAuth>} />
              <Route path='/human-resource/' element={<RequireAuth viewAccess="HR"><div>Human resource Component</div></RequireAuth>} />
              <Route path='/accounting/create/expense' element={<div />} />
              <Route path='/accounting/create/income' element={<div />} />
              <Route path='/accounting/pnl' element={<div />} />
              <Route path='/accounting' element={<div>Accounting</div>} />

              <Route path='/sales/return' element={<div />} />
              <Route path='/sales/create' element={<div />} />
              <Route path='/sales/:invoiceId' element={<div />} />
              <Route path='/sales' element={<div />} />

              <Route path='/customers/accounts' element={<div />} />
              <Route path='/customers/create' element={<div />} />
              <Route path='/customers/:custId' element={<div />} />

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
              <Route path='/settings' element={<div />} /> */}
            </Route>
          </Routes>
        </Layout>
      </AppProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
