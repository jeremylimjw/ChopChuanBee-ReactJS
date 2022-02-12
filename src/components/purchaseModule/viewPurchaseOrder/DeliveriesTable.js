import { ArrowDownOutlined, ArrowUpOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons/lib/icons'
import { Avatar, Button, Collapse, List, Tag } from 'antd'
import React from 'react'
import { POStatus } from '../../../enums/PurchaseOrderStatus'
import MyCard from '../../layout/MyCard'
import MyToolbar from '../../layout/MyToolbar'
import NewDeliveryOrderModal from './NewDeliveryOrderModal'

export default function DeliveriesTable({ purchaseOrder, setPurchaseOrder, loading, isModalVisible, setIsModalVisible }) {

    return (
        <>
        { purchaseOrder != null && 
            <MyCard style={{ flexGrow: 1, margin: '0 24px 24px 12px' }} title={ !purchaseOrder.isStatus(POStatus.ACCEPTED) ? "Past Deliveries" : "" }>
        
            { purchaseOrder.isStatus(POStatus.ACCEPTED) && 
                <MyToolbar title="Received Deliveries">
                    <Button icon={<UndoOutlined />} disabled={loading} onClick={() => setIsModalVisible(2)}>Return</Button>
                    <Button type="primary" icon={<PlusOutlined />} disabled={loading} onClick={() => setIsModalVisible(1)}>Receive New Delivery</Button>
                </MyToolbar>
            }

            <Collapse>
            { purchaseOrder.purchase_order_items.map((item, index) => {
                const totalQuantity = item.inventory_movements.reduce((prev, current) => prev += current.quantity, 0);

                let tag;
                if (item.quantity > totalQuantity) {
                    tag = <Tag color="volcano" style={{ marginLeft: 'auto' }}>Incomplete</Tag>
                } else {
                    tag = <Tag color="green" style={{ marginLeft: 'auto' }}>Complete</Tag>
                }

                return (
                    <Collapse.Panel key={index} header={<div style={{ display: 'flex', width: '100%' }}>{item.product.name} {tag}</div>}>
                        <List itemLayout="horizontal" dataSource={item.inventory_movements} renderItem={movement => {
                            if (movement.quantity >= 0) {
                                return (
                                    <List.Item>
                                        <List.Item.Meta
                                        avatar={<Avatar icon={<ArrowUpOutlined />} style={{ background: "#389e0d" }} />}
                                        title={movement.created_at}
                                        description={`Received ${movement.quantity} unit`}
                                        />
                                    </List.Item>)
                            } else {
                                return (
                                    <List.Item>
                                        <List.Item.Meta
                                        avatar={<Avatar icon={<ArrowDownOutlined />} style={{ background: "#cf1322" }} />}
                                        title={movement.created_at}
                                        description={`Refunded ${-movement.quantity} unit`}
                                        />
                                    </List.Item>)
                            }
                        }
                            }
                        />
                    </Collapse.Panel>
                )
            })}
            </Collapse>
        
            </MyCard>
        }
        <NewDeliveryOrderModal purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </>
    )
}
