import { Button, Table, Input, DatePicker, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import MyToolbar from "../../components/layout/MyToolbar";
import MyCard from "../../components/layout/MyCard";
import { AccountingAPIHelper } from "../../api/accounting";
import { useApp } from "../../providers/AppProvider";
import NewSOFPModal from "../../components/accountingModule/NewSOFPModal";
import MyLayout from "../../components/layout/MyLayout";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons/lib/icons";
import { Link } from "react-router-dom";
import { getActiveTag } from "../../enums/ActivationStatus";
import { sortByDate, sortByNumber, sortByString } from "../../utilities/sorters";
import { parseDate } from "../../utilities/datetime";
import debounce from "lodash.debounce";
import { View } from "../../enums/View";
import { showTotal } from '../../utilities/table';

const breadcrumbs = [
    { url: "/accounting/SOFP", name: "Statement of Financial Position" },
];

export default function SOFPPage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [SOFP, setSOFPs] = useState([]);

    useEffect(() => {
        setLoading(true);
        AccountingAPIHelper.getAllSOFP()
          .then(results => {
            setSOFPs(results);
            setLoading(false);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])

    function onValuesChange() {

    }
    
    function resetForm() {

    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Statement of Financial Positions">
            <MyCard>
                <MyToolbar title="Statement of Financial Positions">
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name="name">
                            <Input placeholder='Search Title' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                        </Form.Item>
                        <Form.Item name="date">
                            <DatePicker.RangePicker />
                        </Form.Item>
                    </Form>
                </MyToolbar>
            </MyCard>
        </MyLayout>
    );
}