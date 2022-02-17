import { Row, Col } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { CustomerApiHelper } from '../../api/customer';
import C1Form from '../../components/customerModule/ViewCustomer/C1Form';
import C2Menu from '../../components/customerModule/ViewCustomer/C2Menu';
import C3AccountReceivable from '../../components/customerModule/ViewCustomer/C3AccountReceivable';
import C4History from '../../components/customerModule/ViewCustomer/C4History';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import { useApp } from '../../providers/AppProvider';

export default function ViewCustomerPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError } = useApp();
  
    const [customer, setCustomer] = useState(null)

    const breadcrumbs = [
      { url: '/customers', name: 'Customers' },
      { url: `/customers/${customer?.company_name}`, name: customer?.company_name },
    ]
  
    useEffect(() => {
      CustomerApiHelper.getById(id)
        .then(result => {
          if (result.length === 0) {
            navigate('../');
            return;
          }
          setCustomer(result[0]);
        })
        .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);

    return (
      <>
      {customer != null && 
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`Customer ${customer.company_name}`}>
          
          <Row>
            <Col xl={12} xs={24}>

              <MyCard>
                  <C1Form customer={customer} setCustomer={setCustomer} />
              </MyCard>
            </Col>

            <Col xl={12} xs={24}>
              <MyCard title="Quick View">
                Customer owes you $0.00.
              </MyCard>

              <MyCard>
                <C2Menu customer={customer} />
              </MyCard>
            </Col>
          </Row>

          <MyCard style={{ marginTop: 0 }}>
            <C3AccountReceivable />
          </MyCard>

          <MyCard>
            <C4History />
          </MyCard>
        
        </MyLayout>
      }
      </>
    )
}
