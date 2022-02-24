import { Form, Select, Typography } from "antd";
import { useEffect, useRef, useState } from "react";

export default function SelectProductCell({ field, toggleable, handleSave, record, products, disabledProducts, ...restProps }) {
  const [form] = Form.useForm();

  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const [options, setOptions] = useState();

  // Init form value for non-toggleable
  useEffect(() => {
    form.setFieldsValue({ [field]: record[field]?.id });
    setOptions(products.map(x => ({ label: x.name, value: x.id, product: x })));
  }, [form, field, products, record])
  
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  
  function toggleEdit() {
      setEditing(!editing);
      form.setFieldsValue({ [field]: record[field]?.id });
  };

  function onBlur() {
    if (toggleable === 'true') {
        toggleEdit();
    }
  }

  function onChange(_, option) {
    handleSave({...record, [field]: option?.product })
    
    if (toggleable === 'true') {
        toggleEdit();
    }
  }

  function onSearch(value) {
    const filtered = products.filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) >= 0);
    setOptions(filtered.map(x => ({ label: x.name, value: x.id, product: x })));
  }
	

	return (
		<td {...restProps}>
			<Form form={form}>
			{ (!toggleable || editing) ? 
        <Form.Item style={{ margin: 0 }} name={field}>
          <Select ref={inputRef} showSearch style={{ width: 280 }}
            options={options}
            placeholder="Select Product" 
            onChange={onChange} 
            onSearch={onSearch}
            onBlur={onBlur}
            filterOption={(_, option) => !disabledProducts[option.product.id]}
          />
        </Form.Item>
				:
				<div onClick={toggleEdit}>
        { record[field] ?
					record[field].name : <Typography.Text type="secondary">Click to select product</Typography.Text>
        }
				</div>
			}
			</Form>
		</td>
	)

}
