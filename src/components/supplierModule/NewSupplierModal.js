import React, { useState } from "react";
import { Form, Typography, Input, Divider, Modal, message } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons/lib/icons";
import { SupplierAPIHelper } from "../../api/supplier";
import { EMAIL, exactLength, minLength, NUMBER, REQUIRED } from "../../utilities/form";
import { useApp } from "../../providers/AppProvider";

export default function NewSupplierModal({ suppliers, setSuppliers, isModalVisible, setIsModalVisible }) {

  const { handleHttpError } = useApp();

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  async function handleOk() {
    try {
      const values = await form.validateFields();
      setLoading(true);
      SupplierAPIHelper.create(values)
        .then(newSupplier => {
          message.success('Supplier successfully created!')
          setSuppliers([newSupplier, ...suppliers]);
          setLoading(false);
          setIsModalVisible(false);
          form.resetFields();
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    } catch (err) { }
}

  return (
    <Modal
      title="Create A Supplier"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      onOk={handleOk} 
      width={600}
      destroyOnClose={true}
      bodyStyle={{ height: "60vh", overflowY: "scroll" }}
      okButtonProps={{ loading: loading }}
    >

      <Form {...layout} form={form} autoComplete="off" labelAlign="left">

        <Form.Item
          rules={[REQUIRED]}
          label="Company Name"
          name="company_name"
        >
          <Input />
        </Form.Item>

        <Form.Item
          rules={[REQUIRED]}
          label="Address"
          name="address"
        >
          <Input />
        </Form.Item>

        <Form.Item
          rules={[REQUIRED, exactLength(6), NUMBER]}
          label="Postal Code"
          name="postal_code"
        >
          <Input />
        </Form.Item>

        <Form.Item
          rules={[EMAIL]}
          label="Email"
          name="email"
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>

        <Divider />

        <Typography.Title level={5}>Contact Person 1</Typography.Title>

        <Form.Item
          rules={[REQUIRED]}
          label="Name"
          name="s1_name"
        >
          <Input />
        </Form.Item>

        <Form.Item
          rules={[REQUIRED, minLength(8)]}
          label="Contact Number"
          name="s1_phone_number"
        >
          <Input />
        </Form.Item>

        <Divider />
        <div className='flex-last-left'>
            <Typography.Title level={5}>Contact Person 2</Typography.Title>
            <div>
                { expand ? <MinusOutlined onClick={() => setExpand(false)} /> : <PlusOutlined onClick={() => setExpand(true)} />}
            </div>
        </div>

        { expand && 
          <>
            <Form.Item label="Name" name="s2_name">
                <Input />
            </Form.Item>

            <Form.Item label="Contact Number" name="s2_phone_number" rules={[minLength(8)]}>
                <Input />
            </Form.Item>
          </>
        }

      </Form>
    </Modal>
  );
};
