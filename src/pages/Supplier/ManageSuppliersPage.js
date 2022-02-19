import { Button, Table, Input, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import MyToolbar from "../../components/layout/MyToolbar";
import MyCard from "../../components/layout/MyCard";
import { SupplierAPIHelper } from "../../api/supplier";
import { useApp } from "../../providers/AppProvider";
import NewSupplierModal from "../../components/supplierModule/NewSupplierModal";
import MyLayout from "../../components/layout/MyLayout";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons/lib/icons";
import { Link } from "react-router-dom";
import { getActiveTag } from "../../enums/ActivationStatus";
import { sortByDate, sortByNumber, sortByString } from "../../utilities/sorters";
import { parseDate } from "../../utilities/datetime";
import debounce from "lodash.debounce";
import { View } from "../../enums/View";

const breadcrumbs = [
  { url: "/suppliers", name: "Supplier" },
];

export default function SuppliersPage() {
  const { handleHttpError, hasWriteAccessTo } = useApp();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    setLoading(true);
    SupplierAPIHelper.getAll()
      .then(results => {
        setSuppliers(results);
        setLoading(false);
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false))
  }, [handleHttpError, setLoading])

  function onValuesChange(_, form) {
    SupplierAPIHelper.get(form)
        .then(results => {
          setSuppliers(results);
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
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Suppliers">
      <MyCard>
        <MyToolbar title="Suppliers">
          <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off' initialValues={{ status: null }}>
            <Form.Item name="company_name">
                <Input placeholder='Search Company' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
            </Form.Item>
            <Form.Item name="p1_name">
                <Input placeholder='Search Person Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
            </Form.Item>
            <Form.Item name="status">
              <Select style={{ width: 120 }} placeholder="Filter by Status">
                <Select.Option value={null}>All</Select.Option>
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Button onClick={resetForm}>Reset</Button>
          </Form>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} disabled={!hasWriteAccessTo(View.SCM.name)}>New</Button>
        </MyToolbar>

        <Table dataSource={suppliers} columns={columns} loading={loading} rowKey="id" />
      </MyCard>

      <NewSupplierModal suppliers={suppliers} setSuppliers={setSuppliers} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />

    </MyLayout>
  );
}

const columns = [
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
    render: (created_at) => parseDate(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Company',
    dataIndex: 'company_name',
    key: 'company_name',
    width: '14%',
    sorter: (a, b) => sortByString(a.company_name, b.company_name),
  },
  {
    title: 'Contact Person',
    dataIndex: 's1_name',
    key: 's1_name',
    width: '12%',
    sorter: (a, b) => sortByString(a.s1_name, b.s1_name),
  },
  {
    title: 'Contact Number',
    dataIndex: 's1_phone_number',
    key: 's1_phone_number',
    width: '14%',
    sorter: (a, b) => sortByString(a.s1_phone_number, b.s1_phone_number),
  },
  {
    title: 'Email',
    dataIndex: 'company_email',
    key: 'company_email',
    render: (company_email) => company_email || '-',
    sorter: (a, b) => sortByString(a.company_email, b.company_email),
  },
  {
    title: 'AP',
    key: 'AP',
    width: 80,
    render: (AR) => '-',
    sorter: (a, b) => sortByString(a.company_email, b.company_email),
  },
  {
    title: 'Status',
    dataIndex: 'deactivated_date',
    key: 'deactivated_date',
    width: 120,
    render: (deactivated_date) => getActiveTag(deactivated_date),
    sorter: (a, b) => sortByNumber(a.deactivated_date ? 1 : 0, b.deactivated_date ? 1 : 0),
  },
  {
    title: "Action",
    dataIndex: "id",
    key: "link",
    width: 100,
    render: (id) => <Link to={`./${id}`}>View</Link>,
  },
];
