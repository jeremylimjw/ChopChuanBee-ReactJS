import { PlusOutlined, UndoOutlined } from '@ant-design/icons/lib/icons'
import { Button } from 'antd'
import React from 'react'
import { POStatus } from '../../../enums/PurchaseOrderStatus'
import MyCard from '../../layout/MyCard'
import MyToolbar from '../../layout/MyToolbar'

export default function DeliveriesTable({ purchaseOrder, setPurchaseOrder, loading }) {
  return (
    <>
    { purchaseOrder != null && 
        <MyCard style={{ flexGrow: 1, margin: '0 24px 24px 12px' }} title={ !purchaseOrder.isStatus(POStatus.ACCEPTED) ? "Past Deliveries" : "" }>
    
        { purchaseOrder.isStatus(POStatus.ACCEPTED) && 
            <MyToolbar title="Received Deliveries">
                <Button icon={<UndoOutlined />} disabled={loading} onClick={() => true}>Return</Button>
                <Button type="primary" icon={<PlusOutlined />} disabled={loading} onClick={() => true}>Receive New Delivery</Button>
            </MyToolbar>
        }
    
        </MyCard>
    }
    {/* <NewPaymentModal purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} /> */}
    </>
)
}
