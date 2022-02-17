import { Tag } from "antd";

export function getActiveTag(field) {
    if (field == null) return <Tag color='green'>Active</Tag>;
    return <Tag color='volcano'>Inactive</Tag>
}