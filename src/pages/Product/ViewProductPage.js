import { Row, Col } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { ProductApiHelper } from '../../api/product';
import P1Form from '../../components/inventoryModule/ViewProduct/P1Form';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import { useApp } from '../../providers/AppProvider';

export default function ViewProductPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError } = useApp();
  
    const [product, setProduct] = useState(null)

    const breadcrumbs = [
      { url: '/products', name: 'Products' },
      { url: `/products/${product?.name}`, name: product?.name },
    ]
  
    useEffect(() => {
      ProductApiHelper.getById(id)
        .then(result => {
          if (result.length === 0) {
            navigate('../');
            return;
          }
          setProduct(result[0]);
        })
        .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);

    return (
        <>
        {product != null && 
          <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${product.name}`}>
            
            <Row>
              <Col xl={10} xs={24}>
  
                <MyCard>
                    <P1Form product={product} setProduct={setProduct} />
                </MyCard>
              </Col>
  
              <Col xl={14} xs={24}>
                <MyCard title="Quick View">
                </MyCard>
  
                <MyCard>
                </MyCard>
              </Col>
            </Row>
  
            <MyCard>
            </MyCard>
          
          </MyLayout>
        }
        </>
    )
}
