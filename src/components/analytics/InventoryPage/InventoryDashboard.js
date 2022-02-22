import { Form, DatePicker, Button } from "antd";
import React from "react";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import MyToolbar from "../../common/MyToolbar";
import moment from "moment";
import debounce from "lodash.debounce";
import I1InventoryTopChart from "./I1InventoryTopChart";
import I2InventoryAnalyticsTable from "./I2InventoryAnalyticsTable";

export default function InventoryDashboard() {
  const [form] = Form.useForm();
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

  function resetForm() {
    form.resetFields();
    onValuesChange(null, form.getFieldsValue());
  }

  return (
    <MyLayout bannerTitle="Inventory Dashboard">
      <MyCard>
        <MyToolbar title="Top 10 Products">
          <Form
            form={form}
            onValuesChange={debounce(onValuesChange, 300)}
            layout="inline"
            autoComplete="off"
          >
            <Form.Item name="date">
              <DatePicker.RangePicker />
            </Form.Item>

            <Button onClick={resetForm}>Reset</Button>
          </Form>
        </MyToolbar>

        <I1InventoryTopChart />
      </MyCard>

      <MyCard title="Product Analytics">
        <I2InventoryAnalyticsTable />
      </MyCard>
    </MyLayout>
  );
}
