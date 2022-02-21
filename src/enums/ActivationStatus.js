import { Tag } from "antd";

export function getActiveTag(field, labels=['Active', 'Inactive']) {
    if (field == null) return <Tag color='green'>{labels[0]}</Tag>;
    return <Tag color='volcano'>{labels[1]}</Tag>
}