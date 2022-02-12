import { Form, Input, InputNumber } from "antd";
import { useEffect, useRef, useState } from "react";

export default function EditableCell({ children, dataIndex, editable, inputType, record, handleSave, isToggleable, displayType, ...restProps }) {
    const [value, setValue] = useState();
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
      if (record)
        setValue(record[dataIndex])
    }, [record, dataIndex])
    
    useEffect(() => {
      if (isToggleable && editing) inputRef.current.focus();
    }, [editing, isToggleable]);

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

    // Workaround to display in currency field
    if (displayType === 'currency' && children.length >= 2) {
      const copy = [...children];
      copy[1] = "$"+parseFloat(copy[1] || 0)?.toFixed(2);
      node = copy;
    }
  
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