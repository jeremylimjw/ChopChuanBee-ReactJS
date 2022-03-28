import { Button, Divider, Input, InputNumber, Modal, Typography } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { generatePdf } from '../../utilities/Report/ReportExporter'
import { purchaseOrderTemplate } from '../../utilities/Report/Templates/PurchaseOrderTemplate'
import { salesInvoiceTemplate } from '../../utilities/Report/Templates/SalesInvoiceTemplate'
import { deliveryInstructionsTemplate } from '../../utilities/Report/Templates/DeliveryInstructionsTemplate'

import { useNavigate } from 'react-router'
import MyLayout from '../../components/common/MyLayout'
import MyCard from '../../components/common/MyCard'
import { balanceSheetTemplate } from '../../utilities/Report/Templates/BalanceSheetTemplate'
import { profitLossStatement } from '../../utilities/Report/Templates/ProfitLossStatementTemplate'
import { deliverySticker } from '../../utilities/Report/Templates/DeliverySticker'


const ReportGenerationPage = (props) => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const navigate = useNavigate()
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
    "id": 1,
    "gst_rate": "0",
    "offset": "0",
    "has_gst": 1,
    "show_gst": true,
    "remarks": null,
    "has_delivery": false,
    "delivery_address": "504 Roberts Land Suite 684",
    "delivery_postal_code": "108914",
    "delivery_remarks": null,
    "closed_on": null,
    "created_at": "2022-03-08T09:02:25.843Z",
    "updated_at": "2022-03-08T09:02:36.188Z",
    "payment_term_id": 1,
    "payment_method_id": 1,
    "customer_id": "9e7d7d2a-eb12-48b9-b036-2e78bad07817",
    "charged_under_id": "3ff48135-8824-4d9a-ad63-19a23dd1b8c9",
    "sales_order_status_id": 1,
    "sales_order_items": [
      {
        "id": "82370908-c34d-4806-bb03-b12d05d21bae",
        "quantity": 50,
        "unit_price": "100",
        "created_at": "2022-03-08T09:02:25.856Z",
        "updated_at": "2022-03-08T09:02:25.856Z",
        "sales_order_id": 1,
        "product_id": "cd2aefb7-d5d8-413c-a575-3aafa2152ca1",
        "inventory_movements": [],
        "product": {
          "id": "cd2aefb7-d5d8-413c-a575-3aafa2152ca1",
          "name": "汪婷 Perdigão Frozen Whole Chicken Griller 900g",
          "min_inventory_level": 130,
          "deactivated_date": null,
          "description": null,
          "unit": "900g",
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

  const balSheet = {
    "account_payable": "0",
    "account_receivable": "200",
    "bonds_payable": "5",
    "building": "5",
    "cash_others": "300",
    "cash_sales_of_goods": "850",
    "created_at": "2022-03-11T05:00:04.502Z",
    "deleted_date": null,
    "end_date": "2022-03-01T05:00:03.332Z",
    "equipments": "5",
    "goodwill": "5",
    "id": "5a909bb9-7ab2-49c9-8a9c-76ed2f65be77",
    "interest_payable": "5",
    "inventory": "5",
    "land": "5",
    "less_accumulated_depreciation_building": "10",
    "less_accumulated_depreciation_equipments": "10",
    "less_accumulated_depreciation_land": "20",
    "less_withdrawal": "5",
    "name": "Quarter 1 Year 2022",
    "notes_payable": "1355",
    "other_current_asset_1": "5",
    "other_current_asset_2": "5",
    "other_current_liability_1": "5",
    "other_current_liability_2": "5",
    "other_equity_1": "5",
    "other_equity_2": "5",
    "other_intangible_asset_1": "5",
    "other_intangible_asset_2": "5",
    "other_non_current_asset_1": "5",
    "other_non_current_asset_2": "5",
    "other_non_current_liability_1": "5",
    "other_non_current_liability_2": "5",
    "prepaid_insurance": "5",
    "prepaid_rent": "5",
    "remarks": "test",
    "rental_payable": "5",
    "retained_earning": "5",
    "salary_payable": "5",
    "share_capital": "5",
    "supplies": "5",
    "taxes_payable": "5",
    "trade_names": "5",
    "updated_at": "2022-03-11T10:09:52.427Z",
    "warranty_payable": "5",
    "totalCurrentAssets": "41315.6",
    "totalCurrentLiabilities": "-1695.3",
    "totalEquities": "0",
    "totalIntangibleAssets": "0",
    "totalLiabilities": "-1695.3",
    "totalLiabilitiesAndEquities": "-1695.3",
    "totalNonCurrentAssets": "0",
    "totalNonCurrentLiabilities": "0",
  }

  const pnlStatement = {
    advertising_expense: 0,
    commissions_expense: 0,
    created_at: "2022-03-17T02:02:16.746Z",
    damaged_inventory: 0,
    deleted_date: null,
    end_date: "2022-04-01T02:02:14.000Z",
    gain_on_sale_of_asset: 0,
    id: "2a8ddd44-d4ef-4cbc-9c0f-98fae6b275c5",
    interest_expense: 0,
    less_cost_of_goods_sold: -30,
    less_customer_sales_return: 0,
    loss_on_sale_of_asset: 0,
    name: "Quarter 1 Year 2022",
    other_expense_1: 0,
    other_expense_2: 0,
    other_income_1: 0,
    other_income_2: 0,
    profit: 1030,
    remarks: null,
    rental_expense: 0,
    revenue: 1000,
    salary_expense: 0,
    start_date: "2022-03-01T02:02:14.000Z",
    tax_expense: 0,
    totalExpenses: 0,
    totalRevenue: 1030,
    updated_at: "2022-03-17T12:43:29.500Z",
    warranty_expense: 0
  }

  const handleGenerate = (doc) => {
    generatePdf(doc)
  }

  const handleGenerateQR = (data) => {
    setModalVisibility(true)
  }

  return (
    <MyLayout
      bannerTitle='Report Generators'
    >
      <MyCard
        title='Purchase Order Generator'
      >
        <Button
          onClick={() => handleGenerate(balanceSheetTemplate(balSheet))}
        >
          Balance Sheet
        </Button>
        <Button
          onClick={() => handleGenerate(profitLossStatement(pnlStatement))}
        >
          PNL Statement
        </Button>
      </MyCard>
      <MyCard>
        <Button
          onClick={() => handleGenerate(deliverySticker())}
        >Generate Stickers</Button>
      </MyCard>


    </MyLayout>
  )
}

export default ReportGenerationPage