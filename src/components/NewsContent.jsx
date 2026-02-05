import { Typography, Space, Button, Divider } from "antd";
import { UserOutlined, SyncOutlined, GlobalOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const NewsContent = ({ news }) => {
  return (
    <div className="card-content-padding">
      <Text className="id-label-dim">DATA_NODE::{news.id}</Text>
      <Title level={1} className="hologram-title-main">
        {news.title.toUpperCase()}
      </Title>

      <Space size="large" className="mb-20">
        <Text className="meta-text-light">
          <UserOutlined /> AUTHOR: {news.by}
        </Text>
        <Text className="meta-text-light">
          <SyncOutlined /> TIMESTAMP:{" "}
          {new Date(news.time * 1000).toLocaleString()}
        </Text>
      </Space>

      <div className="mb-30">
        <Button
          type="primary"
          icon={<GlobalOutlined />}
          href={news.url}
          target="_blank"
          className="action-button-solid"
        >
          ACCESS_ORIGIN_DATA
        </Button>
      </div>

      <Divider className="cyber-divider" />
    </div>
  );
};

export default NewsContent;
