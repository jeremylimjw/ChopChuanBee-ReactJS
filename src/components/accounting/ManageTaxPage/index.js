import React, { useEffect, useState } from "react";
import { Form, Typography, Input, DatePicker, Divider, Modal, message, Radio, Button } from "antd";
import { useApp } from "../../../providers/AppProvider";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import { AccountingAPIHelper } from "../../../api/AccountingAPIHelper";
import { REQUIRED } from "../../../utilities/form";

const breadcrumbs = [
    { url: "/accounting/Taxes", name: "Accounting" },    
    { url: "/accounting/Taxes", name: "Taxes" },
];

export default function ManageTaxPage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const onFinish = () => {

    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Taxes">
            <MyCard title="Create A Tax Statement">
                <Form {...layout} form={form} autoComplete="off" labelAlign="left">
                    <Form.Item
                        rules={[REQUIRED]}
                        label="Type of Tax"
                        name="type"
                    >
                        <Radio.Group>
                            <Radio value={"input"}>Input Tax</Radio>
                            <Radio value={"output"}>Input Tax</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        rules={[REQUIRED]}
                        label="Start Date"
                        name="start_date"
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        rules={[REQUIRED]}
                        label="End Date"
                        name="end_date"
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        rules={[REQUIRED]} 
                        label="Company"
                        name="company"
                    >
                        <Radio.Group>
                            <Radio value={"CCB"}>CCB</Radio>
                            <Radio value={"CBFS"}>CBFS</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} style={{textAlign:'right'}}>
                        <Button type="primary" onClick={onFinish} loading={loading} style={{ width: 85 }}>Create</Button>
                    </Form.Item>
                </Form>
            </MyCard>
        </MyLayout>
    );
}