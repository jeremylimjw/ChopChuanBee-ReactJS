import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { PurchaseOrderApiHelper } from '../api/purchaseOrder';
import { PurchaseOrder } from '../models/PurchaseOrder';
import { useApp } from '../providers/AppProvider';

export default function Test() {

    const { handleHttpError } = useApp();
    const [purchaseOrder, setPurchaseOrder] = useState([])

    useEffect(() => {
        PurchaseOrderApiHelper.getAll()
            .then(results => {
                const newPurchaseOrder = new PurchaseOrder(results[0]);
                setPurchaseOrder(newPurchaseOrder)
            })
            .catch(handleHttpError)
    }, [handleHttpError]);

    function test() {
        setPurchaseOrder({ ...purchaseOrder, id: 123123123132 })
    }

    return (
        <>
        <Button onClick={test}>Test</Button>
        <pre>
            { JSON.stringify(purchaseOrder, null, 2) }
        </pre>
        </>
    )
}

