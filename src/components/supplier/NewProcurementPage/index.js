import { Button, message, Steps } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { PurchaseOrderApiHelper } from '../../../api/PurchaseOrderApiHelper';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout';
import MyToolbar from '../../common/MyToolbar';
import NP1SupplierTable from './NP1SupplierTable';
import NP2SupplierMenuTable from './NP2SupplierMenuTable';
import NP3Confirm from './NP3Confirm';

const breadcrumbs = [
  { url: '/supplier/procurements', name: 'Supplier' },
  { url: '/supplier/procurements', name: 'Procurements' },
  { url: '/supplier/procurements/new', name: 'New' },
]

export default function NewProcurementPage() {

  const { handleHttpError } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(0)
  const [selectedSupplier, setSelectedSupplier] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (location?.state?.purchaseOrder) {
      setSelectedSupplier(location.state.purchaseOrder.supplier);
      setStep(1);
      if (location?.state?.purchaseOrder.purchase_order_items) {
        const orderItems = location.state.purchaseOrder.purchase_order_items;
        setSelectedProducts(orderItems.map(x => ({...x, key: Math.random() })));
      }
    }
  }, [location.state, setSelectedSupplier, setStep, setSelectedProducts])

  // Handles purchase order creation
  function handleSubmitEvent() {
    const purchaseOrder = {
      supplier_id: selectedSupplier.id,
      purchase_order_status_id: 1,
      purchase_order_items: selectedProducts.filter(x => x.product != null).map(x => ({ product_id: x.product.id, quantity: x.quantity })),
    }

    if (location?.state?.purchaseOrder) {
      const copy = location.state.purchaseOrder;
      purchaseOrder.charged_under_id = copy.charged_under_id;
      purchaseOrder.has_gst = copy.has_gst;
      purchaseOrder.gst_rate = copy.gst_rate;
      purchaseOrder.payment_term_id = copy.payment_term_id;
      purchaseOrder.payment_method_id = copy.payment_method_id;
    }

    PurchaseOrderApiHelper.create(purchaseOrder)
      .then(result => {
        message.success(`Invoice with ID ${result.id} successfully created!`);
        navigate(`./../${result.id}`);
      })
      .catch(handleHttpError);

  }

  return (
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Create Purchase Order">

      <MyCard>
        <Steps current={step}>
            <Steps.Step title="Supplier" description="Select a supplier" />
            <Steps.Step title="Select Items" description="Create your order" />
            <Steps.Step title="Review" description="Confirm your order" />
          </Steps>
      </MyCard>

      { step === 0 &&
        <MyCard>
          <NP1SupplierTable selectedSupplier={selectedSupplier} setSelectedSupplier={setSelectedSupplier} setSelectedProducts={setSelectedProducts} />
          <MyToolbar style={{ marginTop: 15 }}>
            <Button type="primary" onClick={() => setStep(step+1)} disabled={selectedSupplier.id == null}>Next</Button>
          </MyToolbar>
        </MyCard>
      }
      { step === 1 &&
        <MyCard>
          <NP2SupplierMenuTable 
            selectedSupplier={selectedSupplier} 
            selectedProducts={selectedProducts} 
            setSelectedProducts={setSelectedProducts} 
          />

          <MyToolbar style={{ marginTop: 15 }}>
            <Button onClick={() => setStep(step-1)}>Back</Button>
            <Button type="primary" onClick={() => setStep(step+1)} disabled={selectedProducts.length === 0}>Next</Button>
          </MyToolbar>
        </MyCard>
      }

      { step === 2 && 
        <>
          <NP3Confirm 
            selectedSupplier={selectedSupplier} 
            selectedProducts={selectedProducts} 
            step={step} setStep={setStep} 
            handleSubmitEvent={handleSubmitEvent} 
          />
        </>
      }

    </MyLayout>
  )
}
