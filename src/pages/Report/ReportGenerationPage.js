import { Button } from 'antd'
import React from 'react'
import MyCard from '../../components/layout/MyCard'
import MyLayout from '../../components/layout/MyLayout'
import { purchaseOrderTemplate } from '../../utilities/Report/Templates/PurchaseOrderTemplate'
import { generatePdf } from '../../utilities/Report/ReportExporter'
import moment from 'moment'

const ReportGenerationPage = (props) => {
    const poData = {
        "id": 1,
        "gst_rate": "0",
        "offset": "0",
        "has_gst": null,
        "supplier_invoice_id": null,
        "remarks": null,
        "closed_on": null,
        "created_at": "2022-03-03T14:43:26.587Z",
        "updated_at": "2022-03-03T14:43:26.587Z",
        "payment_term_id": null,
        "purchase_order_status_id": 1,
        "supplier_id": "3f48ca11-84ce-4109-ba5c-32783a24626c",
        "charged_under_id": null,
        "purchase_order_items": [
            {
                "id": "a1f65d51-5293-4388-b3f0-62bcefb8b195",
                "unit_cost": null,
                "quantity": 1,
                "created_at": "2022-03-03T14:43:26.616Z",
                "updated_at": "2022-03-03T14:43:26.616Z",
                "purchase_order_id": 1,
                "product_id": "838ee56f-15cf-45ec-a74e-b6b99e8de4a7",
                "inventory_movements": [],
                "product": {
                    "id": "838ee56f-15cf-45ec-a74e-b6b99e8de4a7",
                    "name": "李琳 Pork Spare Ribs Cubes 1000g",
                    "min_inventory_level": 240,
                    "deactivated_date": null,
                    "description": null,
                    "unit": "1000g",
                    "created_at": "2022-03-03T14:39:38.255Z",
                    "updated_at": "2022-03-03T14:39:38.255Z"
                }
            }
        ],
        "payments": [],
        "supplier": {
            "id": "3f48ca11-84ce-4109-ba5c-32783a24626c",
            "company_name": "王静 Reed, Valentine and Howard",
            "s1_name": "George Brown",
            "s1_phone_number": "97664439",
            "address": "69028 Kennedy Inlet",
            "postal_code": "482970",
            "description": "或者法律是一人员进入到了类型目前.完成业务当前只要进行美国一切.",
            "company_email": "georgebrown@yahoo.com",
            "deactivated_date": null,
            "s2_name": null,
            "s2_phone_number": null,
            "created_at": "2022-03-03T14:39:38.260Z",
            "updated_at": "2022-03-03T14:39:38.260Z"
        },
        "charged_under": null,
        "payment_method_id": 1
    }
    // const dummyPurchaseOrderData = {
    //     purchaseOrderData: {
    //         po_num: 'PO_1234',
    //         po_date: moment(new Date()).format('ll')
    //     },
    //     companyData: {
    //         addr: 'Blk 123 Singapore Street, Singapore 123456',
    //         contactNum: '+65 61234567 / 91234567 (Mobile)',
    //         bizRegNum: 'BIZ_REG_0012345678',
    //         gstRegNum: 'GST_REG_0012345678'
    //     },
    //     vendorData: {
    //         vendorName: 'Giant Supermarket',
    //         contactPerson: 'Adam Tan',
    //         contactNum: '80001000 (HP)'
    //     },
    //     purchaseOrderList: {
    //         headers: ['No.', 'Item Name', 'Quantity', 'Unit'],
    //         data: [[1, 'Ketchup', '100', 'Bottles'], [2, 'Ikan Bilis', '5', 'kg']],
    //         widths: ['5%', '*', '20%', '20%']
    //     }
    // }
    const blankPOData = {
        purchaseOrderData: {
            po_num: 'PO_1234',
            po_date: moment(new Date()).format('ll')
        },
        companyData: {
            addr: undefined,
            contactNum: undefined,
            bizRegNum: '',
            gstRegNum: ''
        },
        vendorData: {
            vendorName: '',
            contactPerson: '',
            contactNum: ''
        },
        purchaseOrderList: {
            headers: ['No.', 'Item Name', 'Quantity', 'Unit'],
            data: [[1, 'Ketchup', '100', 'Bottles'], [2, 'Ikan Bilis', '5', 'kg']],
            widths: ['5%', '*', '20%', '20%']
        }
    }

    const handleGenerate = (doc) => {
        generatePdf(doc)
    }

    return (
        <MyLayout
            bannerTitle='Report Generators'
        >
            <MyCard
                title='Purchase Order Generator'
            >
                <Button
                    onClick={() => handleGenerate(purchaseOrderTemplate(poData))}
                >Generate PO</Button>
                <Button
                    style={{ marginLeft: '20px' }}
                    onClick={() => handleGenerate(purchaseOrderTemplate(blankPOData))}
                >Generate PO Blank</Button>
            </MyCard>
        </MyLayout>
    )
}

export default ReportGenerationPage