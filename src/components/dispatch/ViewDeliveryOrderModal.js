import { Button, Descriptions, Divider, message, Modal, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { DeliveryApiHelper } from '../../api/DeliveryApiHelper';
import { SalesOrderApiHelper } from '../../api/SalesOrderApiHelper';
import { DeliveryStatus, getDeliveryStatus } from '../../enums/DeliveryStatus';
import { SalesOrder } from '../../models/SalesOrder';
import { useApp } from '../../providers/AppProvider';
import { parseDateTimeSeconds } from '../../utilities/datetime';

export default function ViewDeliveryOrderModal({ showDeliveryOrder, setShowDeliveryOrder, myCallback }) {

    const { handleHttpError } = useApp();

    const [salesOrder, setSalesOrder] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showDeliveryOrder?.sales_order_id) {
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

    function onModalClose() {
        setShowDeliveryOrder(null);
        setSalesOrder(null);
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

            { (showDeliveryOrder && salesOrder) && 
                <SalesOrderDetails deliveryOrder={showDeliveryOrder} salesOrder={salesOrder} />
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

function SalesOrderDetails({ deliveryOrder, salesOrder }) {
    return (
        <>
            <Descriptions bordered size="small" layout='horizontal' column={1}>
                <Descriptions.Item label="Company"><Link to={`/customer/customers/${salesOrder.customer.id}`}>{salesOrder.customer.company_name}</Link></Descriptions.Item>
                <Descriptions.Item label="Contact Name">{salesOrder.customer.p1_name}</Descriptions.Item>
                <Descriptions.Item label="Contact Number">{salesOrder.customer.p1_phone_number}</Descriptions.Item>
                <Descriptions.Item label="Email">{salesOrder.customer.email || '-'}</Descriptions.Item>
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
