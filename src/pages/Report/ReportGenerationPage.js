import { Button } from 'antd'
import React from 'react'
import MyCard from '../../components/layout/MyCard'
import MyLayout from '../../components/layout/MyLayout'
import { purchaseOrderTemplate } from '../../utilities/Report/Templates/PurchaseOrderTemplate'
import { PDFTools } from '../../utilities/Report/PDFTools'
import { generatePdf } from '../../utilities/Report/ReportExporter'

const ReportGenerationPage = () => {

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
                    onClick={() => handleGenerate(purchaseOrderTemplate())}
                >Generate PO</Button>
            </MyCard>
        </MyLayout>
    )
}

export default ReportGenerationPage