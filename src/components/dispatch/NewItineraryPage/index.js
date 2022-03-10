import { Button, message, Steps } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { SalesOrderApiHelper } from '../../../api/SalesOrderApiHelper';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout';
import MyToolbar from '../../common/MyToolbar';
import NI1DriverTable from './NI1DriverTable';
import NI2OrdersTable from './NI2OrdersTable';
import NI3Confirm from './NI3Confirm';

const breadcrumbs = [
  { url: "/dispatch/itinerarys", name: "Dispatch" },
  { url: "/dispatch/itinerarys", name: "Itineraries" },
  { url: '/dispatch/itinerarys/new', name: 'New' },
]

export default function NewItineraryPage() {

  const { handleHttpError } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(0)
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Handles sales order creation
  function handleSubmitEvent() {
    // const salesOrder = {
    //   customer_id: selectedEmployee.id,
    //   sales_order_status_id: 1,
    //   sales_order_items: selectedOrders.filter(x => x.product != null).map(x => ({ product_id: x.product.id, quantity: x.quantity })),
    //   has_gst: selectedEmployee.charged_under?.gst_rate ? 3 : 1,
    //   gst_rate: selectedEmployee.charged_under?.gst_rate || 0,
    //   charged_under_id: selectedEmployee.charged_under?.id,
    //   show_gst: selectedEmployee.gst_show,
    //   has_delivery: false,
    //   delivery_address: selectedEmployee.address,
    //   delivery_postal_code: selectedEmployee.postal_code,
    // }

    // SalesOrderApiHelper.create(salesOrder)
    //   .then(result => {
    //     message.success(`Sales Order with ID ${result.id} successfully created!`);
    //     navigate(`./../${result.id}`);
    //   })
    //   .catch(handleHttpError);

  }

  return (
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Create Itinerary">

      <MyCard>
        <Steps current={step}>
            <Steps.Step title="Driver" description="Select a driver" />
            <Steps.Step title="Select Orders" description="Assign delivery orders" />
            <Steps.Step title="Review" description="Confirm new itinerary" />
          </Steps>
      </MyCard>

      { step === 0 &&
        <MyCard>
          <NI1DriverTable selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} />
          <MyToolbar style={{ marginTop: 15 }}>
            <Button type="primary" onClick={() => setStep(step+1)} disabled={selectedEmployee.id == null}>Next</Button>
          </MyToolbar>
        </MyCard>
      }
      { step === 1 &&
        <MyCard>
          <NI2OrdersTable 
            selectedEmployee={selectedEmployee} 
            selectedOrders={selectedOrders} 
            setSelectedOrders={setSelectedOrders} 
          />

          <MyToolbar style={{ marginTop: 15 }}>
            <Button onClick={() => setStep(step-1)}>Back</Button>
            <Button type="primary" onClick={() => setStep(step+1)} disabled={selectedOrders.length === 0}>Optimize</Button>
          </MyToolbar>
        </MyCard>
      }

      { step === 2 && 
        <>
          <NI3Confirm 
            selectedEmployee={selectedEmployee} 
            selectedOrders={selectedOrders} 
            step={step} setStep={setStep} 
            handleSubmitEvent={handleSubmitEvent} 
          />
        </>
      }

    </MyLayout>
  )
}
