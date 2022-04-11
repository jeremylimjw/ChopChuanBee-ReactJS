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
import ManageBalanceSheetPage from './components/accounting/ManageBalanceSheetPage';
import ViewBalanceSheetPage from './components/accounting/ViewBalanceSheetPage';
import ViewIncomeStatementPage from './components/accounting/ViewIncomeStatementPage';
import ManageIncomeStatementPage from './components/accounting/ManageIncomeStatementPage';
import ManageTaxStatementPage from './components/accounting/ManageTaxStatementPage';
import ManageProcurementsPage from './components/supplier/ManageProcurementsPage';
import NewProcurementPage from './components/supplier/NewProcurementPage';
import ViewProcurementPage from './components/supplier/ViewProcurementPage';
import ManageChargedUndersPage from './components/admin/ManageChargedUndersPage';
import ViewChargedUnderPage from './components/admin/ViewChargedUnderPage';
import ManageSalesOrdersPage from './components/customer/ManageSalesOrdersPage';
import NewSalesOrderPage from './components/customer/NewSalesOrderPage';
import ViewSalesOrderPage from './components/customer/ViewSalesOrderPage';
import ViewInventoryMovementsPage from './components/inventory/ViewInventoryMovementsPage';
import ManageDeliveriesPage from './components/dispatch/ManageDeliveriesPage';
import ActivatePage from './components/ActivatePage';
import ViewSORAPage from './components/customer/ViewSORAPage';
import ManageItinerarysPage from './components/dispatch/ManageItinerarysPage';
import NewItineraryPage from './components/dispatch/NewItineraryPage';
import ViewItineraryPage from './components/dispatch/ViewItineraryPage';
import CompleteDeliveryPage from './components/CompleteDeliveryPage';
<<<<<<< HEAD
import TodayDashboard from './components/analytics/TodayDashboard';
import PaymentsDashboard from './components/analytics/PaymentsDashboard';
import ProfitabilityDashboard from './components/analytics/ProfitabilityDashboard';
import InventoryDashboard from './components/analytics/InventoryDashboard';
import ProductDashboard from './components/analytics/ProductDashboard';
=======
import ManageCataloguePage from './components/catalogue/ManageCataloguePage';
import ManageCategoryPage from './components/catalogue/ManageCategoryPage';
import ViewCataloguePage from './components/catalogue/ViewCataloguePage';
import ViewCategoryPage from './components/catalogue/ViewCategoryPage';
>>>>>>> master
import Home from './components/Home';

// Add on more routes here
const routes = [
  {
    path: '/',
    component: <Home />,
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
        path: 'companyDetails', 
        component: <ManageChargedUndersPage />,
        viewAccess: View.ADMIN.name,
      },
      { 
        path: 'companyDetails/:id', 
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
      { 
        path: 'movements', 
        component: <ViewInventoryMovementsPage />,
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
      { 
        path: 'customers/SORA/:id', 
        component: <ViewSORAPage />,
        viewAccess: View.SCM.name,
      },
    ]
  },
  {
    path: "/accounting",
    component: <Outlet />,
    childRoutes: [
      {
        path: "balanceSheets",
        component: <ManageBalanceSheetPage />,
        viewAccess: View.ACCOUNTING.name,
      },
      {
        path: "balanceSheets/:id",
        component: <ViewBalanceSheetPage />,
        viewAccess: View.ACCOUNTING.name,
      },
      {
        path: "incomeStatements",
        component: <ManageIncomeStatementPage />,
        viewAccess: View.ACCOUNTING.name,
      },
      {
        path: "incomeStatements/:id",
        component: <ViewIncomeStatementPage />,
        viewAccess: View.ACCOUNTING.name,
      },
      {
        path: "taxStatements",
        component: <ManageTaxStatementPage />,
        viewAccess: View.ACCOUNTING.name,
      },
    ],
  },
  { 
    path: '/dispatch',
    component: <Outlet />,
    childRoutes: [
      { 
        path: 'itinerarys', 
        component: <ManageItinerarysPage />,
        viewAccess: View.DISPATCH.name,
      },
      { 
        path: 'itinerarys/new', 
        component: <NewItineraryPage />,
        viewAccess: View.DISPATCH.name,
      },
      { 
        path: 'itinerarys/:id', 
        component: <ViewItineraryPage />,
        viewAccess: View.DISPATCH.name,
      },
      { 
        path: 'deliveryOrders', 
        component: <ManageDeliveriesPage />,
        viewAccess: View.DISPATCH.name,
      },
    ]
  },
  {
    path: '/analytics',
    component: <Outlet />,
    childRoutes: [
      {
        path: 'todayDashboard',
        component: <TodayDashboard />,
        viewAccess: View.ANALYTICS.name,
      },
      {
        path: 'paymentsDashboard',
        component: <PaymentsDashboard />,
        viewAccess: View.ANALYTICS.name,
      },
      {
        path: 'profitabilityDashboard',
        component: <ProfitabilityDashboard />,
        viewAccess: View.ANALYTICS.name,
      },
      {
        path: 'inventoryDashboard',
        component: <InventoryDashboard />,
        viewAccess: View.ANALYTICS.name,
      },
      {
        path: 'productDashboard',
        component: <ProductDashboard />,
        viewAccess: View.ANALYTICS.name,
      },
    ],
  },
  {
    path: '/catalogue',
    component: <Outlet />,
    childRoutes: [
      {
        path: 'menuItems',
        component: <ManageCataloguePage />,
        viewAccess: View.CATALOGUE.name,
      },
      {
        path: 'menuItems/:id',
        component: <ViewCataloguePage />,
        viewAccess: View.CATALOGUE.name,
      },
      {
        path: 'categories',
        component: <ManageCategoryPage />,
        viewAccess: View.CATALOGUE.name,
      },
      {
        path: 'categories/:id',
        component: <ViewCategoryPage />,
        viewAccess: View.CATALOGUE.name,
      },
    ],
  }
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
            <Route path="/activate" element={<ActivatePage />} />
            <Route path="/completeDelivery" element={<CompleteDeliveryPage />} />
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