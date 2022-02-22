import { Col, Row, Form, DatePicker, Button } from "antd";
import React from "react";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import MyToolbar from "../../common/MyToolbar";
import moment from "moment";
import debounce from "lodash.debounce";
import P1ProductPricingChart from "./P1ProductPricingChart";
import P2ProductUnitSoldChart from "./P2ProductUnitSoldChart";
import P3ProductTurnoverChart from "./P3ProductTurnoverChart";
import P4ProductInventoryWastageChart from "./P4ProductInventoryWastageChart";

export default function ProductDashboard() {
  const breadcrumbs = [
    { url: "/analytics/inventoryDashboard", name: "Inventory Dashboard" },
    { url: "/analytics/productDashboard", name: "Product Dashboard" },
  ];

  const [pricingForm] = Form.useForm();
  const [numUnitsForm] = Form.useForm();
  const [turnoverForm] = Form.useForm();
  const [inventoryWastageForm] = Form.useForm();

  function onValuesChange(_, form) {
    let start_date, end_date;
    if (form.date && form.date[0] && form.date[1]) {
      start_date = moment(form.date[0])
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toDate();
      end_date = moment(form.date[1])
        .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
        .toDate();
    }
  }

  function resetForm(form) {
    form.resetFields();
    onValuesChange(null, form.getFieldsValue());
  }

  return (
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Product Dashboard">
      <Row>
        <Col xl={12} xs={24}>
          <MyCard>
            <MyToolbar title="Pricing Trend">
              <Form
                form={pricingForm}
                onValuesChange={debounce(onValuesChange, 300)}
                layout="inline"
                autoComplete="off"
              >
                <Form.Item name="date">
                  <DatePicker.RangePicker />
                </Form.Item>

                <Button onClick={resetForm(pricingForm)}>Reset</Button>
              </Form>
            </MyToolbar>
            <P1ProductPricingChart />
          </MyCard>
        </Col>

        <Col xl={12} xs={24}>
          <MyCard>
            {/* TBC: Number of Units Sold vs Total Contribution? */}
            <MyToolbar title="Number of Units Sold">
              <Form
                form={numUnitsForm}
                onValuesChange={debounce(onValuesChange, 300)}
                layout="inline"
                autoComplete="off"
              >
                <Form.Item name="date">
                  <DatePicker.RangePicker />
                </Form.Item>

                <Button onClick={resetForm(numUnitsForm)}>Reset</Button>
              </Form>
            </MyToolbar>
            <P2ProductUnitSoldChart />
          </MyCard>
        </Col>
      </Row>

      <Row>
        <Col xl={12} xs={24}>
          <MyCard>
            <MyToolbar title="Turnover Rate">
              <Form
                form={turnoverForm}
                onValuesChange={debounce(onValuesChange, 300)}
                layout="inline"
                autoComplete="off"
              >
                <Form.Item name="date">
                  <DatePicker.RangePicker />
                </Form.Item>

                <Button onClick={resetForm(turnoverForm)}>Reset</Button>
              </Form>
            </MyToolbar>
            <P3ProductTurnoverChart />
          </MyCard>
        </Col>

        <Col xl={12} xs={24}>
          <MyCard>
            <MyToolbar title="Inventory Wastage">
              <Form
                form={inventoryWastageForm}
                onValuesChange={debounce(onValuesChange, 300)}
                layout="inline"
                autoComplete="off"
              >
                <Form.Item name="date">
                  <DatePicker.RangePicker />
                </Form.Item>

                <Button onClick={resetForm(inventoryWastageForm)}>Reset</Button>
              </Form>
            </MyToolbar>
            <P4ProductInventoryWastageChart />
          </MyCard>
        </Col>
      </Row>
    </MyLayout>
  );
}
