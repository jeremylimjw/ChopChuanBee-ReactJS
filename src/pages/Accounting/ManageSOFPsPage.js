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
import moment from 'moment';
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
    const [SOFPs, setSOFPs] = useState([]);

    useEffect(() => {
        setLoading(true);
        AccountingAPIHelper.getAllSOFPs()
          .then(results => {
            setSOFPs(results);
            setLoading(false);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])

    function onValuesChange(_, form) {
        let start_date, end_date;
        if (form.date && form.date[0] && form.date[1]) {
            start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        AccountingAPIHelper.getSOFP(form, start_date, end_date)
        .then(results => {
          setSOFPs(results);
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
    }
    
    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
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
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    { hasWriteAccessTo(View.ACCOUNTING.name) &&
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>New</Button>
                    }
                </MyToolbar>

                <Table 
                    dataSource={SOFPs} 
                    columns={columns} 
                    loading={loading} 
                    rowKey="id" 
                    pagination={{ showTotal }}
                />
            </MyCard>

            <NewSOFPModal SOFPs={SOFPs} setSOFPs={setSOFPs} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />

        </MyLayout>
    );
}

const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
        ellipsis: true,
        render: (created_at) => parseDate(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
        title: 'Title',
        dataIndex: 'name',
        key: 'name',
        width: '14%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
        title: 'Date',
        dataIndex: 'end_date',
        key: 'end_date',
        width: 150,
        ellipsis: true,
        render: (end_date) => parseDate(end_date),
        sorter: (a, b) => sortByDate(a.end_date, b.end_date),
    },
    {
        title: 'Status',
        dataIndex: 'deleted_date',
        key: 'deleted_date',
        width: 120,
        align: 'center',
        ellipsis: true,
        render: (deleted_date) => getActiveTag(deleted_date),
        sorter: (a, b) => sortByNumber(a.deleted_date ? 1 : 0, b.deleted_date ? 1 : 0),
    },
]