import { PlusOutlined, UndoOutlined } from '@ant-design/icons/lib/icons'
import { Button, Table, Typography } from 'antd'
import React, { useState } from 'react'
import { getPaymentMethodTag } from '../../../enums/PaymentMethod';
import { POStatus } from '../../../enums/PurchaseOrderStatus';
import { parseDate } from '../../../utilities/datetime';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import NewPaymentModal from './NewPaymentModal';

export default function PO4PaymentsTable({ purchaseOrder, setPurchaseOrder, loading }) {
    
    const [isModalVisible, setIsModalVisible] = useState(0);

    return (
        <>
        { purchaseOrder != null && 
            <MyCard title={ !purchaseOrder.isStatus(POStatus.ACCEPTED) ? "Past Payment History" : "" }>
        
            { purchaseOrder.isStatus(POStatus.ACCEPTED) && 
                <MyToolbar title="Payments">
                    <Button icon={<UndoOutlined />} disabled={loading} onClick={() => setIsModalVisible(2)}>Refund</Button>
                    <Button type="primary" icon={<PlusOutlined />} disabled={loading} onClick={() => setIsModalVisible(1)}>Add Payment</Button>
                </MyToolbar>
            }
        
            <Table 
                columns={columns} dataSource={purchaseOrder.getPayments()} 
                rowKey={(_, index) => index}
                summary={pageData => (
                <>
                    <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3}>
                        <Typography.Text strong>Total</Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align='center'>
                        <Typography.Text strong>
                        {`$${purchaseOrder.getPaymentsTotal().toFixed(2)}`}
                        </Typography.Text>
                    </Table.Summary.Cell>
                    </Table.Summary.Row>
                </>
                )} 
            />
        
            </MyCard>
        }
        <NewPaymentModal purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </>
    )
}
  
const columns = [
    { 
        title: 'No', 
        dataIndex: '', 
        render: (_, record, index) => index+1 
    },
    { 
        title: 'Date', 
        dataIndex: 'created_at', 
        align: 'center',
        render: (created_at) => parseDate(created_at),
    },
    { 
        title: 'Payment Method', 
        dataIndex: 'payment_method_id', 
        align: 'center', 
        render: (payment_method_id) => getPaymentMethodTag(payment_method_id) 
    },
    { 
        title: 'Amount', 
        dataIndex: 'amount', 
        align: 'center', 
        render: (amount) => amount >= 0 ? `$${(+amount).toFixed(2)}` : `-$${(-amount).toFixed(2)}`
    },
];
