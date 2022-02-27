import { Button, message, Steps } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { SalesOrderApiHelper } from '../../../api/SalesOrderApiHelper';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout';
import MyToolbar from '../../common/MyToolbar';
import NS1CustomerTable from './NS1CustomerTable';
import NS2CustomerMenuTable from './NS2CustomerMenuTable';
import NS3Confirm from './NS3Confirm';

const breadcrumbs = [
  { url: '/customer/sales', name: 'Customer' },
  { url: '/customer/sales', name: 'Sales' },
  { url: '/customer/sales/new', name: 'New' },
]

export default function NewSalesOrderPage() {

  const { handleHttpError } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(0)
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  // For reorder use case
  useEffect(() => {
    if (location?.state?.salesOrder) {
      setSelectedCustomer(location.state.salesOrder.customer);
      setStep(1);
      if (location?.state?.salesOrder.sales_order_items) {
        const orderItems = location.state.salesOrder.sales_order_items;
        setSelectedProducts(orderItems.map(x => ({...x, key: Math.random() })));
      }
    }
  }, [location.state, setSelectedCustomer, setStep, setSelectedProducts])

  // Handles sales order creation
  function handleSubmitEvent() {
    const salesOrder = {
      customer_id: selectedCustomer.id,
      sales_order_status_id: 1,
      sales_order_items: selectedProducts.filter(x => x.product != null).map(x => ({ product_id: x.product.id, quantity: x.quantity })),
      has_gst: selectedCustomer.charged_under?.gst_rate ? 3 : 1,
      gst_rate: selectedCustomer.charged_under?.gst_rate || 0,
      charged_under_id: selectedCustomer.charged_under?.id,
    }

    // Copy details from reorder if any
    if (location?.state?.salesOrder) {
      const copy = location.state.salesOrder;
      salesOrder.charged_under_id = copy.charged_under_id;
      salesOrder.has_gst = copy.has_gst;
      salesOrder.gst_rate = copy.gst_rate;
      salesOrder.payment_term_id = copy.payment_term_id;
      salesOrder.payment_method_id = copy.payment_method_id;
      salesOrder.show_gst = copy.show_gst;
      salesOrder.charged_under_id = copy.charged_under?.id;
    }

    SalesOrderApiHelper.create(salesOrder)
      .then(result => {
        message.success(`Sales Order with ID ${result.id} successfully created!`);
        navigate(`./../${result.id}`);
      })
      .catch(handleHttpError);

  }

  return (
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Create Sales Order">

      <MyCard>
        <Steps current={step}>
            <Steps.Step title="Customer" description="Select a customer" />
            <Steps.Step title="Select Items" description="Create your order" />
            <Steps.Step title="Review" description="Confirm your order" />
          </Steps>
      </MyCard>

      { step === 0 &&
        <MyCard>
          <NS1CustomerTable selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} setSelectedProducts={setSelectedProducts} />
          <MyToolbar style={{ marginTop: 15 }}>
            <Button type="primary" onClick={() => setStep(step+1)} disabled={selectedCustomer.id == null}>Next</Button>
          </MyToolbar>
        </MyCard>
      }
      { step === 1 &&
        <MyCard>
          <NS2CustomerMenuTable 
            selectedCustomer={selectedCustomer} 
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
          <NS3Confirm 
            selectedCustomer={selectedCustomer} 
            selectedProducts={selectedProducts} 
            step={step} setStep={setStep} 
            handleSubmitEvent={handleSubmitEvent} 
          />
        </>
      }

    </MyLayout>
  )
}
