import { Button } from 'antd'
import React from 'react'
import MyCard from '../../components/layout/MyCard'
import MyLayout from '../../components/layout/MyLayout'
import { purchaseOrderTemplate } from '../../utilities/Report/Templates/PurchaseOrderTemplate'
import { salesInvoiceTemplate } from '../../utilities/Report/Templates/SalesInvoiceTemplate'
import { generatePdf } from '../../utilities/Report/ReportExporter'
import moment from 'moment'

const ReportGenerationPage = (props) => {
    const poData = {
        "id": 2,
        "gst_rate": "0",
        "offset": "0",
        "has_gst": 2,
        "supplier_invoice_id": "123456",
        "remarks": "21312",
        "closed_on": null,
        "created_at": "2022-03-09T11:33:11.158Z",
        "updated_at": "2022-03-09T11:33:26.058Z",
        "payment_term_id": 1,
        "purchase_order_status_id": 1,
        "supplier_id": "5aadad8c-cf63-4c7b-ae3d-655d83499372",
        "charged_under_id": "3ff48135-8824-4d9a-ad63-19a23dd1b8c9",
        "payment_method_id": 1,
        "purchase_order_items": [
            {
                "id": "ebe14b61-0c89-4e81-ab64-d12db9831d2b",
                "unit_cost": null,
                "quantity": 600,
                "created_at": "2022-03-09T11:33:11.161Z",
                "updated_at": "2022-03-09T11:33:11.161Z",
                "purchase_order_id": 2,
                "product_id": "05ffe78a-9c4e-4ddf-9fdb-bad444dfae8f",
                "inventory_movements": [],
                "product": {
                    "id": "05ffe78a-9c4e-4ddf-9fdb-bad444dfae8f",
                    "name": "向雪 Cheddar Cheese Sauce Muy Fresco 3kg",
                    "min_inventory_level": 70,
                    "deactivated_date": null,
                    "description": null,
                    "unit": "3kg",
                    "created_at": "2022-03-08T09:01:28.646Z",
                    "updated_at": "2022-03-08T09:01:28.646Z"
                }
            }
        ],
        "payments": [],
        "charged_under": {
            "id": "3ff48135-8824-4d9a-ad63-19a23dd1b8c9",
            "name": "Chuan Bee Food Stuff",
            "gst_rate": "0",
            "address": "Blk 14 Pasir Panjang Wholesale Centre #01-37, Singapore 110014 ",
            "shipping_address": "Blk 14 Pasir Panjang Wholesale Centre #01-37, Singapore 110014 ",
            "contact_number": "6779 0003 / 6776 6505 / 9776 3737 / 9826 1304 (Whatsapp)",
            "registration_number": "",
            "deactivated_date": null,
            "created_at": "2022-03-08T09:01:28.784Z",
            "updated_at": "2022-03-08T09:01:28.784Z"
        },
        "supplier": {
            "id": "5aadad8c-cf63-4c7b-ae3d-655d83499372",
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
            "created_at": "2022-03-08T09:01:28.669Z",
            "updated_at": "2022-03-08T09:01:28.669Z"
        }
    }

    const soData = {
        "id": 3,
        "gst_rate": "7",
        "offset": "0",
        "has_gst": 2,
        "show_gst": true,
        "remarks": "123123123",
        "has_delivery": true,
        "delivery_address": "504 Roberts Land Suite 684",
        "delivery_postal_code": "108914",
        "delivery_remarks": "123",
        "closed_on": null,
        "created_at": "2022-03-09T11:31:54.197Z",
        "updated_at": "2022-03-09T11:32:12.412Z",
        "payment_term_id": 2,
        "payment_method_id": 1,
        "customer_id": "9e7d7d2a-eb12-48b9-b036-2e78bad07817",
        "charged_under_id": "617bbc5e-85e6-42ce-90ef-5e553f9a4ffd",
        "sales_order_status_id": 1,
        "sales_order_items": [
            {
                "id": "92db294e-95f7-4389-a746-31599d69e435",
                "quantity": 1,
                "unit_price": null,
                "created_at": "2022-03-09T11:31:54.212Z",
                "updated_at": "2022-03-09T11:31:54.212Z",
                "sales_order_id": 3,
                "product_id": "05ffe78a-9c4e-4ddf-9fdb-bad444dfae8f",
                "inventory_movements": [],
                "product": {
                    "id": "05ffe78a-9c4e-4ddf-9fdb-bad444dfae8f",
                    "name": "向雪 Cheddar Cheese Sauce Muy Fresco 3kg",
                    "min_inventory_level": 70,
                    "deactivated_date": null,
                    "description": null,
                    "unit": "3kg",
                    "created_at": "2022-03-08T09:01:28.646Z",
                    "updated_at": "2022-03-08T09:01:28.646Z"
                }
            }
        ],
        "payments": [],
        "charged_under": {
            "id": "617bbc5e-85e6-42ce-90ef-5e553f9a4ffd",
            "name": "Chop Chuan Bee",
            "gst_rate": "7",
            "address": "Blk 14 Pasir Panjang Wholesale Centre #01-37, Singapore 110014 ",
            "shipping_address": "Blk 14 Pasir Panjang Wholesale Centre #01-37, Singapore 110014 ",
            "contact_number": "6779 0003 / 6776 6505 / 9776 3737 / 9826 1304 (Whatsapp)",
            "registration_number": "53138053W",
            "deactivated_date": null,
            "created_at": "2022-03-08T09:01:28.784Z",
            "updated_at": "2022-03-08T09:01:28.784Z"
        },
        "customer": {
            "id": "9e7d7d2a-eb12-48b9-b036-2e78bad07817",
            "company_name": "刘阳 Hull-Hernandez",
            "p1_name": "Christine Blair",
            "p1_phone_number": "84604377",
            "address": "504 Roberts Land Suite 684",
            "postal_code": "108914",
            "gst_show": true,
            "deactivated_date": null,
            "description": "包括有些标题过程.",
            "company_email": "christineblair@hotmail.com",
            "p2_name": null,
            "p2_phone_number": null,
            "created_at": "2022-03-08T09:01:28.650Z",
            "updated_at": "2022-03-08T09:01:28.650Z",
            "charged_under_id": null
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
                    onClick={() => handleGenerate(salesInvoiceTemplate(soData))}
                >Generate SO</Button>
            </MyCard>
        </MyLayout>
    )
}

export default ReportGenerationPage