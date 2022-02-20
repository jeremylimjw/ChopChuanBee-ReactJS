import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { AppProvider } from './providers/AppProvider';
import RequireAuth from './auth/RequireAuth';
import HRLeavePage from './pages/HRLeavePage'
import HREmployeeManagementPage from './pages/HREmployeeManagementPage';
import ViewEmployeePage from './pages/ViewEmployeePage';
import MyLeavesPage from './pages/MyLeavesPage';
import MyTemplate from './pages/MyTemplate';


// Add on more routes here
const routes = [
  {
    path: '/',
    component: <MyTemplate />,
  },
  {
    path: '/customers',
    component: <div>Customers Component</div>,
    viewAccess: "CRM",
  },
  {
    path: '/human-resource/leaves',
    component: <HRLeavePage />,
    viewAccess: 'HR'
  },
  {
    path: '/human-resource/employees',
    component: <HREmployeeManagementPage />,
    viewAccess: 'HR'
  },
  {
    path: '/human-resource/employees/:employeeId',
    component: <ViewEmployeePage />,
    viewAccess: 'HR'
  },
  {
    path: '/user/profile',
    component: <ProfilePage />,
  },
  {
    path: '/user/leaves',
    component: <MyLeavesPage />,
  },

]

function renderRoute(route, index) {
  if (route.childRoutes == null) {
    return (
      <Route path={route.path} key={index} element={
        <RequireAuth viewAccess={route.viewAccess}>
          {route.component}
        </RequireAuth>}>
      </Route>);

  } else {
    const childRoutes = route.childRoutes.map((childRoute, index2) =>
      <Route path={childRoute.path} key={index2} element={
        <RequireAuth viewAccess={childRoute.viewAccess}>
          {childRoute.component}
        </RequireAuth>}>
      </Route>);

    return (
      <Route path={route.path} key={index} element={<RequireAuth viewAccess={route.viewAccess}><Outlet /></RequireAuth>}>
        {childRoutes}
      </Route>);
  }

}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RequireAuth><App /></RequireAuth>}>
              <Route path='/human-resource/' element={<RequireAuth viewAccess="HR"><div>Human resource Component</div></RequireAuth>} />
              <Route path='/human-resource/leaves' element={<HRLeavePage />} />
              <Route path='/human-resource/employees' element={<HREmployeeManagementPage />} />
              <Route path='/human-resource/employees/:employeeId' element={<ViewEmployeePage />} />
              <Route path='/user/profile' element={<ProfilePage />} />
              <Route path='/user/leaves' element={<MyLeavesPage />} />

              {routes.map((route, index) => renderRoute(route, index))}

              {/* <Route path='/suppliers' element={<RequireAuth viewAccess="SCM"><div>Suppliers Component</div></RequireAuth>} />
              {/* <Route path='/accounting/create/expense' element={<div />} />
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