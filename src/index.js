import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import LoginPage from './pages/LoginPage';
import ManageAccountsPage from './pages/Accounts/ManageAccountsPage';
import AdminNewAccountFormPage from './pages/Accounts/AdminNewAccountFormPage';
import ProfilePage from './pages/ProfilePage';
import { AppProvider } from './providers/AppProvider';
import RequireAuth from './auth/RequireAuth';
import ManageEmployeesPage from './pages/HumanResource/ManageEmployeesPage';
import ViewEmployeePage from './pages/HumanResource/ViewEmployeePage';
import MyLeavesPage from './pages/MyLeavesPage';
import MyTemplate from './pages/MyTemplate';
import { View } from './enums/View';
import ViewLogs from './pages/Log/ViewLogs';
import ManageCustomersPage from './pages/Customer/ManageCustomersPage';
import ViewCustomerPage from './pages/Customer/ViewCustomerPage';
import ManageProductsPage from './pages/Product/ManageProductsPage';
import ViewProductPage from './pages/Product/ViewProductPage';
import ManageSuppliersPage from "./pages/Supplier/ManageSuppliersPage";
import ViewSupplierPage from "./pages/Supplier/ViewSupplierPage";
import ViewAccountPage from './pages/Accounts/ViewAccountPage';
import ManageLeavesPage from './pages/HumanResource/ManageLeavesPage';

// Add on more routes here
const routes = [
  {
    path: '/',
    component: <MyTemplate />,
  },
  {
    path: '/accounts',
    component: <Outlet />,
    childRoutes: [
      { 
        path: '', 
        component: <ManageAccountsPage />,
        viewAccess: View.ADMIN.name,
      },
      { 
        path: ':id', 
        component: <ViewAccountPage />,
        viewAccess: View.ADMIN.name,
      },
      { 
        path: 'new', 
        component: <AdminNewAccountFormPage />,
        viewAccess: View.ADMIN.name,
      },
    ]
  },
  {
    path: '/myprofile',
    component: <ProfilePage />,
  },
  {
    path: '/myleaves',
    component: <MyLeavesPage />,
  },
  {
    path: 'humanResource',
    component: <Outlet />,
    childRoutes: [
      { 
        path: 'employees', 
        component: <ManageEmployeesPage />,
        viewAccess: View.HR.name
      },
      { 
        path: 'employees/:id', 
        component: <ViewEmployeePage />,
        viewAccess: View.HR.name
      },
      { 
        path: 'employees/leaves', 
        component: <ManageLeavesPage />,
        viewAccess: View.HR.name
      },
    ]
  },
  {
    path: '/customers',
    component: <Outlet />,
    childRoutes: [
      { 
        path: '', 
        component: <ManageCustomersPage />,
        viewAccess: View.CRM.name,
      },
      { 
        path: ':id', 
        component: <ViewCustomerPage />,
        viewAccess: View.CRM.name,
      },
    ]
  },
  {
    path: '/products',
    component: <Outlet />,
    childRoutes: [
      { 
        path: '', 
        component: <ManageProductsPage />,
        viewAccess: View.INVENTORY.name,
      },
      { 
        path: ':id', 
        component: <ViewProductPage />,
        viewAccess: View.INVENTORY.name,
      },
    ]
  },
  {
    path: '/logs',
    component: <ViewLogs />,
    viewAccess: View.ADMIN.name,
  },
  {
    path: "/suppliers",
    component: <Outlet />,
    childRoutes: [
      {
        path: "",
        component: <ManageSuppliersPage />,
        viewAccess: View.SCM.name,
      },
      {
        path: ":id",
        component: <ViewSupplierPage />,
        viewAccess: View.SCM.name,
      },
    ],
  },
];

function renderRoute(route, index) {
    if (route.childRoutes == null) {
        return (
            <Route
                path={route.path}
                key={index}
                element={<RequireAuth viewAccess={route.viewAccess}>{route.component}</RequireAuth>}
            ></Route>
        );
    } else {
        const childRoutes = route.childRoutes.map((childRoute, index2) => (
            <Route
                path={childRoute.path}
                key={index2}
                element={<RequireAuth viewAccess={childRoute.viewAccess}>{childRoute.component}</RequireAuth>}
            ></Route>
        ));

        return (
            <Route
                path={route.path}
                key={index}
                element={
                    <RequireAuth viewAccess={route.viewAccess}>
                        <Outlet />
                    </RequireAuth>
                }
            >
                {childRoutes}
            </Route>
        );
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
              {routes.map((route, index) => renderRoute(route, index))}
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
