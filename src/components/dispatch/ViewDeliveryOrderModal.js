import { Button, Descriptions, Divider, Modal, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { SalesOrderApiHelper } from '../../api/SalesOrderApiHelper';
import { DeliveryStatus, getDeliveryStatus } from '../../enums/DeliveryStatus';
import { SalesOrder } from '../../models/SalesOrder';
import { useApp } from '../../providers/AppProvider';
import { parseDateTimeSeconds } from '../../utilities/datetime';

export default function ViewDeliveryOrderModal({ showDeliveryOrder, setShowDeliveryOrder }) {

    const { handleHttpError } = useApp();

    const [salesOrder, setSalesOrder] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showDeliveryOrder) {
            SalesOrderApiHelper.get({ id: showDeliveryOrder.sales_order_id })
                .then(result => {
                    if (result.length === 0) {
                        return;
                    }
                    setSalesOrder(new SalesOrder(result[0]));
                })
                .catch(handleHttpError)
        }
    }, [showDeliveryOrder, handleHttpError, setSalesOrder]);

    return (
        <Modal width={800} bodyStyle={{ height: "60vh", overflowY: "scroll" }}
            title={<>Delivery for <Link to={`/customer/sales/${showDeliveryOrder?.sales_order_id}`}>Sales Order ID {showDeliveryOrder?.sales_order_id}</Link></>} 
            visible={showDeliveryOrder}  
            onCancel={() => setShowDeliveryOrder(null)}
            footer={
                <>
                    <Button key="back" onClick={() => setShowDeliveryOrder(null)}>
                        Cancel
                    </Button>
                    { showDeliveryOrder?.delivery_status_id === DeliveryStatus.ASSIGNED.id && 
                        <Button key="submit" type="primary" loading={loading} onClick={() => setShowDeliveryOrder(null)}>
                            Unassign Delivery
                        </Button>
                    }
                    { showDeliveryOrder?.delivery_status_id !== DeliveryStatus.COMPLETED.id && 
                        <Button key="submit" type="primary" loading={loading} onClick={() => setShowDeliveryOrder(null)}>
                            Complete Delivery
                        </Button>
                    }
                </>
            }
        >
            { (showDeliveryOrder && salesOrder) && 
                <>
                    <Descriptions bordered size="small" layout='horizontal' column={1}>
                        <Descriptions.Item label="Company"><Link to={`/customer/customers/${salesOrder.customer.id}`}>{salesOrder.customer.company_name}</Link></Descriptions.Item>
                        <Descriptions.Item label="Contact Name">{salesOrder.customer.p1_name}</Descriptions.Item>
                        <Descriptions.Item label="Contact Number">{salesOrder.customer.p1_phone_number}</Descriptions.Item>
                        <Descriptions.Item label="Email">{salesOrder.customer.email || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Delivery Address">{showDeliveryOrder.address}</Descriptions.Item>
                        <Descriptions.Item label="Delivery Postal Code">{showDeliveryOrder.postal_code}</Descriptions.Item>
                        <Descriptions.Item label="Delivery Remarks">{showDeliveryOrder.remarks || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Delivery Status">{getDeliveryStatus(showDeliveryOrder.delivery_status_id).name}</Descriptions.Item>
                        <Descriptions.Item label="Completed At">{showDeliveryOrder.deliver_at ? parseDateTimeSeconds(showDeliveryOrder.deliver_at) : '-'}</Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={salesOrder.sales_order_items}
                        rowKey={() => Math.random()}
                        summary={pageData => {
                            if (salesOrder == null) return <></>

                            return (
                                <>
                                {(salesOrder.has_gst === 2) && 
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell colSpan={5}>
                                            <Typography.Text strong>
                                            {salesOrder.has_gst === 2 && `GST ${salesOrder.gst_rate}% (Exclusive)`}
                                            </Typography.Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell align='center'>
                                            <Typography.Text strong>
                                            ${salesOrder.getGstAmount().toFixed(2)}
                                            </Typography.Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                }

                                {salesOrder.offset > 0 && 
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell colSpan={5}>
                                            <Typography.Text strong>Offset</Typography.Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell align='center'>
                                            <Typography.Text strong>${(+salesOrder.offset).toFixed(2) || 0}</Typography.Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                }

                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={5}>
                                    <Typography.Text strong>Total</Typography.Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell align='center'>
                                    <Typography.Text strong>
                                        {`$${salesOrder.getOrderTotal().toFixed(2)}`}
                                    </Typography.Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                                </>
                            );
                        }}
                    />
                    

                </>
            }

        </Modal>
    )
}

const columns = [
    { 
        width: 50, 
        render: (_, record, index) => index+1 
    },
    { 
        title: 'Name', 
        dataIndex: 'product', 
        ellipsis: true,
        render: (product) => product?.name 
    },
    { 
        title: 'Unit', 
        dataIndex: 'product', 
        ellipsis: true,
        width: '10%',
        render: (product) => product?.unit 
    },
    { 
        title: 'Quantity', 
        dataIndex: 'quantity', 
        align: 'center', 
        width: '15%',
        ellipsis: true,
    },
    { 
        title: 'Unit Price', 
        dataIndex: 'unit_price', 
        align: 'center', 
        ellipsis: true,
        width: '15%',
        render: (unit_price) => `$${(+unit_price).toFixed(2)}`
    },
    { 
        title: 'Subtotal', 
        dataIndex: '', 
        key: 'subtotal', 
        width: '15%',
        ellipsis: true,
        render: (_, record) => `$${(record.quantity*record.unit_price).toFixed(2)}`, align: 'center' 
    },
];
