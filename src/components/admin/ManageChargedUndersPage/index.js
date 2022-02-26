import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Table } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useApp } from '../../../providers/AppProvider';
import MyLayout from '../../common/MyLayout';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import { View } from '../../../enums/View';
import { parseDate } from '../../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters';
import { getActiveTag } from '../../../enums/ActivationStatus';
import { showTotal } from '../../../utilities/table';
import { ChargedUnderApiHelper } from '../../../api/ChargedUnderApiHelper';
import NewChargedUnderModal from './NewChargedUnderModal';

const breadcrumbs = [
    { url: '/admin/schemes', name: 'Admin' },
    { url: '/admin/schemes', name: 'Schemes' },
];

export default function ManageChargedUndersPage() {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState();
    const [chargedUnders, setChargedUnders] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
      setLoading(true);
      ChargedUnderApiHelper.get()
        .then(results => {
            setChargedUnders(results);
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])

    function onValuesChange(_, form) {
        ChargedUnderApiHelper.get(form)
            .then(results => {
                setChargedUnders(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    function myCallback(newChargedUnder) {
        setChargedUnders([newChargedUnder, ...chargedUnders]);
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Manage Accounts'>
            <MyCard>
                <MyToolbar title='Accounts'>
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name="name">
                            <Input placeholder='Search Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                        </Form.Item>
                        <Form.Item name="status">
                            <Select style={{ width: 140 }} placeholder="Filter by Status">
                                <Select.Option value={null}>All</Select.Option>
                                <Select.Option value={true}>Listed</Select.Option>
                                <Select.Option value={false}>Unlisted</Select.Option>
                            </Select>
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    { hasWriteAccessTo(View.ADMIN.name) && 
                        <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>New</Button>
                    }
                </MyToolbar>

                <Table 
                    dataSource={chargedUnders} 
                    columns={columns} 
                    loading={loading} 
                    rowKey="id" 
                    pagination={{ showTotal: showTotal }}
                />
            </MyCard>

            <NewChargedUnderModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} myCallback={myCallback} />
        </MyLayout>
    );
};

const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
        ellipsis: true,
        render: (created_at) => parseDate(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
        title: 'Company',
        dataIndex: 'name',
        key: 'name',
        width: '18%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
        title: 'GST',
        dataIndex: 'gst_rate',
        key: 'gst_rate',
        width: 100,
        ellipsis: true,
        render: (gst_rate) => (gst_rate && gst_rate != 0) ? `${gst_rate}%` : '-',
        sorter: (a, b) => sortByNumber(a.gst_rate, b.gst_rate),
    },
    {
        title: 'Contact Number',
        dataIndex: 'contact_number',
        key: 'contact_number',
        render: (contact_number) => contact_number || '-',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.contact_number, b.contact_number),
    },
    {
        title: 'Registration Number',
        dataIndex: 'registration_number',
        key: 'registration_number',
        width: '18%',
        render: (registration_number) => registration_number || '-',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.registration_number, b.registration_number),
    },
    {
        title: 'Status',
        dataIndex: 'deactivated_date',
        key: 'deactivated_date',
        width: 120,
        align: 'center',
        ellipsis: true,
        render: (deactivated_date) => getActiveTag(deactivated_date, ['Listed', 'Unlisted']),
        sorter: (a, b) => sortByNumber(a.deactivated_date ? 1 : 0, b.deactivated_date ? 1 : 0),
    },
    { 
        dataIndex: "id", 
        title: "Action", 
        key: "link", 
        width: 100,
        ellipsis: true,
        render: (id) => <Link to={`./${id}`}>View</Link> 
    }
];
