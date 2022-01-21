import React from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const { Sider } = Layout
  const { SubMenu } = Menu
  return (
    <Sider theme='light'>
      <Menu defaultSelectedKeys={['1']} mode='inline'>
        <SubMenu key='adminSub' title='Admin'>
          <Menu.Item key='1'>
            <Link to='/admin/accounts'>Accounts</Link>
          </Menu.Item>
          <Menu.Item key='2'>
            <Link to='/admin/logs'>Logs</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key='hrSub' title='Human Resource'>
          <Menu.Item key='3'>
            <Link to='/human-resource/employees'>Employees</Link>
          </Menu.Item>
          <Menu.Item key='4'>
            <Link to='/human-resource/employees'>Leaves</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key='supplierSub' title='Suppliers'>
          <Menu.Item key='5'>
            <Link to='/suppliers'>Suppliers</Link>
          </Menu.Item>
          <Menu.Item key='6'>
            <Link to='/suppliers/accounts'>Accounts Payable</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key='invSub' title='Inventory'>
          <Menu.Item key='7'>
            <Link to='/inventory'>Inventory</Link>
          </Menu.Item>
          <Menu.Item key='8'>
            <Link to='/inventory/supplier-invoices'>Inventory</Link>
          </Menu.Item>
          <Menu.Item key='9'>
            <Link to='/products'>Products</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key='custSub' title='Customers'>
          <Menu.Item key='10'>
            <Link to='/customers'>Customers</Link>
          </Menu.Item>
          <Menu.Item key='11'>
            <Link to='/customers/accounts'>Accounts Receivables</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  )
}

export default Sidebar
