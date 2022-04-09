import { CopyOutlined } from '@ant-design/icons/lib/icons'
import { Button, message, Popconfirm } from 'antd'
import React from 'react'
import { PurchaseOrderApiHelper } from '../../../api/PurchaseOrderApiHelper';
import { POStatus } from '../../../enums/PurchaseOrderStatus';
import { PurchaseOrder } from '../../../models/PurchaseOrder';
import { useApp } from '../../../providers/AppProvider';
import { parseDate } from '../../../utilities/datetime'

export default function CopyAsTextButton({ purchaseOrder, setPurchaseOrder, loading, setLoading }) {

    const { handleHttpError } = useApp();

    function copyAsText() {
        if (purchaseOrder.charged_under == null) {
            message.error('Please select a Charged Under first!');
            return;
        }

        const text = `
        To: ${purchaseOrder.supplier.company_name}, ${purchaseOrder.supplier.s1_name}, ${purchaseOrder.supplier.s1_phone_number}

        Purchase Order from ${purchaseOrder.charged_under?.name || '-'}
        PO Number: ${purchaseOrder.id}
        PO Date: ${parseDate(purchaseOrder.created_at)}
        Delivery to: ${purchaseOrder.charged_under?.shipping_address || '-'}
        Contact No: ${purchaseOrder.charged_under?.contact_number || '-'}
        Business Reg No: ${purchaseOrder.charged_under?.registration_number || '-'}

        Items Ordered:
        ${purchaseOrder.purchase_order_items.reduce((prev, current) => prev += `${current.product.name}, quantity: ${current.quantity}, unit: ${current.product.unit}\n`, '')}
        `.replace(/  +/g, '');
        
        navigator.clipboard.writeText(text)

        message.success('Successfully copied to clipboard!');
    }

    function updateOrderStatus() {
        const newPurchaseOrder = {...purchaseOrder, purchase_order_status_id: POStatus.SENT_TEXT.id };

        setLoading(true);
        PurchaseOrderApiHelper.updateStatusOnly(newPurchaseOrder)
            .then(() => {
                message.success("Purchase order successfully updated!")
                setPurchaseOrder(new PurchaseOrder(newPurchaseOrder));
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    return (
        <>
        {purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL) ?
            <Popconfirm title="Mark order as Sent (Text)?" onConfirm={updateOrderStatus} disabled={loading} onClick={copyAsText}>
                <Button icon={<CopyOutlined />} disabled={loading}>Copy as Text</Button>
            </Popconfirm>
            :
            <Button icon={<CopyOutlined />} disabled={loading} onClick={copyAsText}>Copy as Text</Button>
        }
        </>
    )
}
