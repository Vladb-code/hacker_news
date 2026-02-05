import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Typography, Button, Spin } from "antd";
import { MessageOutlined, SyncOutlined } from "@ant-design/icons";
import Comment from "./Comment";

const { Title } = Typography;

const CommentsSection = ({ kids, descendants }) => {
  const [rootComments, setRootComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRootComments = useCallback(async () => {
    if (!kids) return;
    setLoading(true);
    try {
      const promises = kids.map((kidId) =>
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
      setLoading(false);
    }
  }, [kids]);

  useEffect(() => {
    loadRootComments();
  }, [loadRootComments]);

  return (
    <div className="card-content-padding pt-0">
      <div className="footer-row-space">
        <Title level={4} className="comment-section-title">
          <MessageOutlined /> COMMENTS ({descendants || 0})
        </Title>
        <Button
          onClick={loadRootComments}
          loading={loading}
          icon={<SyncOutlined />}
          className="plasma-button"
        >
          UPDATE_COMMENTS
        </Button>
      </div>

      <div className="mt-30">
        {loading && rootComments.length === 0 ? (
          <Spin indicator={<SyncOutlined spin className="neon-icon-md" />} />
        ) : (
          rootComments.map((c) => <Comment key={c.id} {...c} />)
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
