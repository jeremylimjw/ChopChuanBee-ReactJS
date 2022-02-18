import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Popconfirm, Button, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ProductApiHelper } from '../../api/product';
import P1Form from '../../components/inventoryModule/ViewProduct/P1Form';
import P2PriceTable from '../../components/inventoryModule/ViewProduct/P2PriceTable';
import P3InventoryTable from '../../components/inventoryModule/ViewProduct/P3InventoryTable';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import { useApp } from '../../providers/AppProvider';

export default function ViewProductPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError } = useApp();
  
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false);

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

    function handleDeactivate() {
      setLoading(true);
      const promise = product.deactivated_date == null ? ProductApiHelper.deactivate(product.id) : ProductApiHelper.activate(product.id);
      promise.then(newFields => {
          setLoading(false);
          setProduct({...product, ...newFields });
          message.success(`Product successfully ${product.deactivated_date == null ? 'deactivated' : 'activated' }!`);
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false));
    }

    function renderDeactivateButton() {
        return (
            <>
                { product.deactivated_date == null ? 
                    <Popconfirm title="Confirm deactivate?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
                        <Button type="danger" loading={loading} icon={<UserDeleteOutlined />} style={{ width: 120 }}>Deactivate</Button>
                    </Popconfirm>
                    :
                    <Popconfirm title="Confirm activate?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
                        <Button type="primary" loading={loading} icon={<UserAddOutlined />} style={{ width: 120 }}>Activate</Button>
                    </Popconfirm>
                }
            </>
        )
    }

    return (
        <>
        {product != null && 
            <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${product.name} ${ product.deactivated_date == null ? '' : '(Deactivated)' }`} bannerRight={renderDeactivateButton()}>
            
            <Row>
              <Col xl={10} xs={24}>
                <MyCard title="Summary" style={{ position: 'relative' }}>
                  <Typography.Title level={4} style={{ display: 'inline-block'}}>0</Typography.Title> units in stock
                  <span style={{ position: 'absolute', bottom: 34, right: 30 }}>
                    <Link to="./">Reorder based on lowest price</Link>
                  </span>
                </MyCard>
  
                <MyCard>
                    <P1Form product={product} setProduct={setProduct} />
                </MyCard>
              </Col>
  
              <Col xl={14} xs={24}>
  
                <MyCard>
                  <P2PriceTable />
                </MyCard>
              </Col>
            </Row>
  
            <MyCard>
              <P3InventoryTable />
            </MyCard>
          
          </MyLayout>
        }
        </>
    )
}
