import { Form, Input, InputNumber } from "antd";
import { useEffect, useRef, useState } from "react";

export default function EditableCell({ children, dataIndex, editable, inputType, record, handleSave, isToggleable, ...restProps }) {
    const [value, setValue] = useState();
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
      if (record)
        setValue(record[dataIndex])
    }, [record])
    
    useEffect(() => {
      if (isToggleable && editing) inputRef.current.focus();
    }, [editing]);

    function toggleEdit() {
        setEditing(!editing);
        setValue(record[dataIndex]);
    };

    async function save() {
        handleSave({ ...record, [dataIndex]: value });
        toggleEdit();
    };

    function renderFormItem() {
      if (inputType === 'number') {
        return <InputNumber ref={inputRef} value={value} onChange={(value) => setValue(value)} onPressEnter={save} onBlur={save} />
      }
      return <Input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} onPressEnter={save} onBlur={save} />
    }

    let node = children;
  
    if (editable) {
      if (isToggleable) {
        node =  editing ? (
          <Form.Item style={{ margin: 0 }}>
            {renderFormItem()}
          </Form.Item>
        ) : (
          <div style={{ padding: '5px 12px', cursor: 'pointer' }} onClick={toggleEdit}>
            {children}
          </div>
          )
      } else {
        node = (
          <Form.Item style={{ margin: 0 }}>
            {renderFormItem()}
          </Form.Item>)
      }
    }

    return <td {...restProps}>{node}</td>;
};