import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  fetchAssets,
  selectNewsById,
  selectNewsLoading,
} from "../redux/newsSlice";
import {
  Button,
  Typography,
  Space,
  Spin,
  Divider,
  ConfigProvider,
  theme,
} from "antd";
import {
  SyncOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Comment from "./Comment";

const { Title, Text } = Typography;

const NewsDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const news = useSelector(selectNewsById(id));
  const isGlobalLoading = useSelector(selectNewsLoading);

  const [rootComments, setRootComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const loadRootComments = useCallback(async () => {
    if (!news?.kids) return;
    setLoadingComments(true);
    try {
      const promises = news.kids.map((kidId) =>
        axios.get(`${import.meta.env.VITE_API_URL}item/${kidId}.json`),
      );
      const res = await Promise.allSettled(promises);
      setRootComments(
        res
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value.data)
          .filter((c) => c && !c.deleted),
      );
    } catch (e) {
      console.error("SYSTEM_ERROR::FETCH_COMMENTS_FAILED", e);
    } finally {
      setLoadingComments(false);
    }
  }, [news?.kids]);

  useEffect(() => {
    if (!news && !isGlobalLoading) {
      dispatch(fetchAssets());
    }
  }, [news, isGlobalLoading, dispatch]);

  useEffect(() => {
    if (news) loadRootComments();
  }, [news, loadRootComments]);

  if (!news && isGlobalLoading) {
    return (
      <div className="view-port center-loading">
        <div className="base-black" />
        <div className="status-overlay">
          <Spin indicator={<SyncOutlined spin className="neon-icon-large" />} />
          <Title level={3} className="text-hologram mt-20">
            RECONNECTING_TO_NODE...
          </Title>
        </div>
      </div>
    );
  }

  if (!news)
    return (
      <div className="view-port center-loading">
        <div className="base-black" />
        <div className="status-overlay">
          <Title level={3} className="error-text">
            ERR::OBJECT_NOT_FOUND
          </Title>
          <Link to="/">
            <Button className="plasma-button">RETURN_TO_BASE</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="view-port">
        <div className="base-black" />
        <div className="nebula-fog" />
        <div className="grid-layer" />

        <div className="content-relative">
          <header className="glass-header">
            <Link to="/">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="plasma-button"
              >
                BACK_TO_NEWS
              </Button>
            </Link>
            <div className="reactor-core-large" />
          </header>

          <main className="main-padding">
            <div className="cyber-frame-detail">
              <div className="corner-marker-pink" />
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

                <div className="footer-row-space">
                  <Title level={4} className="comment-section-title">
                    <MessageOutlined /> COMMENTS ({news.descendants || 0})
                  </Title>
                  <Button
                    onClick={loadRootComments}
                    loading={loadingComments}
                    icon={<SyncOutlined />}
                    className="plasma-button"
                  >
                    UPDATE_COMMENTS
                  </Button>
                </div>

                <div className="mt-30">
                  {loadingComments && rootComments.length === 0 ? (
                    <Spin
                      indicator={<SyncOutlined spin className="neon-icon-md" />}
                    />
                  ) : (
                    rootComments.map((c) => <Comment key={c.id} {...c} />)
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default NewsDetail;
