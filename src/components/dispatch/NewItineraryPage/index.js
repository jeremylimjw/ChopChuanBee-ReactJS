import { message, Steps } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { DeliveryApiHelper } from '../../../api/DeliveryApiHelper';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout';
import NI1Form from './NI1Form';
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

  const [step, setStep] = useState(0)
  const [itinerary, setItinerary] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Handles sales order creation
  function handleSubmitEvent() {
    const newItinerary = {
      ...itinerary,
      start_time:  itinerary.start_time.toDate(),
      driver_id: selectedEmployee.id,
      delivery_orders: selectedOrders, // sequence is created by the backend based on the sent order
    }

    DeliveryApiHelper.createItinerary(newItinerary)
      .then(result => {
        message.success(`Itinerary successfully created!`);
        navigate(`./../${result.id}`);
      })
      .catch(handleHttpError);

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
        <NI1Form 
          itinerary={itinerary}
          setItinerary={setItinerary}
          selectedEmployee={selectedEmployee} 
          setSelectedEmployee={setSelectedEmployee} 
          step={step} 
          setStep={setStep} 
        />
      }
      { step === 1 &&
        <NI2OrdersTable 
          itinerary={itinerary}
          setItinerary={setItinerary}
          selectedOrders={selectedOrders} 
          setSelectedOrders={setSelectedOrders} 
          step={step} 
          setStep={setStep} 
        />
      }

      { step === 2 && 
        <>
          <NI3Confirm 
            itinerary={itinerary}
            selectedEmployee={selectedEmployee} 
            selectedOrders={selectedOrders} 
            setSelectedOrders={setSelectedOrders} 
            step={step} setStep={setStep} 
            handleSubmitEvent={handleSubmitEvent} 
          />
        </>
      }

    </MyLayout>
  )
}
