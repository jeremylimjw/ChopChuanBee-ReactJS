import { Form, Select, Typography } from "antd";
import { useEffect, useRef, useState } from "react";

export default function SelectAliasCell({ field, toggleable, handleSave, record, menuItems, menuItemsMap, disabledProductsMap = {}, ...restProps }) {
  const [form] = Form.useForm();

  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const [options, setOptions] = useState();

  // Init form value for non-toggleable
  useEffect(() => {
    form.setFieldsValue({ [field]: record[field]?.id });
    setOptions(menuItems.map(x => ({ label: x.product_alias, value: x.id, product: x })));
  }, [form, field, menuItems, record])
  
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
    handleSave({...record, [field]: option?.product, product_id: option?.product.id })
    
    if (toggleable === 'true') {
        toggleEdit();
    }
  }

  function onSearch(value) {
    const filtered = menuItems.filter(x => x.product_alias.toLowerCase().indexOf(value.toLowerCase()) >= 0);
    setOptions(filtered.map(x => ({ label: x.product_alias, value: x.id, product: x })));
  }
	

	return (
		<td {...restProps}>
			<Form form={form}>
			{ (!toggleable || editing) ? 
                <Form.Item style={{ margin: 0 }} name={field}>
                <Select ref={inputRef} showSearch style={{ width: 280 }}
                    options={options}
                    placeholder="Select Product Alias" 
                    onChange={onChange} 
                    onSearch={onSearch}
                    onBlur={onBlur}
                    filterOption={(_, option) => !disabledProductsMap[option.product.id]}
                />
                </Form.Item>
				:
				<div onClick={toggleEdit}>
                    { record[field] ?
                    <span>
                        { (record[field].deactivated_date != null ? '(Unlisted) ' : '') + (menuItemsMap[record[field].id]?.product_alias || '') } 
                    </span>
                    : 
                    <Typography.Text type="secondary">Click to search by Product Alias</Typography.Text>
                    }
				</div>
			}
			</Form>
		</td>
	)

}
