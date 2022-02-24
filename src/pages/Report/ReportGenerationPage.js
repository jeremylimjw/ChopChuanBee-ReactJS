import { Button } from 'antd'
import React from 'react'
import MyCard from '../../components/layout/MyCard'
import MyLayout from '../../components/layout/MyLayout'
import { purchaseOrderTemplate } from '../../utilities/Report/Templates/PurchaseOrderTemplate'
import { PDFTools } from '../../utilities/Report/PDFTools'
import { generatePdf } from '../../utilities/Report/ReportExporter'
import moment from 'moment'

const ReportGenerationPage = () => {
    const dummyPurchaseOrderData = {
        purchaseOrderData: {
            po_num: 'PO_1234',
            po_date: moment(new Date()).format('ll')
        },
        companyData: {
            addr: 'Blk 123 Singapore Street, Singapore 123456',
            contactNum: '+65 61234567 / 91234567 (Mobile)',
            bizRegNum: '12345678_BIZREG',
            gstRegNum: '12345678_GST'
        },
        vendorData: {
            vendorName: 'Giant Supermarket',
            contactPerson: 'Adam Tan',
            contactNum: '80001000 (HP)'
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
                    onClick={() => handleGenerate(purchaseOrderTemplate(dummyPurchaseOrderData))}
                >Generate PO</Button>
            </MyCard>
        </MyLayout>
    )
}

export default ReportGenerationPage