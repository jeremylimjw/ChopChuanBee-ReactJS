import React from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { useApp } from '../../providers/AppProvider'
<<<<<<< HEAD
import { HomeOutlined, InboxOutlined, ShopOutlined, ShoppingOutlined, SolutionOutlined, TeamOutlined, UserOutlined, AccountBookOutlined } from '@ant-design/icons/lib/icons'
=======
import { HomeOutlined, InboxOutlined, ShoppingOutlined, SolutionOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons/lib/icons'
>>>>>>> first-release


// Add on more menu items here
const menu = [
  {
    role: 'Admin',
    title: 'Admin',
    icon: <UserOutlined />,
    items: [
      { route: '/accounts', name: 'Manage Accounts' },
      { route: '/logs', name: 'Logs' },
    ]
  },
  {
    role: 'HR',
    title: 'Human Resource',
    icon: <TeamOutlined />,
    items: [
      { route: '/humanResource/employees', name: 'Manage Employees' },
      { route: '/humanResource/leaves', name: 'Leaves' },
    ]
  },
  {
    role: 'Inventory',
    title: 'Inventory',
    icon: <InboxOutlined />,
    items: [
      { route: '/products', name: 'Manage Products' },
      // { route: '/inventory', name: 'Manage Inventory' },
      // { route: '/inventory/supplier-invoices', name: 'Supplier Invoices' },
    ]
  },
  {
    role: 'SCM',
    title: 'Supplier',
    icon: <ShoppingOutlined />,
    items: [
      { route: '/suppliers', name: 'Manage Suppliers' },
      // { route: '/suppliers/accounts', name: 'Accounts Payable' },
    ]
  },
  // {
  //   role: 'Inventory',
  //   title: 'Purchases',
  //   icon: <UserOutlined />,
  //   items: [
  //     { route: '/purchases/orders', name: 'Manage Orders' },
  //   ]
  // },
  {
    role: 'CRM',
    title: 'Customer',
    icon: <SolutionOutlined />,
    items: [
      { route: '/customers', name: 'Manage Customers' },
    ]
  },
  {
    role: 'Accounting',
    title: 'Accounting',
    icon: <AccountBookOutlined />,
    items: [
      { route: '/accounting/SOFPs', name: 'Manage Balance Sheets' },
      { route: '/accounting/incomeStatements', name: 'Manage Income Statements' },
      { route: '/accounting/taxes', name: 'Manage Taxes' },
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
