import { Form, Tabs } from "antd";
import React from "react";
import MyLayout from "../../common/MyLayout";
import moment from "moment";
import InventoryReturnsCard from "./InventoryReturnsTab/InventoryReturnsCard";
import InventoryReturnsData from "./InventoryReturnsTab/InventoryReturnsData";

export default function InventoryDashboard() {
  const { TabPane } = Tabs;
  const oneYearAgo = moment().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
  const currDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
  const currTime = moment().toDate();

  // const [form] = Form.useForm();
  // function onValuesChange(_, form) {
  //   let start_date, end_date;
  //   if (form.date && form.date[0] && form.date[1]) {
  //     start_date = moment(form.date[0])
  //       .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  //       .toDate();
  //     end_date = moment(form.date[1])
  //       .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
  //       .toDate();
  //   }
  // }

  // function resetForm() {
  //   form.resetFields();
  //   onValuesChange(null, form.getFieldsValue());
  // }

  return (
    <MyLayout bannerTitle='Inventory Dashboard'>
        <Tabs defaultActiveKey="1" type="card" style={{margin:'24px'}}>
            <TabPane tab="Inventory Returns" key="1">
                <InventoryReturnsCard currTime={currTime}/>
                <InventoryReturnsData currDate={currDate} oneYearAgo={oneYearAgo} />
            </TabPane>

            <TabPane tab="Sales Returns" key="2">
                
            </TabPane>

            <TabPane tab="Damaged Goods" key="3">
                
            </TabPane>
        </Tabs>
    </MyLayout>

    // <MyLayout bannerTitle="Inventory Dashboard">
    //   <MyCard>
    //     <MyToolbar title="Top 10 Products">
    //       <Form
    //         form={form}
    //         onValuesChange={debounce(onValuesChange, 300)}
    //         layout="inline"
    //         autoComplete="off"
    //       >
    //         <Form.Item name="date">
    //           <DatePicker.RangePicker />
    //         </Form.Item>

    //         <Button onClick={resetForm}>Reset</Button>
    //       </Form>
    //     </MyToolbar>

    //     <I1InventoryTopChart />
    //   </MyCard>

    //   <MyCard title="Product Analytics">
    //     <I2InventoryAnalyticsTable />
    //   </MyCard>
    // </MyLayout>
  );
}
