import { FileDoneOutlined, FileTextOutlined, RedoOutlined, SaveOutlined, SendOutlined, StopOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, message, Popconfirm, Progress, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { PurchaseOrderApiHelper } from '../../../api/PurchaseOrderApiHelper';
import { AccountingType } from '../../../enums/AccountingType';
import { MovementType } from '../../../enums/MovementType';
import { PaymentMethod } from '../../../enums/PaymentMethod';
import { PaymentTerm } from '../../../enums/PaymentTerm';
import { POStatus } from '../../../enums/PurchaseOrderStatus';
import { View } from '../../../enums/View';
import { PurchaseOrder } from '../../../models/PurchaseOrder';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout';
import CopyAsTextButton from './CopyAsTextButton';
import PO1SupplierInfo from './PO1SupplierInfo';
import PO2Form from './PO2Form';
import PO3ItemsTable from './PO3ItemsTable';
import PO4PaymentsTable from './PO4PaymentsTable';
import PO5DeliveriesTable from './PO5DeliveriesTable';

export default function ViewProcurementPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [form] = Form.useForm();
  
    const [loading, setLoading] = useState(false);
    const [purchaseOrder, setPurchaseOrder] = useState(null)
    
    const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(0);

    const breadcrumbs = [
      { url: '/supplier/procurements', name: 'Supplier' },
      { url: '/supplier/procurements', name: 'Procurement' },
      { url: `/supplier/procurements/${purchaseOrder?.id}`, name: purchaseOrder?.idToString() },
    ]
  
    useEffect(() => {
      PurchaseOrderApiHelper.get({ id: id })
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
      const values = form.getFieldsValue();
      if (purchaseOrder.purchase_order_items.filter(x => x.product == null).length > 0) {
        message.error('Each order item must have a product selected.')
        return;
      }
      const newValues = {...purchaseOrder, ...values};

      setLoading(true);
      PurchaseOrderApiHelper.update(newValues)
        .then(() => {
          message.success("Purchase Order successfully updated!");
          setPurchaseOrder(new PurchaseOrder(newValues));
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    async function convertToInvoice() {
      try {
        const values = await form.validateFields();

        // Validation
        if (purchaseOrder.purchase_order_items.filter(x => x.product == null).length > 0) {
          message.error('Each order item must have a product selected.')
          return;
        }
        for (let item of purchaseOrder.purchase_order_items) {
          if (item.unit_cost == null) {
            message.error('Each order item must have a unit cost.')
            return;
          }
          if (item.quantity <= 0) {
            message.error('Each order item must have a valid quantity.')
            return;
          }
        }
        
        const newPurchaseOrder = new PurchaseOrder({...purchaseOrder, ...values});
        newPurchaseOrder.convertToInvoice();

        setLoading(true);
        PurchaseOrderApiHelper.update(newPurchaseOrder)
          .then(() => {
            message.success("Purchase Order successfully updated!");

            // Add new payment
            const payment = {
              purchase_order_id: purchaseOrder.id, 
              movement_type_id: MovementType.PURCHASE.id,
            }
            if (newPurchaseOrder.payment_term_id === PaymentTerm.CASH.id) {
              payment.amount = -newPurchaseOrder.getOrderTotal();
              payment.payment_method_id = newPurchaseOrder.payment_method_id;
            } else if (newPurchaseOrder.payment_term_id === PaymentTerm.CREDIT.id) {
              payment.amount = newPurchaseOrder.getOrderTotal();
              payment.accounting_type_id = AccountingType.PAYABLE.id;
            }
            return PurchaseOrderApiHelper.createPayment(payment);
          })
          .then(newPayment => {
            setPurchaseOrder(new PurchaseOrder({...newPurchaseOrder, payments: [...purchaseOrder.payments, newPayment] }))
            setLoading(false);
            setIsDeliveryModalVisible(1);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false));

      } catch (err) { }

    }

    async function closeOrder() {
      try {
        const values = await form.validateFields();
        if (purchaseOrder.purchase_order_items.filter(x => x.product == null).length > 0) {
          message.error('Each order item must have a product selected.')
          return;
        }
        const newPurchaseOrder = {...purchaseOrder, ...values, purchase_order_status_id: POStatus.CLOSED.id, closed_on: new Date()};

        setLoading(true);
        PurchaseOrderApiHelper.closeOrder(newPurchaseOrder)
          .then(() => {
            message.success("Purchase Order successfully closed!");
            setPurchaseOrder(new PurchaseOrder({...newPurchaseOrder}))
            setLoading(false);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false));

      } catch (err) { }
    }

    function cancelOrder() {
      const payment = {
        purchase_order_id: purchaseOrder.id,
        amount: purchaseOrder.isPaymentTerm(PaymentTerm.CREDIT) ? +purchaseOrder.getPaymentsTotal() : -purchaseOrder.getPaymentsTotal(),
        movement_type_id: MovementType.REFUND.id,
        accounting_type_id: purchaseOrder.isPaymentTerm(PaymentTerm.CREDIT) ? 1 : null,
        payment_method_id: PaymentMethod.CASH.id,
      }

      const inventoryMovements = purchaseOrder.purchase_order_items.map(x => {
        const movement = {
          product_id: x.product_id,
          purchase_order_item_id: x.id,
          quantity: x.inventory_movements.reduce((prev, current) => prev - current.quantity, 0),
          unit_cost: x.unit_cost*(1+purchaseOrder.gst_rate/100),
          movement_type_id: MovementType.REFUND.id,
        }
        return movement;
      })
      
      setLoading(true);
      PurchaseOrderApiHelper.createPayment(payment)
        .then(() => PurchaseOrderApiHelper.createInventoryMovement(inventoryMovements))
        .then(() => PurchaseOrderApiHelper.updateStatusOnly({...purchaseOrder, purchase_order_status_id: POStatus.CANCELLED.id}))
        .then(() => PurchaseOrderApiHelper.get({ id: purchaseOrder.id }))
        .then(results => {
          message.success("Purchase Order successfully cancelled!");
          setPurchaseOrder(new PurchaseOrder(results[0]));
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function navigateToCreateForm() {
      navigate('./../new', { state: { purchaseOrder: purchaseOrder }});
    }

    function sendOrder() {
      console.log(purchaseOrder)
    }



    return (
      <>
      { purchaseOrder != null &&
      <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`Purchase Order ID ${purchaseOrder.idToString()}`}>
        <div style={{ display: 'flex', marginTop: 24 }}>
          
          <MyCard title="Supplier Details" style={{ width: 350, margin: '0 12px 12px 24px' }}>
            <PO1SupplierInfo purchaseOrder={purchaseOrder} />
          </MyCard>

          <MyCard title="Order Details" style={{ flexGrow: 1, margin: '0 12px 12px 24px' }}>
            <PO2Form form={form} purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} loading={loading} saveForLater={saveForLater} />
          </MyCard>

          <MyCard style={{ width: 250, margin: '0 24px 12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Space direction='vertical'>
              <div>
                <Typography.Title level={4} style={{ textAlign: 'center' }}>Payments</Typography.Title>
                <Progress type="circle" percent={purchaseOrder.getPaymentProgress()} /> 
              </div>

              <div style={{ marginTop: 25 }}>
                <Typography.Title level={4} style={{ textAlign: 'center' }}>Deliveries</Typography.Title>
                <Progress type="circle" percent={purchaseOrder.getQuantityProgress()} /> 
              </div>
            </Space>
          </MyCard>

        </div>

        <MyCard style={{ marginTop: 12 }} title={!purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT) ? 'Order Items': null}>

          <PO3ItemsTable purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} loading={loading} setLoading={setLoading} />

          { hasWriteAccessTo(View.SCM.name) && 
          <div style={{ display: 'flex', marginTop: 30 }}>

            <Space size="middle">
              <Button icon={<SendOutlined />} disabled={loading || !purchaseOrder.isStatus(POStatus.PENDING)} onClick={sendOrder}>Send Order</Button>
              <CopyAsTextButton loading={loading} purchaseOrder={purchaseOrder} />
            </Space>

            <div style={{ marginLeft: 'auto' }}>
              <Space size="middle">

                <Button icon={<RedoOutlined />} onClick={navigateToCreateForm}>Reorder</Button>
                
                <Popconfirm title="Are you sure? This action cannot be undone." onConfirm={cancelOrder} disabled={loading || !purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)}>
                  <Button icon={<StopOutlined />} disabled={loading || !purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)}>Cancel Order</Button>
                </Popconfirm>

                <Button icon={<SaveOutlined />} disabled={loading || !purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)} onClick={saveForLater}>Save for later</Button>
                
                { purchaseOrder.isStatus(POStatus.PENDING) && 
                  <Popconfirm title="Are you sure?" onConfirm={convertToInvoice} disabled={loading}>
                    <Button type="primary" icon={<FileTextOutlined />} disabled={loading}>Convert to Invoice</Button>
                  </Popconfirm>
                }
                
                { purchaseOrder.isStatus(POStatus.ACCEPTED) && 
                  <Popconfirm title="Are you sure?" onConfirm={closeOrder} disabled={loading}>
                    <Button type="primary" icon={<FileDoneOutlined />} disabled={loading}>Close Invoice</Button>
                  </Popconfirm>
                }
              </Space>
            </div>

          </div>
          }

        </MyCard>

        { !purchaseOrder.isStatus(POStatus.PENDING) && 
        <div className='flex-side-by-side'>

          <PO4PaymentsTable 
            purchaseOrder={purchaseOrder} 
            setPurchaseOrder={setPurchaseOrder} 
            loading={loading} 
          />

          <PO5DeliveriesTable 
            purchaseOrder={purchaseOrder} 
            setPurchaseOrder={setPurchaseOrder} 
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
