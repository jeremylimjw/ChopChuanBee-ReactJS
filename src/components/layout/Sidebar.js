import React from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { useApp } from '../../providers/AppProvider'
import { UserOutlined } from '@ant-design/icons/lib/icons'


// Add on more menu items here
const menu = [
  {
    role: 'Admin',
    title: 'Admin',
    icon: <UserOutlined />,
    items: [
      { route: '/admin/accounts', name: 'Manage Accounts' },
      { route: '/admin/logs', name: 'Logs' },
    ]
  },
  {
    role: 'HR',
    title: 'Human Resource',
    icon: <UserOutlined />,
    items: [
      { route: '/human-resource/employees', name: 'Manage Employees' },
      { route: '/human-resource/employees', name: 'Leaves' },
    ]
  },
  {
    role: 'SCM',
    title: 'Suppliers',
    icon: <UserOutlined />,
    items: [
      { route: '/suppliers', name: 'Manage Suppliers' },
      { route: '/suppliers/accounts', name: 'Accounts Payable' },
    ]
  },
  {
    role: 'Inventory',
    title: 'Purchases',
    icon: <UserOutlined />,
    items: [
      { route: '/purchases/orders', name: 'Manage Orders' },
    ]
  },
  {
    role: 'Inventory',
    title: 'Inventory',
    icon: <UserOutlined />,
    items: [
      { route: '/inventory', name: 'Manage Inventory' },
      { route: '/inventory/supplier-invoices', name: 'Supplier Invoices' },
      { route: '/products', name: 'Manage Products' },
    ]
  },
  {
    role: 'CRM',
    title: 'Customers',
    icon: <UserOutlined />,
    items: [
      { route: '/customers', name: 'Manage Customers' },
      { route: '/customers/accounts', name: 'Accounts Receivables' },
    ]
  },
]

const Sidebar = () => {
  const { hasViewAccessTo } = useApp()

  return (
    <Layout.Sider theme='light' width={210} style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>

      <Menu defaultSelectedKeys={['1']} mode='inline'>

        { menu.map((menuItem, index) => {
          if (hasViewAccessTo(menuItem.role)) {
            return <Menu.SubMenu key={index} title={menuItem.title} icon={menuItem.icon}>
              { menuItem.items.map((subMenu, index2) => 
                <Menu.Item key={`${index}_${index2}`}>
                  <Link to={subMenu.route}>{subMenu.name}</Link>
                </Menu.Item>
              )}
            </Menu.SubMenu>
          }
          return null;
        })}

        <Menu.Item key='logoutMenu' icon={<UserOutlined />}>
          <Link to='/'>Logout</Link>
        </Menu.Item>

      </Menu>
    </Layout.Sider>
  )
}

export default Sidebar
