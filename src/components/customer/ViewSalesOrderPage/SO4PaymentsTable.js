import { PlusOutlined, UndoOutlined } from '@ant-design/icons/lib/icons'
import { Button, Table, Typography } from 'antd'
import React, { useState } from 'react'
import { getPaymentMethodTag } from '../../../enums/PaymentMethod';
import { SOStatus } from '../../../enums/SalesOrderStatus';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { parseDate } from '../../../utilities/datetime';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import NewPaymentModal from './NewPaymentModal';

export default function SO4PaymentsTable({ salesOrder, setSalesOrder, loading }) {

    const { hasWriteAccessTo } = useApp();
    
    const [isModalVisible, setIsModalVisible] = useState(0);

    return (
        <>
        { salesOrder != null && 
            <MyCard title={ !salesOrder.isStatus(SOStatus.COMPLETED) ? "Past Payment History" : "" }>
        
            { salesOrder.isStatus(SOStatus.COMPLETED) && 
                <MyToolbar title="Payments">
                    {hasWriteAccessTo(View.CRM.id) &&
                    <>
                        <Button icon={<UndoOutlined />} disabled={loading} onClick={() => setIsModalVisible(2)}>Refund</Button>
                        <Button type="primary" icon={<PlusOutlined />} disabled={loading} onClick={() => setIsModalVisible(1)}>Add Payment</Button>
                    </>
                    }
                </MyToolbar>
            }
        
            <Table 
                columns={columns} dataSource={salesOrder.getPayments()} 
                rowKey={() => Math.random()}
                summary={pageData => (
                <>
                    <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3}>
                        <Typography.Text strong>Total</Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align='center'>
                        <Typography.Text strong>
                        {`$${salesOrder.getPaymentsTotal().toFixed(2)}`}
                        </Typography.Text>
                    </Table.Summary.Cell>
                    </Table.Summary.Row>
                </>
                )} 
            />
        
            </MyCard>
        }
        <NewPaymentModal salesOrder={salesOrder} setSalesOrder={setSalesOrder} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
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
        render: (amount) => {
            if (amount >= 0) {
                return <span>{`$${(+amount).toFixed(2)}`}</span>
            } else {
                return <span style={{ color: 'red' }}>{`-$${(-amount).toFixed(2)}`}</span>
            }
        }
    },
];
