import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { PurchaseOrderApiHelper } from '../api/purchaseOrder';
import MyLayout from '../components/layout/MyLayout'
import { useApp } from '../providers/AppProvider';

export default function ViewPurchaseOrderPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError } = useApp();
  
    const [purchaseOrder, setPurchaseOrder] = useState(null)

    const breadcrumbs = [
      { url: '/purchases/orders', name: 'Purchases' },
      { url: '/purchases/orders', name: 'Orders' },
      { url: `/purchases/orders/${purchaseOrder?.id}`, name: purchaseOrder?.id.toString().padStart(8, "0") },
    ]
  
    useEffect(() => {
      PurchaseOrderApiHelper.getById(id)
        .then(result => {
          if (result.length === 0) {
            navigate('../');
          } else {
            setPurchaseOrder(result[0]);
          }
        })
        .catch(handleHttpError)
    }, []);

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`Purchase Order ID ${purchaseOrder?.id.toString().padStart(8, "0")}`}>
        </MyLayout>
    )
}
