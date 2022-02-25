import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Popconfirm, Button, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { ProductApiHelper } from '../../../api/ProductApiHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout';
import P1Form from './P1Form';
import P2PriceTable from './P2PriceTable';
import P3InventoryTable from './P3InventoryTable';

export default function ViewProductPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { handleHttpError, hasWriteAccessTo } = useApp();

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false);

  const breadcrumbs = [
    { url: '/inventory/products', name: 'Inventory' },
    { url: '/inventory/products', name: 'Products' },
    { url: `/inventory/products/${product?.name}`, name: product?.name },
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
    if (!hasWriteAccessTo(View.INVENTORY.name)) return <></>

    return (
      <>
        { product.deactivated_date == null ? 
          <Popconfirm title="Confirm unlist?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
            <Button type="danger" loading={loading} icon={<UserDeleteOutlined />} style={{ width: 100 }}>Unlist</Button>
          </Popconfirm>
          :
          <Popconfirm title="Confirm relist?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
            <Button type="primary" loading={loading} icon={<UserAddOutlined />} style={{ width: 100 }}>Relist</Button>
          </Popconfirm>
        }
      </>
    )
  }

  return (
    <>
    {product != null && 
      <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${product.name} ${ product.deactivated_date == null ? '' : '(Unlisted)' }`} bannerRight={renderDeactivateButton()}>
        
        <Row>
          <Col xl={10} xs={24}>
            <MyCard title="Quick View">
              <Typography.Title level={4} style={{ display: 'inline-block'}}>0</Typography.Title> units in stock
            </MyCard>

            <MyCard>
                <P1Form product={product} setProduct={setProduct} />
            </MyCard>
          </Col>

          <Col xl={14} xs={24}>

            <MyCard>
              <P2PriceTable product={product} />
            </MyCard>
          </Col>
        </Row>

        <MyCard style={{ marginTop: 0 }}>
          <P3InventoryTable />
        </MyCard>
      
      </MyLayout>
    }
    </>
  )
}
