import { PlusOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons/lib/icons'
import { Button, message, Space, Table } from 'antd'
import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Link } from 'react-router-dom'
import { DeliveryApiHelper } from '../../../api/DeliveryApiHelper'
import { getDeliveryStatusTag } from '../../../enums/DeliveryStatus'
import { View } from '../../../enums/View'
import { useApp } from '../../../providers/AppProvider'
import { parseDateTimeSeconds } from '../../../utilities/datetime'
import DraggableTableRow from '../../common/DraggableTableRow'
import MyCard from '../../common/MyCard'
import MyToolbar from '../../common/MyToolbar'
import ViewDeliveryOrderModal from '../ViewDeliveryOrderModal'
import AddDeliveryModal from './AddDeliveryModal'

export default function I3DeliveryOrders({ itinerary, setItinerary, loading, setLoading, myCallback }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [showDeliveryOrder, setShowDeliveryOrder] = useState();
    const [showAddOrder, setShowAddOrder] = useState(false);

    columns[7].render = (_, record) => <Button type="link" style={{ paddingLeft: 0 }} onClick={() => setShowDeliveryOrder(record)}>View</Button>;

    function moveRow(dragIndex, hoverIndex) {
        const dragRow = itinerary.delivery_orders[dragIndex];
        const newSelectedOrders = [...itinerary.delivery_orders];
        newSelectedOrders.splice(dragIndex, 1);
        newSelectedOrders.splice(hoverIndex, 0, dragRow);

        const newItinerary = { ...itinerary, delivery_orders: newSelectedOrders };
        setItinerary(newItinerary)

        // Automatically update itinerary in db
        setLoading(true);
        DeliveryApiHelper.updateItinerary(newItinerary)
            .then(() => {
                message.success('Route sequence successfully saved!');
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    function handleAddNewRows(deliveryOrders) {
        const newItems = [...itinerary.delivery_orders,  ...deliveryOrders];
        const newItinerary = { ...itinerary, delivery_orders: newItems };

        setLoading(true);
        DeliveryApiHelper.updateItinerary(newItinerary)
            .then(() => {
                message.success('Itinerary successfully updated!');
                setLoading(false);
                myCallback(); // call this to refresh entire iterary object because delivery order statuses are changed in the backend
                setShowAddOrder(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    };

    async function optimizeRoutes() {
        const origin = {
            latitude: itinerary.latitude,
            longitude: itinerary.longitude,
        }

        try {
            setLoading(true);
            const waypoint_order = await DeliveryApiHelper.optimizeRoutes(origin, itinerary.delivery_orders);

            const newOrders = [];
            for (let index of waypoint_order) {
                newOrders.push(itinerary.delivery_orders[index]);
            }

            const newItinerary = {...itinerary, delivery_orders: newOrders };

            // Update the itinerary
            await DeliveryApiHelper.updateItinerary(newItinerary);
            setItinerary(newItinerary);
            
            message.success('Delivery orders successfully optimized!');
            setLoading(false);

        } catch (err) {
            handleHttpError(err);
            setLoading(false);
        }
    }

    function printItinerary() {
        console.log(JSON.stringify(itinerary, null, 2))
    }

    return (
        <>
            <MyCard style={{ marginTop: 0 }}>

                <MyToolbar title="Delivery Itinerary">
                    { hasWriteAccessTo(View.DISPATCH.name) && 
                    <Button type='primary' icon={<PlusOutlined />} onClick={() => setShowAddOrder(true)} loading={loading}>Add</Button>
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
                            <Button icon={<ReloadOutlined />} onClick={optimizeRoutes} loading={loading}>Optimize</Button>
                        </Space>
                    </div>
                    }
                </div>

            </MyCard>

            <ViewDeliveryOrderModal 
                showDeliveryOrder={showDeliveryOrder} 
                setShowDeliveryOrder={setShowDeliveryOrder} 
                myCallback={myCallback}
            />

            <AddDeliveryModal 
                isModalVisible={showAddOrder} 
                setIsModalVisible={setShowAddOrder} 
                myCallback={handleAddNewRows}
                loading={loading}
            />

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
        render: (sales_order_id) => sales_order_id ? <Link to={`/customer/sales/${sales_order_id}`}>{sales_order_id}</Link> : '-',
    },
    {
        title: 'Company',
        dataIndex: 'sales_order',
        key: 'customer_company_name',
        width: '20%',
        ellipsis: true,
        render: (sales_order) => sales_order?.customer?.company_name ? <Link to={`/customer/customers/${sales_order.customer_id}`}>{sales_order.customer.company_name}</Link> : '-',
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
        title: 'Status',
        dataIndex: 'delivery_status_id',
        key: 'delivery_status_id',
        width: 120,
        align: 'center',
        ellipsis: true,
        render: (delivery_status_id) => getDeliveryStatusTag(delivery_status_id),
    },
    {
        title: "Action",
        key: "link",
        width: 100,
        ellipsis: true,
    },
];
