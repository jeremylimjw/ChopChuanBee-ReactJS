import {
    DownOutlined,
    FileDoneOutlined,
    FileTextOutlined,
    PlusOutlined,
    SaveOutlined,
    SearchOutlined,
    SendOutlined,
    StopOutlined,
} from '@ant-design/icons/lib/icons';
import { Button, DatePicker, Dropdown, Form, Input, InputNumber, Menu, Select, Space, Table } from 'antd';
import React from 'react';
import MyToolbar from '../components/layout/MyToolbar';
import MyCard from '../components/layout/MyCard';
import MyLayout from '../components/layout/MyLayout';
import moment from 'moment';

const breadcrumbs = [{ url: '/', name: 'Customers' }];

export default function MyTemplate() {
    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Manage Customers'>
            <MyCard>
                <MyToolbar title='Simple Table'>
                    <Input placeholder='Search Name' addonBefore={<SearchOutlined />} />
                    <Input placeholder='Search Address' addonBefore={<SearchOutlined />} />
                    <Button>Reset</Button>
                    <Button type='primary' icon={<PlusOutlined />}>
                        New
                    </Button>
                </MyToolbar>

                <Table dataSource={dataSource} columns={columns} />
            </MyCard>

            <MyCard>
                <MyToolbar title='Extreme Table'>
                    <Input
                        style={{ width: 180 }}
                        placeholder='Search Name'
                        suffix={<SearchOutlined className='grey' />}
                    />
                    <Input
                        style={{ width: 180 }}
                        placeholder='Search Descripton'
                        suffix={<SearchOutlined className='grey' />}
                    />
                    <DatePicker
                        style={{ width: 180 }}
                        placeholder='Start date'
                        suffix={<SearchOutlined className='grey' />}
                    />
                    <Select style={{ width: 180 }} placeholder='Filter by Name'>
                        <Select.Option value='lucy'>Lucy</Select.Option>
                        <Select.Option value='lucy'>Alice</Select.Option>
                        <Select.Option value='lucy'>Bob</Select.Option>
                        <Select.Option value='lucy'>Charlie</Select.Option>
                    </Select>
                    <Button>Reset</Button>

                    <Dropdown.Button
                        type='primary'
                        icon={<DownOutlined />}
                        overlay={
                            <Menu>
                                <Menu.Item key='1' icon={<PlusOutlined />}>
                                    Add Refund
                                </Menu.Item>
                                <Menu.Item key='2' icon={<PlusOutlined />}>
                                    Add Damaged
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        New Item
                    </Dropdown.Button>
                </MyToolbar>

                <Table dataSource={dataSource} columns={columns} />

                <MyToolbar style={{ marginTop: 10 }}>
                    <Button icon={<StopOutlined />}>Cancel Order</Button>
                    <Button icon={<SaveOutlined />}>Save for later</Button>
                    <Button type='primary' icon={<FileTextOutlined />}>
                        Convert to Invoice
                    </Button>
                    <Button type='primary' icon={<FileDoneOutlined />}>
                        Close Invoice
                    </Button>
                </MyToolbar>
            </MyCard>

            <div className='flex-side-by-side'>
                <MyCard title='Past Payment History'>
                    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                        <Form.Item label='Name'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Email'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Age'>
                            <InputNumber />{' '}
                        </Form.Item>
                        <Form.Item label='Website'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Introduction'>
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </MyCard>

                <MyCard title='Past Deliveries'>Bill is a cat.</MyCard>
            </div>
        </MyLayout>
    );
}

const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (created_at) => moment(created_at).format('lll'),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (_) => moment(new Date()).format('ll'),
    },
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
];

const dataSource = [
    {
        key: '1',
        name: 'Mike',
        age: 32,
        address: '10 Downing Street',
        created_at: new Date(),
    },
    {
        key: '2',
        name: 'John',
        age: 42,
        address: '10 Downing Street',
        created_at: new Date(),
    },
];
