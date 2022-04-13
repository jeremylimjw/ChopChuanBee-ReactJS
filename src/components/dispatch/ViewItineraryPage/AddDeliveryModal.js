import { SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, Modal, Table } from 'antd'
import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { DeliveryApiHelper } from '../../../api/DeliveryApiHelper';
import { DeliveryStatus } from '../../../enums/DeliveryStatus';
import { useApp } from '../../../providers/AppProvider';
import { parseDateTimeSeconds } from '../../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import MyToolbar from '../../common/MyToolbar'

export default function AddDeliveryModal({ isModalVisible, setIsModalVisible, myCallback, loading }) {

    const [selectedOrders, setSelectedOrders] = useState([]);

    function handleOk() {
        myCallback(selectedOrders);
        handleClose();
    }

    function handleClose() {
        setSelectedOrders([]);
        setIsModalVisible(false);
    }

    return (
        <Modal title="Create a Delivery Order" width={1200}
            visible={isModalVisible} 
            onOk={handleOk} 
            onCancel={handleClose} 
            okButtonProps={{ loading: loading }}
            bodyStyle={{ height: "60vh", overflowY: "auto" }}
            destroyOnClose
        >
            
            <ModalContent
                selectedOrders={selectedOrders} 
                setSelectedOrders={setSelectedOrders}
            />

        </Modal>
    )
}

function ModalContent({ selectedOrders, setSelectedOrders }) {

    const { handleHttpError } = useApp();

    const [form] = Form.useForm();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        DeliveryApiHelper.getOrders({ delivery_status_id: DeliveryStatus.PENDING.id })
            .then(results => {
                setOrders(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])
  
    function onValuesChange(_, form) {
        DeliveryApiHelper.getOrders({ ...form, delivery_status_id: DeliveryStatus.PENDING.id })
            .then(results => {
                setOrders(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }
  
    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }
  
    function handleRowSelect(_, selectedRows) {
        setSelectedOrders(selectedRows);
    }

    return (
        <>
            <MyToolbar title="Outstanding Delivery Orders">
                <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                    <Form.Item name="customer_company_name">
                        <Input placeholder='Search Company' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                    </Form.Item>
                    <Form.Item name="customer_p1_name">
                        <Input placeholder='Search Customer' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                    </Form.Item>
                    <Button onClick={resetForm}>Reset</Button>
                </Form>
            </MyToolbar>

            <Table loading={loading}
                rowSelection={{ type: 'checkbox', onChange: handleRowSelect, selectedRowKeys: selectedOrders.map(x => x.id) }}
                columns={columns}
                dataSource={orders}
                pagination={{ showTotal: showTotal, pageSize: 6 }}
                rowKey="id"
            />
        </>
    )

}
  
const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 200,
        ellipsis: true,
        render: (created_at) => parseDateTimeSeconds(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
        title: 'Order ID',
        dataIndex: 'sales_order_id',
        key: 'sales_order_id',
        width: 120,
        ellipsis: true,
        render: (sales_order_id) => sales_order_id ? <Link to={`/customer/sales/${sales_order_id}`}>{sales_order_id}</Link> : '-',
        sorter: (a, b) => sortByNumber(a.sales_order_id, b.sales_order_id),
    },
    {
        title: 'Company',
        dataIndex: 'customer_company_name',
        key: 'customer_company_name',
        width: '20%',
        ellipsis: true,
        render: (customer_company_name, record) => customer_company_name ? <Link to={`/customer/customers/${record.customer_id}`}>{customer_company_name}</Link> : '-',
        sorter: (a, b) => sortByString(a.customer_company_name || '-', b.customer_company_name || '-'),
    },
    {
        title: 'Customer',
        dataIndex: 'customer_p1_name',
        key: 'customer_p1_name',
        width: '20%',
        ellipsis: true,
        render: (customer_p1_name) => customer_p1_name || '-',
        sorter: (a, b) => sortByString(a.customer_p1_name || '-', b.customer_p1_name || '-'),
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width: '20%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.address, b.address),
    },
    {
        title: 'Remarks',
        dataIndex: 'remarks',
        key: 'remarks',
        width: '20%',
        ellipsis: true,
        render: (remarks) => remarks || '-',
        sorter: (a, b) => sortByString(a.remarks, b.remarks),
    },
];
