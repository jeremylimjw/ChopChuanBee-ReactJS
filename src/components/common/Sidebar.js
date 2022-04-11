import React from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
<<<<<<< HEAD
import { HomeOutlined, InboxOutlined, ShoppingOutlined, SolutionOutlined, TeamOutlined, UserOutlined, CarOutlined, AccountBookOutlined, LineChartOutlined } from '@ant-design/icons/lib/icons'
=======
import { HomeOutlined, InboxOutlined, ShoppingOutlined, SolutionOutlined, TeamOutlined, UserOutlined, CarOutlined ,AccountBookOutlined, DesktopOutlined } from '@ant-design/icons/lib/icons'
>>>>>>> master
import { useApp } from '../../providers/AppProvider'
import { useLocation } from "react-router-dom";
import { View } from '../../enums/View'


// Add on more menu items here
export const menu = [
  {
    role: View.ADMIN.name,
    title: 'Admin',
    icon: <UserOutlined />,
    items: [
      { route: '/admin/accounts', name: 'Manage Accounts' },
      { route: '/admin/companyDetails', name: 'Company Details' },
      { route: '/admin/logs', name: 'Logs' },
    ]
  },
  {
    role: View.HR.name,
    title: 'Human Resource',
    icon: <TeamOutlined />,
    items: [
      { route: '/humanResource/employees', name: 'Manage Employees' },
      { route: '/humanResource/leaveApplications', name: 'Leave Applications' },
    ]
  },
  {
    role: View.INVENTORY.name,
    title: 'Inventory',
    icon: <InboxOutlined />,
    items: [
      { route: '/inventory/products', name: 'Manage Products' },
      { route: '/inventory/movements', name: 'Inv. Movements' },
    ]
  },
  {
    role: View.SCM.name,
    title: 'Supplier',
    icon: <ShoppingOutlined />,
    items: [
      { route: '/supplier/suppliers', name: 'Manage Suppliers' },
      { route: '/supplier/procurements', name: 'Procurements' },
    ]
  },
  {
    role: View.CRM.name,
    title: 'Customer',
    icon: <SolutionOutlined />,
    items: [
      { route: '/customer/customers', name: 'Manage Customers' },
      { route: '/customer/sales', name: 'Sales' },
    ]
  },
  {
    role: View.ACCOUNTING.name,
    title: 'Accounting',
    icon: <AccountBookOutlined />,
    items: [
      { route: '/accounting/balanceSheets', name: 'Balance Sheets' },
      { route: '/accounting/incomeStatements', name: 'Income Statements' },
      { route: '/accounting/taxStatements', name: 'Tax Statements' },
    ]
  },
  {
    role: 'ACCOUNTING',
    title: 'Analytics',
    icon: <LineChartOutlined />,
    items: [
      { route: '/analytics/todayDashboard', name: 'Today Dashboard' },
      { route: '/analytics/profitabilityDashboard', name: 'Profitability Dashboard' },
      { route: '/analytics/paymentsDashboard', name: 'Payments Dashboard' },        
      { route: '/analytics/inventoryDashboard', name: 'Inventory Dashboard'},
      { route: '/analytics/productDashboard', name: 'Product Dashboard'},
    ],
  },
  {
    role: View.DISPATCH.name,
    title: 'Dispatch',
    icon: <CarOutlined />,
    items: [
      { route: '/dispatch/itinerarys', name: 'Manage Itineraries' },
      { route: '/dispatch/deliveryOrders', name: 'Manage Deliveries' },
    ]
  },
  {
    role: View.CATALOGUE.name,
    title: 'Catalogue',
    icon: <DesktopOutlined />,
    items: [
      { route: '/catalogue/menuItems', name: 'Manage Menu Items' },
      { route: '/catalogue/categories', name: 'Manage Categories' },
    ],
  },
]

export function Sidebar() {

    const { hasViewAccessTo } = useApp();
    const location = useLocation();

    return (
      <Layout.Sider theme='light' width={210} style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
        <Menu mode='inline' selectedKeys={[location.pathname]}>
          <Menu.Item key='/' icon={<HomeOutlined />}>
            <Link to='/'>Home</Link>
          </Menu.Item>

          {menu.map((menuItem, index) => {
            if (hasViewAccessTo(menuItem.role)) {
              return (
                <Menu.SubMenu key={index} title={menuItem.title} icon={menuItem.icon}>
                  {menuItem.items.map((subMenu, index2) => (
                    <Menu.Item key={subMenu.route}>
                      <Link to={subMenu.route}>{subMenu.name}</Link>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              );
            }
            return null;
          })}
        </Menu>
      </Layout.Sider>
    );
}
