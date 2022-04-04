import { Button, Table, Input, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons/lib/icons";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { useApp } from "../../../providers/AppProvider";
import { SupplierAPIHelper } from "../../../api/SupplierAPIHelper";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import { showTotal } from "../../../utilities/table";
import NewSupplierModal from "./NewSupplierModal";
import { parseDate } from "../../../utilities/datetime";
import { sortByDate, sortByNumber, sortByString } from "../../../utilities/sorters";
import { getActiveTag } from "../../../enums/ActivationStatus";
import MyToolbar from "../../common/MyToolbar";
import { View } from "../../../enums/View";
import EmailLink from "../../../utilities/EmailLink";

const breadcrumbs = [
  { url: "/supplier/suppliers", name: "Supplier" },
  { url: "/supplier/suppliers", name: "Suppliers" },
];

export default function ManageSuppliersPage() {
  const { handleHttpError, hasWriteAccessTo } = useApp();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    setLoading(true);
    SupplierAPIHelper.get()
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
          <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
            <Form.Item name="company_name">
                <Input placeholder='Search Company' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
            </Form.Item>
            <Form.Item name="s1_name">
                <Input placeholder='Search Person Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
            </Form.Item>
            <Form.Item name="status">
              <Select style={{ width: 140 }} placeholder="Filter by Status">
                <Select.Option value={null}>All</Select.Option>
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Button onClick={resetForm}>Reset</Button>
          </Form>
          { hasWriteAccessTo(View.SCM.name) && 
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>New</Button>
          }
        </MyToolbar>

        <Table 
          dataSource={suppliers} 
          columns={columns} 
          loading={loading} 
          rowKey="id" 
          pagination={{ showTotal: showTotal }}
        />
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
    ellipsis: true,
    render: (created_at) => parseDate(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Company',
    dataIndex: 'company_name',
    key: 'company_name',
    width: '14%',
    ellipsis: true,
    sorter: (a, b) => sortByString(a.company_name, b.company_name),
  },
  {
    title: 'Contact Person',
    dataIndex: 's1_name',
    key: 's1_name',
    width: '12%',
    ellipsis: true,
    sorter: (a, b) => sortByString(a.s1_name, b.s1_name),
  },
  {
    title: 'Contact Number',
    dataIndex: 's1_phone_number',
    key: 's1_phone_number',
    width: '14%',
    ellipsis: true,
    sorter: (a, b) => sortByString(a.s1_phone_number, b.s1_phone_number),
  },
  {
    title: 'Email',
    dataIndex: 'company_email',
    key: 'company_email',
    ellipsis: true,
    render: (company_email) => <EmailLink email={company_email} />,
    sorter: (a, b) => sortByString(a.company_email, b.company_email),
  },
  {
    title: 'AP',
    dataIndex: 'ap',
    key: 'ap',
    width: 100,
    align: 'center',
    ellipsis: true,
    render: (ap) => `$${(+ap).toFixed(2)}`,
    sorter: (a, b) => sortByNumber(a.ap, b.ap),
  },
  {
    title: 'Status',
    dataIndex: 'deactivated_date',
    key: 'deactivated_date',
    width: 120,
    align: 'center',
    ellipsis: true,
    render: (deactivated_date) => getActiveTag(deactivated_date),
    sorter: (a, b) => sortByNumber(a.deactivated_date ? 1 : 0, b.deactivated_date ? 1 : 0),
  },
  {
    title: "Action",
    dataIndex: "id",
    key: "link",
    width: 100,
    ellipsis: true,
    render: (id) => <Link to={`./${id}`}>View</Link>,
  },
];
