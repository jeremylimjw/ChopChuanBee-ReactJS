import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { AppProvider } from './providers/AppProvider';
import RequireAuth from './auth/RequireAuth';
import { View } from './enums/View';

import LoginPage from './components/LoginPage';
import MyTemplate from './components/MyTemplate';
import ManageAccountsPage from './components/admin/ManageAccountsPage';
import ViewAccountPage from './components/admin/ViewAccountPage';
import ViewLogsPage from './components/admin/ViewLogsPage';
import MyProfilePage from './components/general/MyProfilePage';
import MyLeavePage from './components/general/MyLeavePage';
import ManageEmployeesPage from './components/humanResource/ManageEmployeesPage';
import ViewEmployeePage from './components/humanResource/ViewEmployeePage';
import ManageLeavesPage from './components/humanResource/ManageLeavesPage';
import ManageProductsPage from './components/inventory/ManageProductsPage';
import ViewProductPage from './components/inventory/ViewProductPage';
import ManageSuppliersPage from './components/supplier/ManageSuppliersPage';
import ViewSupplierPage from './components/supplier/ViewSupplierPage';
import ManageCustomersPage from './components/customer/ManageCustomersPage';
import ViewCustomerPage from './components/customer/ViewCustomerPage';
import ManageProcurementsPage from './components/supplier/ManageProcurementsPage';
import NewProcurementPage from './components/supplier/NewProcurementPage';
import ViewProcurementPage from './components/supplier/ViewProcurementPage';
import ManageChargedUndersPage from './components/admin/ManageChargedUndersPage';
import ViewChargedUnderPage from './components/admin/ViewChargedUnderPage';
import ManageSalesOrdersPage from './components/customer/ManageSalesOrdersPage';
import NewSalesOrderPage from './components/customer/NewSalesOrderPage';
import ViewSalesOrderPage from './components/customer/ViewSalesOrderPage';

// Add on more routes here
const routes = [
  {
    path: '/',
    component: <MyTemplate />,
  },
  {
    path: '/admin',
    component: <Outlet />,
    childRoutes: [
      { 
        path: 'accounts', 
        component: <ManageAccountsPage />,
        viewAccess: View.ADMIN.name,
      },
      { 
        path: 'accounts/:id', 
        component: <ViewAccountPage />,
        viewAccess: View.ADMIN.name,
      },
      { 
        path: 'schemes', 
        component: <ManageChargedUndersPage />,
        viewAccess: View.ADMIN.name,
      },
      { 
        path: 'schemes/:id', 
        component: <ViewChargedUnderPage />,
        viewAccess: View.ADMIN.name,
      },
      { 
        path: 'logs', 
        component: <ViewLogsPage />,
        viewAccess: View.ADMIN.name,
      },
    ]
  },
  {
    path: '/myProfile',
    component: <MyProfilePage />,
  },
  {
    path: '/myLeaves',
    component: <MyLeavePage />,
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
        path: 'leaveApplications', 
        component: <ManageLeavesPage />,
        viewAccess: View.HR.name
      },
    ]
  },
  {
    path: '/inventory',
    component: <Outlet />,
    childRoutes: [
      { 
        path: 'products', 
        component: <ManageProductsPage />,
        viewAccess: View.INVENTORY.name,
      },
      { 
        path: 'products/:id', 
        component: <ViewProductPage />,
        viewAccess: View.INVENTORY.name,
      },
    ]
  },
  {
    path: "/supplier",
    component: <Outlet />,
    childRoutes: [
      {
        path: "suppliers",
        component: <ManageSuppliersPage />,
        viewAccess: View.SCM.name,
      },
      {
        path: "suppliers/:id",
        component: <ViewSupplierPage />,
        viewAccess: View.SCM.name,
      },
      { 
        path: 'procurements', 
        component: <ManageProcurementsPage />,
        viewAccess: View.SCM.name,
      },
      { 
        path: 'procurements/new', 
        component: <NewProcurementPage />,
        viewAccess: View.SCM.name,
      },
      { 
        path: 'procurements/:id', 
        component: <ViewProcurementPage />,
        viewAccess: View.SCM.name,
      },
    ],
  },
  {
    path: '/customer',
    component: <Outlet />,
    childRoutes: [
      { 
        path: 'customers', 
        component: <ManageCustomersPage />,
        viewAccess: View.CRM.name,
      },
      { 
        path: 'customers/:id', 
        component: <ViewCustomerPage />,
        viewAccess: View.CRM.name,
      },
      { 
        path: 'sales', 
        component: <ManageSalesOrdersPage />,
        viewAccess: View.SCM.name,
      },
      { 
        path: 'sales/new', 
        component: <NewSalesOrderPage />,
        viewAccess: View.SCM.name,
      },
      { 
        path: 'sales/:id', 
        component: <ViewSalesOrderPage />,
        viewAccess: View.SCM.name,
      },
    ]
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
