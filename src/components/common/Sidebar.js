import React from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { HomeOutlined, InboxOutlined, ShoppingOutlined, SolutionOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons/lib/icons'
import { useApp } from '../../providers/AppProvider'
import { useLocation } from "react-router-dom";
import { View } from '../../enums/View'


// Add on more menu items here
const menu = [
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
      { route: '/customer/sales', name: 'Manage Sales' },
    ]
  },
]

export default function Sidebar() {

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
};
