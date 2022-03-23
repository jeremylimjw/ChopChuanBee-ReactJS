import { MinusOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons/lib/icons'
import { Avatar, Button, Collapse, List, Tag } from 'antd'
import React from 'react'
import { SOStatus } from '../../../enums/SalesOrderStatus';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { parseDate } from '../../../utilities/datetime';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import NewDeliveryOrderModal from './NewDeliveryOrderModal';

export default function SO5DeliveriesTable({ salesOrder, setSalesOrder, loading, isModalVisible, setIsModalVisible }) {

    const { hasWriteAccessTo } = useApp();

    return (
        <>
            {salesOrder != null &&
                <MyCard title={!salesOrder.isStatus(SOStatus.COMPLETED) ? "Items Sent" : ""}>

                    {salesOrder.isStatus(SOStatus.COMPLETED) &&
                        <MyToolbar title="Sent Items">
                            {hasWriteAccessTo(View.CRM.id) &&
                                <>
                                    <Button icon={<UndoOutlined />} disabled={loading} onClick={() => setIsModalVisible(2)}>Return</Button>
                                    {/* <Button type="primary" icon={<PlusOutlined />} disabled={loading} onClick={() => setIsModalVisible(1)}>Receive New Delivery</Button> */}
                                </>
                            }
                        </MyToolbar>
                    }

                    <Collapse>
                        {salesOrder.sales_order_items.map((item, index) =>
                        (<Collapse.Panel key={index} header={renderPanelHeader(item)}>
                            <List itemLayout="horizontal" dataSource={item.inventory_movements} renderItem={renderItem} />
                        </Collapse.Panel>)
                        )}
                    </Collapse>

                </MyCard>
            }
            <NewDeliveryOrderModal salesOrder={salesOrder} setSalesOrder={setSalesOrder} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </>
    )
}

function renderPanelHeader(item) {
    const totalQuantity = item.inventory_movements.reduce((prev, current) => prev += -current.quantity, 0); // Sales movement are negative quantity

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            {item.product.name}
            <div style={{ marginLeft: 'auto' }}>
                <Tag color="green">{totalQuantity} sent</Tag>
            </div>
        </div>
    )
}

function renderItem(movement) {
    if (movement.quantity < 0) {
        return (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar icon={<PlusOutlined />} style={{ background: "#3CB371" }} />}
                    title={`Sent ${-movement.quantity} unit`}
                    description={parseDate(movement.created_at)}
                />
            </List.Item>)
    } else {
        return (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar icon={<MinusOutlined />} style={{ background: "#FA8072" }} />}
                    title={`Returned ${movement.quantity} unit`}
                    description={parseDate(movement.created_at)}
                />
            </List.Item>)
    }
}
