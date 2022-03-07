import React from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { HomeOutlined, InboxOutlined, ShoppingOutlined, SolutionOutlined, TeamOutlined, UserOutlined, AccountBookOutlined } from '@ant-design/icons/lib/icons'
import { useApp } from '../../providers/AppProvider'


// Add on more menu items here
const menu = [
  {
    role: 'Admin',
    title: 'Admin',
    icon: <UserOutlined />,
    items: [
      { route: '/admin/accounts', name: 'Accounts' },
      { route: '/admin/logs', name: 'Logs' },
    ]
  },
  {
    role: 'HR',
    title: 'Human Resource',
    icon: <TeamOutlined />,
    items: [
      { route: '/humanResource/employees', name: 'Employees' },
      { route: '/humanResource/leaveApplications', name: 'Leave Applications' },
    ]
  },
  {
    role: 'Inventory',
    title: 'Inventory',
    icon: <InboxOutlined />,
    items: [
      { route: '/inventory/products', name: 'Products' },
      // { route: '/inventory', name: 'Manage Inventory' },
      // { route: '/inventory/supplier-invoices', name: 'Supplier Invoices' },
    ]
  },
  {
    role: 'SCM',
    title: 'Supplier',
    icon: <ShoppingOutlined />,
    items: [
      { route: '/supplier/suppliers', name: 'Suppliers' },
      // { route: '/suppliers/accounts', name: 'Accounts Payable' },
    ]
  },
  {
    role: 'CRM',
    title: 'Customer',
    icon: <SolutionOutlined />,
    items: [
      { route: '/customer/customers', name: 'Customers' },
    ]
  },
  {
    role: 'Accounting',
    title: 'Accounting',
    icon: <AccountBookOutlined />,
    items: [
      { route: '/accounting/balanceSheets', name: 'Balance Sheets' },
      { route: '/accounting/incomeStatements', name: 'Income Statements' },
      { route: '/accounting/taxes', name: 'Taxes' },
    ]
  },
]

const Sidebar = () => {
    const { hasViewAccessTo } = useApp();

    return (
      <Layout.Sider theme='light' width={210} style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
        <Menu mode='inline'>
          <Menu.Item key='home' icon={<HomeOutlined />}>
            <Link to='/'>Home</Link>
          </Menu.Item>

          {menu.map((menuItem, index) => {
            if (hasViewAccessTo(menuItem.role)) {
              return (
                <Menu.SubMenu key={index} title={menuItem.title} icon={menuItem.icon}>
                  {menuItem.items.map((subMenu, index2) => (
                    <Menu.Item key={`${index}_${index2}`}>
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
};

export default Sidebar;
