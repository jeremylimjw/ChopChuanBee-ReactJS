import { Button, message, Steps } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { PurchaseOrderApiHelper } from '../api/purchaseOrder';
import MyCard from '../components/layout/MyCard';
import MyLayout from '../components/layout/MyLayout';
import MyToolbar from '../components/layout/MyToolbar';
import ConfirmOrderTab from '../components/purchaseModule/newPurchaseOrder/ConfirmOrderTab';
import SupplierMenuTable from '../components/purchaseModule/newPurchaseOrder/SupplierMenuTable';
import SupplierTable from '../components/purchaseModule/newPurchaseOrder/SupplierTable';
import { useApp } from '../providers/AppProvider';

const breadcrumbs = [
  { url: '/procurements', name: 'Procurements' },
  { url: '/procurements/new', name: 'New' },
]

export default function NewPurchaseOrderPage() {

  const { handleHttpError } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0)
  const [selectedSupplier, setSelectedSupplier] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Handles purchase order creation
  function handleSubmitEvent() {
    const purchaseOrder = {
      supplier_id: selectedSupplier.id,
      purchase_order_status_id: 1,
      purchase_order_items: selectedProducts.filter(x => x.quantity !== 0).map(x => ({ product_id: x.product_id, quantity: x.quantity })),
    }

    PurchaseOrderApiHelper.create(purchaseOrder)
      .then(result => {
        message.success(`Invoice with ID ${result.id} successfully created!`);
        navigate(`../${result.id}`);
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
          <SupplierTable setSelectedSupplier={setSelectedSupplier} />
          <MyToolbar style={{ marginTop: 15 }}>
            <Button type="primary" onClick={() => setStep(step+1)} disabled={selectedSupplier.length === 0}>Next</Button>
          </MyToolbar>
        </MyCard>
      }
      { step === 1 &&
        <MyCard>
          <SupplierMenuTable selectedSupplier={selectedSupplier} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />

          <MyToolbar style={{ marginTop: 15 }}>
            <Button onClick={() => setStep(step-1)}>Back</Button>
            <Button type="primary" onClick={() => setStep(step+1)} disabled={selectedProducts.filter(x => x.quantity !== 0).length === 0}>Next</Button>
          </MyToolbar>
        </MyCard>
      }

      { step === 2 && 
        <>
          <ConfirmOrderTab selectedSupplier={selectedSupplier} selectedProducts={selectedProducts} step={step} setStep={setStep} handleSubmitEvent={handleSubmitEvent} />
        </>
      }

    </MyLayout>
  )
}
