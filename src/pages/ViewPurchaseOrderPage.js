import { FileDoneOutlined, FileExcelOutlined, FileTextOutlined, PlusOutlined, SaveOutlined, SendOutlined, StopOutlined } from '@ant-design/icons/lib/icons';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { PurchaseOrderApiHelper } from '../api/purchaseOrder';
import MyCard from '../components/layout/MyCard';
import MyLayout from '../components/layout/MyLayout'
import MyToolbar from '../components/layout/MyToolbar';
import { Status, isStatus } from '../components/purchaseModule/helpers';
import OrderItemsTable from '../components/purchaseModule/viewPurchaseOrder/OrderItemsTable';
import PurchaseOrderForm from '../components/purchaseModule/viewPurchaseOrder/PurchaseOrderForm';
import SupplierInfo from '../components/purchaseModule/viewPurchaseOrder/SupplierInfo';
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
      { url: `/purchases/orders/${purchaseOrder?.id}`, name: purchaseOrder?.id.toString().padStart(8, "0") },
    ]
  
    useEffect(() => {
      PurchaseOrderApiHelper.getById(id)
        .then(result => {
          if (result.length === 0) {
            navigate('../');
            return;
          }
          setPurchaseOrder(result[0]);
        })
        .catch(handleHttpError)
    }, []);

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
      PurchaseOrderApiHelper.update(purchaseOrder)
        .then(() => {
          message.success("Purchase Order successfully updated!");
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));

    }

    function cancelOrder() {
      setLoading(true);
      const newPurchaseOrder = {...purchaseOrder, purchase_order_status_id: Status.CANCELLED.id };
      PurchaseOrderApiHelper.updateStatusOnly(newPurchaseOrder)
        .then(() => {
          message.success("Purchase Order successfully cancelled!");
          setPurchaseOrder(newPurchaseOrder)
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function closeOrder() {
      setLoading(true);
      const newPurchaseOrder = {...purchaseOrder, purchase_order_status_id: Status.CLOSED.id };
      PurchaseOrderApiHelper.updateStatusOnly(newPurchaseOrder)
        .then(() => {
          message.success("Purchase Order successfully cancelled!");
          setPurchaseOrder(newPurchaseOrder)
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }



    return (
      <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`Purchase Order ID ${purchaseOrder?.id.toString().padStart(8, "0")}`}>

        <div style={{ display: 'flex', marginTop: 24 }}>
          
          <MyCard title="Supplier Details" style={{ width: 400, margin: '0 12px 12px 24px' }}>
            <SupplierInfo purchaseOrder={purchaseOrder} />
          </MyCard>

          <MyCard title="Order Details" style={{ width: 600, margin: '0 12px 12px 24px' }}>
            <PurchaseOrderForm purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} />
          </MyCard>

        </div>

        <MyCard style={{ marginTop: 12 }} title={!isStatus(purchaseOrder, Status.PENDING, Status.SENT) ? 'Order Items': null}>
          
          { isStatus(purchaseOrder, Status.PENDING, Status.SENT) && 
            <MyToolbar title="Order Items">
                <Button icon={<PlusOutlined />} disabled={loading}>Add Item</Button>
            </MyToolbar>
          }

          <OrderItemsTable purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} />

          <div style={{ display: 'flex', marginTop: 30 }}>

            <Button icon={<SendOutlined />} disabled={loading || !isStatus(purchaseOrder, Status.PENDING)}>Send Order</Button>

            <div style={{ marginLeft: 'auto' }}>
              <Space size="middle">
                
                <Popconfirm title="Are you sure? This action cannot be undone." onConfirm={cancelOrder} disabled={loading || !isStatus(purchaseOrder, Status.PENDING, Status.ACCEPTED)}>
                  <Button icon={<StopOutlined />} disabled={loading || !isStatus(purchaseOrder, Status.PENDING, Status.ACCEPTED)}>Cancel Order</Button>
                </Popconfirm>
                <Button icon={<SaveOutlined />} disabled={loading || !isStatus(purchaseOrder, Status.PENDING, Status.ACCEPTED)} onClick={saveForLater}>Save for later</Button>
                { isStatus(purchaseOrder, Status.PENDING) && 
                  <Button type="primary" icon={<FileTextOutlined />} disabled={loading}>Convert to Invoice</Button>
                }
                { isStatus(purchaseOrder, Status.ACCEPTED) && 
                  <Button type="primary" icon={<FileDoneOutlined />} disabled={loading} onClick={closeOrder}>Close Invoice</Button>
                }
              </Space>
            </div>

          </div>

        </MyCard>

      </MyLayout>
    )
}
