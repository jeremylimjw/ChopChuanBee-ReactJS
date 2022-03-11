import { Button, Table, Descriptions, Row } from 'antd';
import React from 'react'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getRoleTag } from '../../../enums/Role';
import { parseDateTimeSeconds } from '../../../utilities/datetime';
import DraggableTableRow from '../../common/DraggableTableRow';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';

export default function NI3Confirm({ itinerary, selectedEmployee, selectedOrders, setSelectedOrders, step, setStep, handleSubmitEvent }) {

    function moveRow(dragIndex, hoverIndex) {
        const dragRow = selectedOrders[dragIndex];
        const newSelectedOrders = [...selectedOrders];
        newSelectedOrders.splice(dragIndex, 1);
        newSelectedOrders.splice(hoverIndex, 0, dragRow);
        setSelectedOrders(newSelectedOrders)
    }

    return (
        <>
            <Row style={{ marginTop: -24 }}>
                <MyCard style={{ width: 450 }} title="Itinerary Details">
                    
                    <Descriptions bordered size="small" layout='horizontal' column={1}>
                        <Descriptions.Item label="Start Time">{parseDateTimeSeconds(itinerary.start_time)}</Descriptions.Item>
                        <Descriptions.Item label="Session">{itinerary.session}</Descriptions.Item>
                        <Descriptions.Item label="Origin Postal Code">{itinerary.origin_postal_code}</Descriptions.Item>
                    </Descriptions>

                </MyCard>

                <MyCard title="Driver Details" style={{ width: 400 }}>
                    
                    <Descriptions bordered size="small" layout='horizontal' column={1}>
                        <Descriptions.Item label="Name">{selectedEmployee.name}</Descriptions.Item>
                        <Descriptions.Item label="Role">{getRoleTag(selectedEmployee.role_id)}</Descriptions.Item>
                        <Descriptions.Item label="Contact">{selectedEmployee.contact_number}</Descriptions.Item>
                        <Descriptions.Item label="Email">{selectedEmployee.email || '-'}</Descriptions.Item>
                    </Descriptions>
                    
                </MyCard>
            </Row>

            <MyCard title="Delivery Itinerary" style={{ flexGrow: 1, margin: '0 12px 24px 24px' }}>

                <DndProvider backend={HTML5Backend}>
                    <Table 
                        columns={columns} 
                        dataSource={selectedOrders} 
                        components={{ body: { row: DraggableTableRow } }}
                        onRow={(record, index) => ({ index, moveRow })}
                        rowKey="id" 
                    />
                </DndProvider>

                <MyToolbar style={{ marginTop: 15 }}>
                    <Button onClick={() => setStep(step-1)}>Back</Button>
                    <Button type="primary" onClick={() => handleSubmitEvent()} disabled={selectedOrders.length === 0}>Create Itinerary</Button>
                </MyToolbar>

            </MyCard>

        </>
    )
}
  
const columns = [
    {
        title: 'No',
        dataIndex: 'no',
        width: 80,
        render: (_, record, index) => index+1,
    },
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 200,
        ellipsis: true,
        render: (created_at) => parseDateTimeSeconds(created_at),
    },
    {
        title: 'Order ID',
        dataIndex: 'sales_order_id',
        key: 'sales_order_id',
        width: 120,
        ellipsis: true,
    },
    {
        title: 'Company',
        dataIndex: 'customer_company_name',
        key: 'customer_company_name',
        width: '20%',
        ellipsis: true,
        render: (customer_company_name) => customer_company_name || '-',
    },
    {
        title: 'Customer',
        dataIndex: 'customer_p1_name',
        key: 'customer_p1_name',
        width: '20%',
        ellipsis: true,
        render: (customer_p1_name) => customer_p1_name || '-',
    },
    {
        title: 'Contact Number',
        dataIndex: 'customer_phone_number',
        key: 'customer_phone_number',
        width: '20%',
        ellipsis: true,
        render: (customer_phone_number) => customer_phone_number || '-',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width: '20%',
        ellipsis: true,
    },
    {
        title: 'Postal Code',
        dataIndex: 'postal_code',
        key: 'postal_code',
        width: '20%',
        ellipsis: true,
    },
    {
        title: 'Remarks',
        dataIndex: 'remarks',
        key: 'remarks',
        width: '20%',
        ellipsis: true,
        render: (remarks) => remarks || '-',
    },
    {
        title: 'Est. Time',
        dataIndex: 'delivery_status_id',
        key: 'delivery_status_id',
        width: 120,
        align: 'center',
        ellipsis: true,
        render: (delivery_status_id) => '-',
    },
];
