import { DeleteOutlined, PlusOutlined, PrinterOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons/lib/icons'
import { Button, Space, Table } from 'antd'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { View } from '../../../enums/View'
import { useApp } from '../../../providers/AppProvider'
import { parseDateTimeSeconds } from '../../../utilities/datetime'
import DraggableTableRow from '../../common/DraggableTableRow'
import MyCard from '../../common/MyCard'
import MyToolbar from '../../common/MyToolbar'

export default function I3DeliveryOrders({ itinerary, setItinerary, updateItinerary, loading, setLoading }) {

    const { hasWriteAccessTo } = useApp();

    columns[10].render = (_, record) => <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteRow(record)} disabled={!hasWriteAccessTo(View.DISPATCH.id)} />

    function moveRow(dragIndex, hoverIndex) {
        const dragRow = itinerary.delivery_orders[dragIndex];
        const newSelectedOrders = [...itinerary.delivery_orders];
        newSelectedOrders.splice(dragIndex, 1);
        newSelectedOrders.splice(hoverIndex, 0, dragRow);
        setItinerary({ ...itinerary, delivery_orders: newSelectedOrders })
    }

    function handleDeleteRow(record) {
        const newItems = itinerary.delivery_orders.filter((item) => item.id !== record.id);
        setItinerary({ ...itinerary, delivery_orders: newItems })
    };

    function printItinerary() {
        console.log(JSON.stringify(itinerary, null, 2))
    }

    return (
        <MyCard style={{ marginTop: 0 }}>

            <MyToolbar title="Delivery Itinerary">
                { hasWriteAccessTo(View.DISPATCH.name) && 
                <Button icon={<PlusOutlined />} >Add (WIP)</Button>
                }
            </MyToolbar>

            <DndProvider backend={HTML5Backend}>
                <Table 
                    columns={columns} 
                    dataSource={itinerary.delivery_orders} 
                    components={{ body: { row: DraggableTableRow } }}
                    onRow={(record, index) => ({ index, moveRow })}
                    rowKey="id" 
                    pagination={false}
                />
            </DndProvider>

            <div style={{ display: 'flex', marginTop: 15 }}>

                <Space size="middle">
                    <Button icon={<PrinterOutlined />} onClick={printItinerary}>Print</Button>
                </Space>
                
                { hasWriteAccessTo(View.DISPATCH.id) && 
                <div style={{ marginLeft: 'auto' }}>
                    <Space size="middle">
                        <Button icon={<ReloadOutlined />} onClick={updateItinerary} disabled={loading}>Optimize</Button>
                        <Button icon={<SaveOutlined />} type="primary" onClick={updateItinerary} disabled={loading}>Save Sequence</Button>
                    </Space>
                </div>
                }
            </div>

        </MyCard>
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
    { 
        align: 'center', 
        width: 80, 
    },
];
