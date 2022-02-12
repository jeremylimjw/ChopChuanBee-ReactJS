import { FileDoneOutlined, FileTextOutlined, SaveOutlined, SendOutlined, StopOutlined } from '@ant-design/icons/lib/icons';
import { Button, message, Popconfirm, Progress, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { PurchaseOrderApiHelper } from '../api/purchaseOrder';
import MyCard from '../components/layout/MyCard';
import MyLayout from '../components/layout/MyLayout'
import DeliveriesTable from '../components/purchaseModule/viewPurchaseOrder/DeliveriesTable';
import OrderItemsTable from '../components/purchaseModule/viewPurchaseOrder/OrderItemsTable';
import PaymentsTable from '../components/purchaseModule/viewPurchaseOrder/PaymentsTable';
import PurchaseOrderForm from '../components/purchaseModule/viewPurchaseOrder/PurchaseOrderForm';
import SupplierInfo from '../components/purchaseModule/viewPurchaseOrder/SupplierInfo';
import { POStatus } from '../enums/PurchaseOrderStatus';
import { PurchaseOrder } from '../models/PurchaseOrder';
import { useApp } from '../providers/AppProvider';

export default function ViewPurchaseOrderPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError } = useApp();
  
    const [loading, setLoading] = useState(false);
    const [purchaseOrder, setPurchaseOrder] = useState(null)

    const breadcrumbs = [
      { url: '/purchases/orders', name: 'Purchases' },
      { url: '/purchases/orders', name: 'Orders' },
      { url: `/purchases/orders/${purchaseOrder?.id}`, name: purchaseOrder?.idToString() },
    ]
  
    useEffect(() => {
      PurchaseOrderApiHelper.getById(id)
        .then(result => {
          if (result.length === 0) {
            navigate('../');
            return;
          }
          setPurchaseOrder(new PurchaseOrder(result[0]));
        })
        .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);

    function saveForLater() {
      setLoading(true);
      PurchaseOrderApiHelper.update(purchaseOrder)
        .then(() => {
          message.success("Purchase Order successfully updated!");
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function convertToInvoice() {
      setLoading(true);

      const newPurchaseOrder = purchaseOrder.convertToInvoice();

      PurchaseOrderApiHelper.update(newPurchaseOrder)
        .then(() => {
          message.success("Purchase Order successfully updated!");

          // Add new payment
          let payment;
          if (newPurchaseOrder.payment_term_id === 1) { // Cash
            payment = { purchase_order_id: purchaseOrder.id, amount: -newPurchaseOrder.getOrderTotal(), payment_method_id: newPurchaseOrder.payment_method_id };
          } else { // Credit
            payment = { purchase_order_id: purchaseOrder.id, amount: newPurchaseOrder.getOrderTotal(), accounting_type_id: 1 };
          }
          return PurchaseOrderApiHelper.createPayment(payment);
        })
        .then(newPayment => {
          newPurchaseOrder.payments = [...purchaseOrder.payments]
          newPurchaseOrder.payments.push(newPayment);
          setPurchaseOrder(new PurchaseOrder({...newPurchaseOrder}))
          setLoading(false);

        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));

    }

    function cancelOrder() {
      setLoading(true);
      const newPurchaseOrder = {...purchaseOrder, purchase_order_status_id: POStatus.CANCELLED.id };
      PurchaseOrderApiHelper.updateStatusOnly(newPurchaseOrder)
        .then(() => {
          message.success("Purchase Order successfully cancelled!");
          setPurchaseOrder(new PurchaseOrder({...newPurchaseOrder}))
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function closeOrder() {
      setLoading(true);
      const newPurchaseOrder = {...purchaseOrder, purchase_order_status_id: POStatus.CLOSED.id, closed_on: new Date() };
      PurchaseOrderApiHelper.closeOrder(newPurchaseOrder)
        .then(() => {
          message.success("Purchase Order successfully closed!");
          setPurchaseOrder(new PurchaseOrder({...newPurchaseOrder}))
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }



    return (
      <>
      { purchaseOrder != null &&
      <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`Purchase Order ID ${purchaseOrder.idToString()}`}>
        <div style={{ display: 'flex', marginTop: 24 }}>
          
          <MyCard title="Supplier Details" style={{ width: 350, margin: '0 12px 12px 24px' }}>
            <SupplierInfo purchaseOrder={purchaseOrder} />
          </MyCard>

          <MyCard title="Order Details" style={{ flexGrow: 1, margin: '0 12px 12px 24px' }}>
            <PurchaseOrderForm purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} loading={loading} saveForLater={saveForLater} />
          </MyCard>

          <MyCard style={{ width: 250, margin: '0 24px 12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Space direction='vertical'>
              <div>
                <Typography.Title level={4} style={{ textAlign: 'center' }}>Payments</Typography.Title>
                <Progress type="circle" percent={Math.round(purchaseOrder.getPaymentsTotal()/purchaseOrder.getOrderTotal()*100)} /> 
              </div>

              <div style={{ marginTop: 25 }}>
                <Typography.Title level={4} style={{ textAlign: 'center' }}>Deliveries</Typography.Title>
                <Progress type="circle" percent={89} /> 
              </div>
            </Space>
          </MyCard>

        </div>

        <MyCard style={{ marginTop: 12 }} title={!purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT) ? 'Order Items': null}>

          <OrderItemsTable purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} loading={loading} />

          <div style={{ display: 'flex', marginTop: 30 }}>

            <Button icon={<SendOutlined />} disabled={loading || !purchaseOrder.isStatus(POStatus.PENDING)}>Send Order</Button>

            <div style={{ marginLeft: 'auto' }}>
              <Space size="middle">
                
                <Popconfirm title="Are you sure? This action cannot be undone." onConfirm={cancelOrder} disabled={loading || !purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)}>
                  <Button icon={<StopOutlined />} disabled={loading || !purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)}>Cancel Order</Button>
                </Popconfirm>

                <Button icon={<SaveOutlined />} disabled={loading || !purchaseOrder.isStatus(purchaseOrder, POStatus.PENDING, POStatus.ACCEPTED)} onClick={saveForLater}>Save for later</Button>
                
                { purchaseOrder?.isStatus(POStatus.PENDING) && 
                  <Button type="primary" icon={<FileTextOutlined />} disabled={loading} onClick={convertToInvoice}>Convert to Invoice</Button>
                }
                
                { purchaseOrder?.isStatus(POStatus.ACCEPTED) && 
                  <Button type="primary" icon={<FileDoneOutlined />} disabled={loading} onClick={closeOrder}>Close Invoice</Button>
                }
              </Space>
            </div>

          </div>

        </MyCard>

        { !purchaseOrder.isStatus(POStatus.PENDING) && 
        <div style={{ display: 'flex'}}>

          <PaymentsTable purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} loading={loading} />
          <DeliveriesTable purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} loading={loading} />

        </div>
        }

      </MyLayout>
      }
      </>
    )
}
