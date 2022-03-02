import { FileDoneOutlined, FileTextOutlined, PrinterOutlined, RedoOutlined, SaveOutlined, SendOutlined, StopOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, message, Popconfirm, Progress, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { SalesOrderApiHelper } from '../../../api/SalesOrderApiHelper';
import { AccountingType } from '../../../enums/AccountingType';
import { MovementType } from '../../../enums/MovementType';
import { PaymentMethod } from '../../../enums/PaymentMethod';
import { PaymentTerm } from '../../../enums/PaymentTerm';
import { SOStatus } from '../../../enums/SalesOrderStatus';
import { View } from '../../../enums/View';
import { SalesOrder } from '../../../models/SalesOrder';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout';
import SO1CustomerInfo from './SO1CustomerInfo';
import SO2Form from './SO2Form';
import SO3ItemsTable from './SO3ItemsTable';
import SO4PaymentsTable from './SO4PaymentsTable';
import SO5DeliveriesTable from './SO5DeliveriesTable';

export default function ViewSalesOrderPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [form] = Form.useForm();
  
    const [loading, setLoading] = useState(false);
    const [salesOrder, setSalesOrder] = useState(null)
    
    const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(0);

    const breadcrumbs = [
      { url: '/customer/sales', name: 'Customer' },
      { url: '/customer/sales', name: 'Sales' },
      { url: `/customer/sales/${salesOrder?.id}`, name: salesOrder?.idToString() },
    ]
  
    useEffect(() => {
      SalesOrderApiHelper.get({ id: id })
        .then(result => {
          if (result.length === 0) {
            navigate('../');
            return;
          }
          setSalesOrder(new SalesOrder(result[0]));
        })
        .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);

    function saveForLater() {
      const values = form.getFieldsValue();
      if (salesOrder.sales_order_items.filter(x => x.product == null).length > 0) {
        message.error('Each order item must have a product selected.')
        return;
      }
      const newValues = {...salesOrder, ...values};

      setLoading(true);
      SalesOrderApiHelper.update(newValues)
        .then(() => {
          message.success("Sales Order successfully updated!");
          setSalesOrder(new SalesOrder(newValues));
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    async function convertToInvoice() {
      try {
        const values = await form.validateFields();

        // Validation
        if (salesOrder.sales_order_items.filter(x => x.product == null).length > 0) {
          message.error('Each order item must have a product selected.')
          return;
        }
        for (let item of salesOrder.sales_order_items) {
          if (item.unit_price == null) {
            message.error('Each order item must have a unit price.')
            return;
          }
          if (item.quantity <= 0) {
            message.error('Each order item must have a valid quantity.')
            return;
          }
        }

        const newSalesOrder = new SalesOrder({...salesOrder, ...values});
        newSalesOrder.sales_order_status_id = SOStatus.COMPLETED.id;

        const payment = {
          sales_order_id: salesOrder.id, 
          movement_type_id: MovementType.SALE.id,
        }
        if (newSalesOrder.payment_term_id === PaymentTerm.CASH.id) {
          payment.amount = newSalesOrder.getOrderTotal();
          payment.payment_method_id = newSalesOrder.payment_method_id;
        } else if (newSalesOrder.payment_term_id === PaymentTerm.CREDIT.id) {
          payment.amount = -newSalesOrder.getOrderTotal();
          payment.accounting_type_id = AccountingType.RECEIVABLE.id;
        }

        const inventoryMovements = salesOrder.sales_order_items.map(x => {
          const movement = {
            product_id: x.product_id,
            sales_order_item_id: x.id,
            quantity: -x.quantity,
            unit_price: x.unit_price*(1+salesOrder.gst_rate/100),
            movement_type_id: MovementType.SALE.id,
          }
          return movement;
        })

        setLoading(true);
        SalesOrderApiHelper.createInventoryMovement(inventoryMovements)
          .then(() => SalesOrderApiHelper.createPayment(payment))
          .then(() => SalesOrderApiHelper.update(newSalesOrder))
          .then(() => SalesOrderApiHelper.get({ id: salesOrder.id }))
          .then(results => {
            message.success("Sales Order successfully confirmed!");
            setSalesOrder(new SalesOrder(results[0]));
            setLoading(false);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false));

      } catch (err) { }

    }

    async function closeOrder() {
      try {
        const values = await form.validateFields();
        if (salesOrder.sales_order_items.filter(x => x.product == null).length > 0) {
          message.error('Each order item must have a product selected.')
          return;
        }
        const newSalesOrder = {...salesOrder, ...values, sales_order_status_id: SOStatus.CLOSED.id, closed_on: new Date()};

        setLoading(true);
        SalesOrderApiHelper.closeOrder(newSalesOrder)
          .then(() => {
            message.success("Sales Order successfully closed!");
            setSalesOrder(new SalesOrder({...newSalesOrder}))
            setLoading(false);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false));

      } catch (err) { }
    }

    function cancelOrder() {
      const payment = {
        sales_order_id: salesOrder.id,
        amount: salesOrder.isPaymentTerm(PaymentTerm.CREDIT) ? +salesOrder.getPaymentsTotal() : -salesOrder.getPaymentsTotal(),
        movement_type_id: MovementType.REFUND.id,
        accounting_type_id: salesOrder.isPaymentTerm(PaymentTerm.CREDIT) ? 1 : null,
        payment_method_id: PaymentMethod.CASH.id,
      }

      const inventoryMovements = salesOrder.sales_order_items.map(x => {
        const movement = {
            sales_order_item_id: x.id,
            quantity: x.inventory_movements.reduce((prev, current) => prev + current.quantity, 0),
            unit_price: x.unit_price*(1+salesOrder.gst_rate/100),
            movement_type_id: MovementType.REFUND.id,
        }
        return movement;
      })
      
      setLoading(true);
      SalesOrderApiHelper.createPayment(payment)
        .then(() => SalesOrderApiHelper.createInventoryMovement(inventoryMovements))
        .then(() => SalesOrderApiHelper.updateStatusOnly({...salesOrder, sales_order_status_id: SOStatus.CANCELLED.id}))
        .then(() => SalesOrderApiHelper.get({ id: salesOrder.id }))
        .then(results => {
          message.success("Sales Order successfully cancelled!");
          setSalesOrder(new SalesOrder(results[0]));
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function navigateToCreateForm() {
      navigate('./../new', { state: { salesOrder: salesOrder }});
    }

    function sendOrder() {
      console.log(salesOrder)
    }



    return (
      <>
      { salesOrder != null &&
      <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`Sales Order ID ${salesOrder.idToString()}`}>
        <div style={{ display: 'flex', marginTop: 24 }}>
          
          <MyCard title="Customer Details" style={{ width: 350, margin: '0 12px 12px 24px' }}>
            <SO1CustomerInfo salesOrder={salesOrder} />
          </MyCard>

          <MyCard title="Order Details" style={{ flexGrow: 1, margin: '0 12px 12px 24px' }}>
            <SO2Form form={form} salesOrder={salesOrder} setSalesOrder={setSalesOrder} loading={loading} saveForLater={saveForLater} />
          </MyCard>

          <MyCard style={{ width: 250, margin: '0 24px 12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Space direction='vertical'>
              <div>
                <Typography.Title level={4} style={{ textAlign: 'center' }}>Payments</Typography.Title>
                <Progress type="circle" percent={salesOrder.getPaymentProgress()} /> 
              </div>
            </Space>
          </MyCard>

        </div>

        <MyCard style={{ marginTop: 12 }} title={!salesOrder.isStatus(SOStatus.PENDING, SOStatus.SENT) ? 'Order Items': null}>

          <SO3ItemsTable salesOrder={salesOrder} setSalesOrder={setSalesOrder} loading={loading} setLoading={setLoading} />

          { hasWriteAccessTo(View.CRM.name) && 
          <div style={{ display: 'flex', marginTop: 30 }}>

            <Space size="middle">
              <Button icon={<SendOutlined />} disabled={loading || !salesOrder.isStatus(SOStatus.PENDING)} onClick={sendOrder}>Send Order</Button>
              <Button icon={<PrinterOutlined />} disabled={loading || !salesOrder.isStatus(SOStatus.PENDING)} onClick={sendOrder}>View as PDF</Button>
            </Space>

            <div style={{ marginLeft: 'auto' }}>
              <Space size="middle">

                <Button icon={<RedoOutlined />} onClick={navigateToCreateForm}>Reorder</Button>
                
                <Popconfirm title="Are you sure? This action cannot be undone." onConfirm={cancelOrder} disabled={loading || !salesOrder.isStatus(SOStatus.PENDING, SOStatus.COMPLETED)}>
                  <Button icon={<StopOutlined />} disabled={loading || !salesOrder.isStatus(SOStatus.PENDING, SOStatus.COMPLETED)}>Cancel Order</Button>
                </Popconfirm>

                <Button icon={<SaveOutlined />} disabled={loading || !salesOrder.isStatus(SOStatus.PENDING, SOStatus.COMPLETED)} onClick={saveForLater}>Save for later</Button>
                
                { salesOrder.isStatus(SOStatus.PENDING) && 
                  <Popconfirm title="Are you sure?" onConfirm={convertToInvoice} disabled={loading}>
                    <Button type="primary" icon={<FileTextOutlined />} disabled={loading}>Confirm Order</Button>
                  </Popconfirm>
                }
                
                { salesOrder.isStatus(SOStatus.COMPLETED) && 
                  <Popconfirm title="Are you sure?" onConfirm={closeOrder} disabled={loading}>
                    <Button type="primary" icon={<FileDoneOutlined />} disabled={loading}>Close Invoice</Button>
                  </Popconfirm>
                }
              </Space>
            </div>

          </div>
          }

        </MyCard>

        { !salesOrder.isStatus(SOStatus.PENDING) && 
        <div className='flex-side-by-side'>

          <SO4PaymentsTable 
            salesOrder={salesOrder} 
            setSalesOrder={setSalesOrder} 
            loading={loading} 
          />

          <SO5DeliveriesTable 
            salesOrder={salesOrder} 
            setSalesOrder={setSalesOrder} 
            loading={loading} 
            isModalVisible={isDeliveryModalVisible} 
            setIsModalVisible={setIsDeliveryModalVisible} 
          />

        </div>
        }

      </MyLayout>
      }
      </>
    )
}
