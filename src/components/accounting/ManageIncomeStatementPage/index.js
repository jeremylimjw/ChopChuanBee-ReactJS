import { Button, Table, Input, DatePicker, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons/lib/icons";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import moment from 'moment';
import { useApp } from "../../../providers/AppProvider";
import { AccountingAPIHelper } from "../../../api/AccountingAPIHelper";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import MyToolbar from "../../common/MyToolbar";
import { View } from "../../../enums/View";
import NewIncomeStatementModal from "./NewIncomeStatementModal";
import { parseDate } from "../../../utilities/datetime";
import { sortByDate, sortByNumber, sortByString } from "../../../utilities/sorters";
import { getListTag } from "../../../enums/ActivationStatus";
import { showTotal } from "../../../utilities/table";

const breadcrumbs = [
    { url: "/accounting/IncomeStatements", name: "Accounting" },    
    { url: "/accounting/IncomeStatements", name: "Income Statements" },
];

export default function ManageIncomeStatementPage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [incomes, setIncomes] = useState([]);

    useEffect(() => {
        setLoading(true);
        AccountingAPIHelper.getAllIncomeStatements()
          .then(results => {
            setIncomes(results);
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
        AccountingAPIHelper.getIncome(form, start_date, end_date, form.status)
        .then(results => {
            setIncomes(results);
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
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Income Statements">
            <MyCard>
                <MyToolbar title="Income Statements">
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name="name">
                            <Input placeholder='Search Name' style={{ width: 140 }} suffix={<SearchOutlined className='grey' />} />
                        </Form.Item>
                        <Form.Item name="date" >
                            <DatePicker.RangePicker />
                        </Form.Item>
                        <Form.Item name="status">
                            <Select style={{ width: 140 }} placeholder="Filter by Status">
                            <Select.Option value={null}>All</Select.Option>
                            <Select.Option value={true}>Listed</Select.Option>
                            <Select.Option value={false}>Unlisted</Select.Option>
                            </Select>
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    { hasWriteAccessTo(View.ACCOUNTING.name) &&
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>New</Button>
                    }
                </MyToolbar>

                <Table 
                    dataSource={incomes} 
                    columns={columns} 
                    loading={loading} 
                    rowKey="id" 
                    pagination={{ showTotal: showTotal }}
                />
            </MyCard>

            <NewIncomeStatementModal incomes={incomes} setIncomes={setIncomes} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />

        </MyLayout>
    );
}

const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: '10%',
        ellipsis: true,
        render: (created_at) => parseDate(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
        width: '10%',
        ellipsis: true,
        render: (start_date) => parseDate(start_date),
        sorter: (a, b) => sortByDate(a.start_date, b.start_date),
    },
    {
        title: 'End Date',
        dataIndex: 'end_date',
        key: 'end_date',
        width: '10%',
        ellipsis: true,
        render: (end_date) => parseDate(end_date),
        sorter: (a, b) => sortByDate(a.end_date, b.end_date),
    },
    {
        title: 'Status',
        dataIndex: 'deleted_date',
        key: 'deleted_date',
        width: '10%',
        align: 'center',
        ellipsis: true,
        render: (deleted_date) => getListTag(deleted_date),
        sorter: (a, b) => sortByNumber(a.deleted_date ? 1 : 0, b.deleted_date ? 1 : 0),
    },
    {
        title: "Action",
        dataIndex: "id",
        key: "link",
        width: '10%',
        ellipsis: true,
        render: (id) => <Link to={`./${id}`}>View</Link>,
    },
];