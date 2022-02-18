import { Tag } from "antd";

export function getActiveTag(field) {
    if (field == null) return <Tag color='green'>ACTIVE</Tag>;
    return <Tag color='volcano'>INACTIVE</Tag>
}