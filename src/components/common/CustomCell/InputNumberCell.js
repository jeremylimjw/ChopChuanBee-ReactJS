import { Form, InputNumber, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";

export default function InputNumberCell({ field, toggleable, record, handleSave, ...restProps }) {
    const [form] = Form.useForm();

    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);

    // Init form value for non-toggleable
    useEffect(() => {
        form.setFieldsValue({ [field]: record[field] });
    }, [form, field, record])
    
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    
    function toggleEdit() {
        setEditing(!editing);
        form.setFieldsValue({ [field]: record[field] });
    };

    function save() {
        const values = form.getFieldsValue();
        handleSave({ ...record, ...values })
        
        if (toggleable === 'true') {
            toggleEdit();
        }
    }

    return (
        <td {...restProps}>
            <Form form={form}>
            { (!toggleable || editing) ? 
                <Form.Item style={{ margin: 0 }} name={field}>
                    <InputNumber min={0} ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
                :
                <div onClick={toggleEdit}>
                { record[field] ?
                    record[field] : <Typography.Text type="secondary">Click to enter value</Typography.Text>
                }
                </div>
            }
            </Form>
        </td>
    )
    
}