import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAssets,
  selectNewsById,
  selectNewsLoading,
} from "../redux/newsSlice";
import { Button, Spin, ConfigProvider, theme, Typography } from "antd";
import { SyncOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import NewsContent from "./NewsContent";
import CommentsSection from "./CommentsSection";

const { Title } = Typography;

const NewsDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const news = useSelector(selectNewsById(id));
  const isGlobalLoading = useSelector(selectNewsLoading);

  useEffect(() => {
    if (!news && !isGlobalLoading) {
      dispatch(fetchAssets());
    }
  }, [news, isGlobalLoading, dispatch]);

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
              <NewsContent news={news} />
              <CommentsSection
                kids={news.kids}
                descendants={news.descendants}
              />
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default NewsDetail;
