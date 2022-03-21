import InputCell from "./InputCell";
import InputNumberCell from "./InputNumberCell";
import SelectAliasCell from "./SelectAliasCell";
import SelectProductCell from "./SelectProductCell";

export function CustomCell(props) {
    switch(props.type) {
        case 'input': return InputCell(props);
        case 'input_number': return InputNumberCell(props);
        case 'product_select': return SelectProductCell(props);
        case 'alias_select': return SelectAliasCell(props);
        default: return <td {...props}>{props.children}</td>
    }
}