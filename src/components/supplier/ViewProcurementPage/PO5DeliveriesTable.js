import { MinusOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons/lib/icons'
import { Avatar, Button, Collapse, List, Tag } from 'antd'
import React from 'react'
import { POStatus } from '../../../enums/PurchaseOrderStatus';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { parseDate } from '../../../utilities/datetime';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import NewDeliveryOrderModal from './NewDeliveryOrderModal';

export default function PO5DeliveriesTable({ purchaseOrder, setPurchaseOrder, loading, isModalVisible, setIsModalVisible }) {

    const { hasWriteAccessTo } = useApp();

    return (
        <>
        { purchaseOrder != null && 
            <MyCard title={ !purchaseOrder.isStatus(POStatus.ACCEPTED) ? "Items Received" : "" }>
        
            { purchaseOrder.isStatus(POStatus.ACCEPTED) && 
                <MyToolbar title="Received Items">
                    {hasWriteAccessTo(View.SCM.id) &&
                    <>
                        <Button icon={<UndoOutlined />} disabled={loading} onClick={() => setIsModalVisible(2)}>Return</Button>
                        <Button type="primary" icon={<PlusOutlined />} disabled={loading} onClick={() => setIsModalVisible(1)}>Receive New Delivery</Button>
                    </>
                    }
                </MyToolbar>
            }

            <Collapse>
            { purchaseOrder.purchase_order_items.map((item, index) => 
                (<Collapse.Panel key={index} header={renderPanelHeader(item)}>
                    <List itemLayout="horizontal" dataSource={item.inventory_movements} renderItem={renderItem} />
                </Collapse.Panel>)
            )}
            </Collapse>
        
            </MyCard>
        }
        <NewDeliveryOrderModal purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </>
    )
}

function renderPanelHeader(item) {
    const totalQuantity = item.inventory_movements.reduce((prev, current) => prev += current.quantity, 0);

    let tag;
    if (item.quantity > totalQuantity) {
        tag = <Tag color="volcano">{totalQuantity} / {item.quantity}</Tag>
    } else {
        tag = <Tag color="green">Complete</Tag>
    }
    return (<div style={{ display: 'flex', width: '100%' }}>{item.product.name} <div style={{ marginLeft: 'auto' }}>{tag}</div></div>)
}

function renderItem(movement) {
    if (movement.quantity >= 0) {
        return (
            <List.Item>
                <List.Item.Meta
                avatar={<Avatar icon={<PlusOutlined />} style={{ background: "#3CB371" }} />}
                title={`Received ${movement.quantity} unit`}
                description={parseDate(movement.created_at)}
                />
            </List.Item>)
    } else {
        return (
            <List.Item>
                <List.Item.Meta
                avatar={<Avatar icon={<MinusOutlined />} style={{ background: "#FA8072" }} />}
                title={`Refunded ${-movement.quantity} unit`}
                description={parseDate(movement.created_at)}
                />
            </List.Item>)
    }
}
