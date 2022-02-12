import { PlusOutlined, UndoOutlined } from '@ant-design/icons/lib/icons'
import { Button, Table, Typography } from 'antd'
import React from 'react'
import { POStatus } from '../../../enums/PurchaseOrderStatus'
import MyCard from '../../layout/MyCard'
import MyToolbar from '../../layout/MyToolbar'
import { getPaymentMethodTag } from '../../../enums/PaymentMethod'

export default function PaymentsTable({ purchaseOrder, setPurchaseOrder, loading }) {
    return (
        <>
        { purchaseOrder != null && 
            <MyCard style={{ flexGrow: 1, margin: '0 12px 24px 24px' }} title={ !purchaseOrder.isStatus(POStatus.ACCEPTED) ? "Past Payment History" : "" }>
        
            { purchaseOrder.isStatus(POStatus.ACCEPTED) && 
                <MyToolbar title="Payments">
                    <Button icon={<UndoOutlined />} disabled={loading}>Refund</Button>
                    <Button type="primary" icon={<PlusOutlined />} disabled={loading}>Add Payment</Button>
                </MyToolbar>
            }
        
            <Table columns={columns} dataSource={purchaseOrder.getPayments()} rowKey="id"
            summary={pageData => {
                return (
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
                );
            }} />
        
            </MyCard>
        }
        </>
    )
}
  
const columns = [
  { title: 'No', dataIndex: '', align: 'center', render: (_, record, index) => index+1 },
  { title: 'Date', dataIndex: 'created_at', align: 'center' },
  { title: 'Payment Method', dataIndex: 'payment_method_id', align: 'center', render: (payment_method_id) => getPaymentMethodTag(payment_method_id) },
  { title: 'Amount', dataIndex: 'amount', align: 'center', render: (amount) => `$${(+amount).toFixed(2)}` },
];
