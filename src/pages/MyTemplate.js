import { PlusOutlined } from '@ant-design/icons/lib/icons'
import { Button, Form, Input, Table } from 'antd'
import React from 'react'
import MyToolbar from '../components/layout/MyToolbar'
import MyCard from '../components/layout/MyCard'

export default function MyTemplate() {
  return (
      <>
        <MyCard>
            <Form layout='inline'>
                <Form.Item label="Field A">
                    <Input placeholder="input placeholder" />
                </Form.Item>
                <Form.Item label="Field B">
                    <Input placeholder="input placeholder" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary">Submit</Button>
                </Form.Item>
            </Form>
        </MyCard>

        <MyCard>
            <MyToolbar title="Customers">
                <Button type="primary" icon={<PlusOutlined />}>New</Button>
            </MyToolbar>
            <Table dataSource={dataSource} columns={columns} />
        </MyCard>

        <div style={{ display: 'flex'}}>
            <MyCard style={{ flexGrow: 1, margin: '0 12px 24px 24px' }} title="Past Payment History">
                Bill is a cat.
            </MyCard>
            <MyCard style={{ flexGrow: 1, margin: '0 24px 24px 12px' }} title="Past Deliveries">
                Bill is a cat.
            </MyCard>
        </div>
      </>
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