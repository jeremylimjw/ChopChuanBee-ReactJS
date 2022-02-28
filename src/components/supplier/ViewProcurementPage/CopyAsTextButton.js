import { CopyOutlined } from '@ant-design/icons/lib/icons'
import { Button, message } from 'antd'
import React from 'react'
import { parseDate } from '../../../utilities/datetime'

export default function CopyAsTextButton({ purchaseOrder, loading }) {

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
    }

    return (
        <Button icon={<CopyOutlined />} disabled={loading} onClick={copyAsText}>Copy as Text</Button>
    )
}
