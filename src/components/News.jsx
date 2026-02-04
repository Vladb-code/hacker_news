import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  Row,
  Col,
  Button,
  Typography,
  Space,
  Spin,
  ConfigProvider,
  theme,
  Alert,
} from "antd";
import {
  SyncOutlined,
  ThunderboltOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import {
  selectAllNews,
  selectNewsLoading,
  selectNewsError,
  fetchAssets,
} from "../redux/newsSlice";

const { Title, Text } = Typography;

const News = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectAllNews);
  const loading = useSelector(selectNewsLoading);
  const error = useSelector(selectNewsError);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchAssets());
    }
  }, [dispatch, items.length]);

  const handleUpdate = () => {
    dispatch(fetchAssets());
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="view-port">
        <div className="nebula-fog" />
        <div className="grid-layer" />

        <div className="content-relative">
          <header className="glass-header">
            <Space size="middle">
              <div className="reactor-core" />
              <Title level={2} className="text-hologram m-0">
                HACKER_NEWS
              </Title>
            </Space>

            <Button
              type="primary"
              ghost
              onClick={handleUpdate}
              disabled={loading}
              icon={<SyncOutlined spin={loading} />}
              className="plasma-button"
            >
              {loading ? "UPDATING..." : "UPDATE"}
            </Button>
          </header>

          <main className="main-container">
            {error && (
              <Alert
                message="SYSTEM_ERROR"
                description={error}
                type="error"
                showIcon
                className="error-alert"
              />
            )}

            <Row gutter={[24, 24]}>
              {loading && items.length === 0 ? (
                <Col span={24} className="center-loading">
                  <Spin
                    size="large"
                    indicator={<SyncOutlined spin className="neon-icon" />}
                  />
                  <div className="loading-text">INITIALIZING_LINK...</div>
                </Col>
              ) : (
                items.map((news) => (
                  <Col xs={24} md={12} key={news.id}>
                    <div className="cyber-frame">
                      <div className="corner-marker" />

                      <Link to={`/news/${news.id}`} className="news-link">
                        {news.title.toUpperCase()}
                      </Link>
                      <div className="footer-row">
                        <Space size="middle">
                          <span
                            className={`energy-badge ${news.score > 100 ? "high-energy" : ""}`}
                          >
                            <ThunderboltOutlined /> {news.score} RATING
                          </span>
                          <Text className="meta-text">
                            <RocketOutlined /> @{news.by}
                          </Text>
                        </Space>
                        <Text className="time-text">
                          {new Date(news.time * 1000).toLocaleString()}
                        </Text>
                      </div>
                    </div>
                  </Col>
                ))
              )}
            </Row>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default News;
