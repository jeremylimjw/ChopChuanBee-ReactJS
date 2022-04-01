import { FileDoneOutlined, FileTextOutlined, PrinterOutlined, RedoOutlined, SaveOutlined, SendOutlined, StopOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, message, Popconfirm, Progress, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { DeliveryApiHelper } from '../../../api/DeliveryApiHelper';
import { SalesOrderApiHelper } from '../../../api/SalesOrderApiHelper';
import { SOStatus } from '../../../enums/SalesOrderStatus';
import { View } from '../../../enums/View';
import { SalesOrder } from '../../../models/SalesOrder';
import { useApp } from '../../../providers/AppProvider';
import { generatePdf } from '../../../utilities/Report/ReportExporter';
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


  // Save a sales order
  async function saveForLater(showSuccessMessage = true) {
    const values = form.getFieldsValue();
    if (salesOrder.sales_order_items.filter(x => x.product == null).length > 0) {
      message.error('Each order item must have a product selected.')
      return;
    }
    const newValues = { ...salesOrder, ...values };

    try {
      await SalesOrderApiHelper.update(newValues);
      if (showSuccessMessage) {
        message.success("Sales Order successfully updated!");
      }
      setSalesOrder(new SalesOrder(newValues));
    } catch (err) {
      handleHttpError(err);
    }

    setLoading(false);
  }

  // Confirm a sales order
  async function confirmOrder() {
    try {
      const values = await form.validateFields();
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

      // Update sales order values first
      await saveForLater(false);

      const newSalesOrder = new SalesOrder({ ...salesOrder, ...values });

      setLoading(true);
      SalesOrderApiHelper.confirmOrder(newSalesOrder)
        .then(updatedSalesOrder => {
          message.success("Sales Order successfully confirmed!");
          setSalesOrder(new SalesOrder(updatedSalesOrder));
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));

    } catch (err) { }

  }

  function navigateToCreateForm() {
    navigate('./../new', { state: { salesOrder: salesOrder } });
  }

  async function sendEmail() {
    try {
      const results = await DeliveryApiHelper.getOrders({ sales_order_id: salesOrder.id })
      const deliveryOrder = results[0]; // NOTE: this maybe undefined if sales order does not have delivery

      console.log(deliveryOrder)
      console.log(salesOrder)

    } catch (err) {
      handleHttpError(err);
    }

  }

  // Close a sales order
  async function closeOrder() {
    try {
      const values = await form.validateFields();
      if (salesOrder.sales_order_items.filter(x => x.product == null).length > 0) {
        message.error('Each order item must have a product selected.')
        return;
      }
      const newSalesOrder = { ...salesOrder, ...values, sales_order_status_id: SOStatus.CLOSED.id, closed_on: new Date() };

      setLoading(true);
      SalesOrderApiHelper.closeOrder(newSalesOrder)
        .then(() => {
          message.success("Sales Order successfully closed!");
          setSalesOrder(new SalesOrder({ ...newSalesOrder }))
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));

    } catch (err) { }
  }


  // Cancel a sales order
  function cancelOrder() {
    setLoading(true);
    SalesOrderApiHelper.cancelOrder(salesOrder)
      .then(updatedSalesOrder => {
        message.success("Sales Order successfully cancelled!");
        setSalesOrder(new SalesOrder(updatedSalesOrder));
        setLoading(false);
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false));
  }

  function sendOrder() {
    console.log(salesOrder)
  }

  async function fetchDeliveryOrders() {
    const results = await DeliveryApiHelper.getOrders({ sales_order_id: salesOrder.id })
    const deliveryOrder = results[0]; // NOTE: this maybe undefined if sales order does not have delivery
    return deliveryOrder
  }

  async function viewAsPDF(action) {
    let data
    switch (action) {
      case 'SO':
        data = {
          ...salesOrder,
          preGstPrice: salesOrder.sumItemSubtotals(),
          totalPrice: salesOrder.getOrderTotal()
        }
        generatePdf(data, action)
        break
      case 'STICKER':
        const deliveryOrder = await fetchDeliveryOrders()
        data = {
          ...salesOrder,
          deliveryOrder
        }
        generatePdf(data, action)
        break
      case 'PACKING_LIST':
        generatePdf(salesOrder, action)
        break
      default:
        break
    }
  }

  return (
    <>
      {salesOrder != null &&
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`Sales Order ID ${salesOrder.idToString()}`}>
          <div style={{ display: 'flex', marginTop: 24 }}>

            <MyCard title="Customer Details" style={{ width: 400, margin: '0 12px 12px 24px' }}>
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

          <MyCard style={{ marginTop: 12 }} title={!salesOrder.isStatus(SOStatus.PENDING, SOStatus.SENT) ? 'Order Items' : null}>

            <SO3ItemsTable salesOrder={salesOrder} setSalesOrder={setSalesOrder} loading={loading} setLoading={setLoading} />

            {hasWriteAccessTo(View.CRM.name) &&
              <div style={{ display: 'flex', marginTop: 30 }}>

                <Space size="middle">
                  {(!salesOrder.isStatus(SOStatus.PENDING) && !salesOrder.isStatus(SOStatus.CANCELLED)) &&
                    <>
                      <Button icon={<SendOutlined />} onClick={sendOrder}>Send Email</Button>
                      <Button icon={<PrinterOutlined />} onClick={() => viewAsPDF('SO')}>Invoice</Button>
                      <Button icon={<PrinterOutlined />} onClick={() => viewAsPDF('PACKING_LIST')}>Packing List</Button>
                      <Button icon={<PrinterOutlined />} onClick={() => viewAsPDF('STICKER')}>Delivery Sticker</Button>
                    </>
                  }
                </Space>

                <div style={{ marginLeft: 'auto' }}>
                  <Space size="middle">

                    <Button icon={<RedoOutlined />} onClick={navigateToCreateForm}>Reorder</Button>

                    {salesOrder.isStatus(SOStatus.PENDING, SOStatus.COMPLETED) &&
                      <Popconfirm title="Are you sure? This action cannot be undone." onConfirm={cancelOrder} disabled={loading}>
                        <Button icon={<StopOutlined />} disabled={loading}>Cancel Order</Button>
                      </Popconfirm>
                    }

                    {salesOrder.isStatus(SOStatus.PENDING, SOStatus.COMPLETED) &&
                      <Button icon={<SaveOutlined />} disabled={loading} onClick={saveForLater}>Save for later</Button>
                    }

                    {salesOrder.isStatus(SOStatus.PENDING) &&
                      <Popconfirm title="Are you sure?" onConfirm={confirmOrder} disabled={loading}>
                        <Button type="primary" icon={<FileTextOutlined />} disabled={loading}>Confirm Order</Button>
                      </Popconfirm>
                    }

                    {salesOrder.isStatus(SOStatus.COMPLETED) &&
                      <Popconfirm title="Are you sure?" onConfirm={closeOrder} disabled={loading}>
                        <Button type="primary" icon={<FileDoneOutlined />} disabled={loading}>Close Invoice</Button>
                      </Popconfirm>
                    }
                  </Space>
                </div>

              </div>
            }

          </MyCard>

          {!salesOrder.isStatus(SOStatus.PENDING) &&
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
