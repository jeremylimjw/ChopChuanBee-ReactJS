import { DownOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons/lib/icons'
import { Button, Dropdown, Form, Input, InputNumber, Menu, Table } from 'antd'
import React from 'react'
import MyToolbar from '../components/layout/MyToolbar'
import MyCard from '../components/layout/MyCard'
import MyLayout from '../components/layout/MyLayout'

const breadcrumbs = [
  { url: '/', name: 'Customers' },
]

export default function MyTemplate() {
  return (
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Customers">

      <MyCard>

        <MyToolbar title="Simple Table">
          <Input placeholder="Search Name" addonAfter={<SearchOutlined />} />
          <Input placeholder="Search Address" addonAfter={<SearchOutlined />} />
          <Button>Reset</Button>
          <Button type="primary" icon={<PlusOutlined />}>New</Button>
        </MyToolbar>

        <Table dataSource={dataSource} columns={columns} />
        
      </MyCard>

      <MyCard>

        <MyToolbar title="Extreme Table">
          <Input style={{ width: 180 }} placeholder="Search Name" addonAfter={<SearchOutlined />} />
          <Input style={{ width: 180 }} placeholder="Search Start Date" addonAfter={<SearchOutlined />} />
          <Input style={{ width: 180 }} placeholder="Search End Date" addonAfter={<SearchOutlined />} />
          <Button>Reset</Button>
          
          <Dropdown.Button
            type="primary"
            icon={<DownOutlined />}
            overlay={<Menu>
                <Menu.Item key="1" icon={<PlusOutlined />}>Add Refund</Menu.Item>
                <Menu.Item key="2" icon={<PlusOutlined />}>Add Damaged</Menu.Item>
              </Menu>}
          >
            New Item
          </Dropdown.Button>
        </MyToolbar>

        <Table dataSource={dataSource} columns={columns} />
        
      </MyCard>

      <div style={{ display: 'flex'}}>
        
          <MyCard style={{ flexGrow: 1, margin: '0 12px 24px 24px' }} title="Past Payment History">

            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
              <Form.Item label="Name"><Input /></Form.Item>
              <Form.Item label="Email"><Input /></Form.Item>
              <Form.Item label="Age"><InputNumber /> </Form.Item>
              <Form.Item label="Website"><Input /></Form.Item>
              <Form.Item label="Introduction"><Input.TextArea /></Form.Item>
              <Form.Item wrapperCol={{  offset: 4, span: 10 }}>
                <Button type="primary" htmlType="submit">Submit</Button>
              </Form.Item>
            </Form>

          </MyCard>

          <MyCard style={{ flexGrow: 1, margin: '0 24px 24px 12px' }} title="Past Deliveries">
              Bill is a cat.
          </MyCard>

      </div>
      
    </MyLayout>
  )
}


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
]

const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];