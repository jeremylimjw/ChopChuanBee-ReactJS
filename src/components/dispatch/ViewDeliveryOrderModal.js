import { Button, Descriptions, Divider, message, Modal, Table, Typography } from 'antd';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { DeliveryApiHelper } from '../../api/DeliveryApiHelper';
import { DeliveryStatus, getDeliveryStatus } from '../../enums/DeliveryStatus';
import { SalesOrder } from '../../models/SalesOrder';
import { useApp } from '../../providers/AppProvider';
import { parseDateTimeSeconds } from '../../utilities/datetime';

export default function ViewDeliveryOrderModal({ showDeliveryOrder, setShowDeliveryOrder, myCallback }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);

    function onModalClose() {
        setShowDeliveryOrder(null);
    }

    function completeOrder() {
        const newDeliveryOrder = {...showDeliveryOrder, delivery_status_id: DeliveryStatus.COMPLETED.id };

        setLoading(true);
        DeliveryApiHelper.updateOrder(newDeliveryOrder)
            .then(updatedDeliveryOrder => {
                myCallback();
                setLoading(false);
                message.success('Delivery order successfully completed!');
                onModalClose();
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    function unassignOrder() {
        const newDeliveryOrder = {...showDeliveryOrder, delivery_status_id: DeliveryStatus.PENDING.id };

        setLoading(true);
        DeliveryApiHelper.updateOrder(newDeliveryOrder)
            .then(updatedDeliveryOrder => {
                myCallback();
                setLoading(false);
                message.success('Delivery order successfully unassigned!');
                onModalClose();
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    function deleteOrder() {
        setLoading(true);
        DeliveryApiHelper.deleteOrder(showDeliveryOrder.id)
            .then(updatedDeliveryOrder => {
                myCallback();
                setLoading(false);
                message.success('Delivery order successfully deleted!');
                onModalClose();
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    return (
        <Modal width={800} bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
            title={
            <>
            { showDeliveryOrder?.sales_order_id ? 
                <>Delivery for <Link to={`/customer/sales/${showDeliveryOrder?.sales_order_id}`}>Sales Order ID {showDeliveryOrder?.sales_order_id}</Link></>
                :
                <>Custom Delivery Order</>
            }
            </>
            } 
            visible={showDeliveryOrder}  
            onCancel={onModalClose}
            footer={
                <>
                    <Button loading={loading} onClick={deleteOrder} disabled={showDeliveryOrder?.sales_order_id != null}>
                        Delete Delivery
                    </Button>

                    <Button loading={loading} onClick={unassignOrder} disabled={showDeliveryOrder?.delivery_status_id !== DeliveryStatus.ASSIGNED.id}>
                        Unassign Delivery
                    </Button>

                    <Button type="primary" loading={loading} onClick={completeOrder} disabled={showDeliveryOrder?.delivery_status_id === DeliveryStatus.COMPLETED.id}>
                        Complete Delivery
                    </Button>
                </>
            }
        >

            { (showDeliveryOrder && showDeliveryOrder.sales_order_id != null) && 
                <SalesOrderDetails deliveryOrder={showDeliveryOrder} />
            }

            { (showDeliveryOrder && showDeliveryOrder.sales_order_id == null) && 
                <CustomOrderDetails deliveryOrder={showDeliveryOrder} />
            }

        </Modal>
    )
}

function CustomOrderDetails({ deliveryOrder }) {

    return (
        <>
            <Descriptions bordered size="small" layout='horizontal' column={1}>
                <Descriptions.Item label="Delivery Address">{deliveryOrder.address}</Descriptions.Item>
                <Descriptions.Item label="Delivery Postal Code">{deliveryOrder.postal_code}</Descriptions.Item>
                <Descriptions.Item label="Delivery Remarks">{deliveryOrder.remarks || '-'}</Descriptions.Item>
                <Descriptions.Item label="Delivery Status">{getDeliveryStatus(deliveryOrder.delivery_status_id).name}</Descriptions.Item>
                <Descriptions.Item label="Completed At">{deliveryOrder.deliver_at ? parseDateTimeSeconds(deliveryOrder.deliver_at) : '-'}</Descriptions.Item>
                { deliveryOrder?.signature && 
                    <Descriptions.Item label="Signature"><img height="100" src={deliveryOrder.signature} /></Descriptions.Item>
                }
            </Descriptions>
        </>
    )

}

function SalesOrderDetails({ deliveryOrder }) {
    function getSalesOrder(salesOrder) {
        return new SalesOrder(salesOrder);
    }
    return (
        <>
            <Descriptions bordered size="small" layout='horizontal' column={1}>
                <Descriptions.Item label="Company"><Link to={`/customer/customers/${deliveryOrder.sales_order.customer.id}`}>{deliveryOrder.sales_order.customer.company_name}</Link></Descriptions.Item>
                <Descriptions.Item label="Contact Name">{deliveryOrder.sales_order.customer.p1_name}</Descriptions.Item>
                <Descriptions.Item label="Contact Number">{deliveryOrder.sales_order.customer.p1_phone_number}</Descriptions.Item>
                <Descriptions.Item label="Email">{deliveryOrder.sales_order.customer.email || '-'}</Descriptions.Item>
                <Descriptions.Item label="Delivery Address">{deliveryOrder.address}</Descriptions.Item>
                <Descriptions.Item label="Delivery Postal Code">{deliveryOrder.postal_code}</Descriptions.Item>
                <Descriptions.Item label="Delivery Remarks">{deliveryOrder.remarks || '-'}</Descriptions.Item>
                <Descriptions.Item label="Delivery Status">{getDeliveryStatus(deliveryOrder.delivery_status_id).name}</Descriptions.Item>
                <Descriptions.Item label="Completed At">{deliveryOrder.deliver_at ? parseDateTimeSeconds(deliveryOrder.deliver_at) : '-'}</Descriptions.Item>
                { deliveryOrder?.signature && 
                    <Descriptions.Item label="Signature"><img height="100" src={deliveryOrder.signature} /></Descriptions.Item>
                }
            </Descriptions>
            

            <Divider />

            <Table
                pagination={false}
                columns={columns}
                dataSource={deliveryOrder.sales_order.sales_order_items}
                rowKey={() => Math.random()}
                summary={pageData => {
                    if (deliveryOrder.sales_order == null) return <></>

                    return (
                        <>
                        {(deliveryOrder.sales_order.has_gst === 2) && 
                            <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={5}>
                                    <Typography.Text strong>
                                    {deliveryOrder.sales_order.has_gst === 2 && `GST ${deliveryOrder.sales_order.gst_rate}% (Exclusive)`}
                                    </Typography.Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align='center'>
                                    <Typography.Text strong>
                                    ${getSalesOrder(deliveryOrder.sales_order).getGstAmount().toFixed(2)}
                                    </Typography.Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        }

                        {deliveryOrder.sales_order.offset > 0 && 
                            <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={5}>
                                    <Typography.Text strong>Offset</Typography.Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align='center'>
                                    <Typography.Text strong>${(+deliveryOrder.sales_order.offset).toFixed(2) || 0}</Typography.Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        }

                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={5}>
                            <Typography.Text strong>Total</Typography.Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align='center'>
                            <Typography.Text strong>
                                {`$${getSalesOrder(deliveryOrder.sales_order).getOrderTotal().toFixed(2)}`}
                            </Typography.Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                        </>
                    );
                }}
            />
            

        </>
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
