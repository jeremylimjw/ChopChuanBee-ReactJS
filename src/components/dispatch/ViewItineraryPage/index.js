import { UserAddOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, message, Popconfirm, Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { DeliveryApiHelper } from '../../../api/DeliveryApiHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import MyLayout from '../../common/MyLayout';
import I1Details from './I1Details';
import I2Driver from './I2Driver';
import I3DeliveryOrders from './I3DeliveryOrders';

export default function ViewItineraryPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { handleHttpError, hasWriteAccessTo } = useApp();

  const [itinerary, setItinerary] = useState()
  const [loading, setLoading] = useState(false);

  const breadcrumbs = [
    { url: "/dispatch/itinerarys", name: "Dispatch" },
    { url: "/dispatch/itinerarys", name: "Itineraries" },
    { url: `/dispatch/itinerarys/${itinerary?.id}`, name: "View" },
  ]

  useEffect(() => {
    DeliveryApiHelper.getItinerarys({ id: id })
      .then(result => {
        if (result.length === 0) {
          navigate('./../');
          return;
        }
        setItinerary(result[0]);
      })
      .catch(handleHttpError)
  }, [id, handleHttpError, navigate]);

  function updateItinerary() {
    console.log(itinerary);

    setLoading(true);
    DeliveryApiHelper.updateItinerary(itinerary)
      .then(() => {
        message.success('Itinerary successfully updated!');
        setLoading(false);
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false));
  }

  function handleDelete() {
      setLoading(true);
      DeliveryApiHelper.deleteItinerary(itinerary.id)
        .then(() => {
          setLoading(false);
          message.success(`Itinerary successfully deleted!`);
          navigate('./../');
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
  }

  function renderDeleteButton() {
    if (!hasWriteAccessTo(View.DISPATCH.name)) return <></>

    return (
      <Popconfirm title="Confirm delete?" placement='leftTop' onConfirm={handleDelete} disabled={loading}>
        <Button type="danger" loading={loading} icon={<UserAddOutlined />} style={{ width: 120 }}>Delete</Button>
      </Popconfirm>
    )
  }

  return (
    <>
    {itinerary != null && 
      <MyLayout breadcrumbs={breadcrumbs} bannerTitle="View Itinerary" bannerRight={renderDeleteButton()}>
        
        <Row>
          <Col>
            <I1Details itinerary={itinerary} />
          </Col>

          <Col>
            <I2Driver itinerary={itinerary} />
          </Col>
        </Row>
        
        <I3DeliveryOrders itinerary={itinerary} setItinerary={setItinerary} updateItinerary={updateItinerary} />
      
      </MyLayout>
    }
    </>
  )
}
