import { useState, memo, useMemo } from "react";
import axios from "axios";
import { Button, Typography, Spin } from "antd";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  UserOutlined,
} from "@ant-design/icons";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

const { Text } = Typography;

const Comment = memo(({ id, text, by, kids, time }) => {
  const [subComments, setSubComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const formattedTime = useMemo(() => {
    return time ? ` // ${new Date(time * 1000).toLocaleTimeString()}` : "";
  }, [time]);

  const loadNested = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    if (subComments.length > 0) {
      setIsOpen(true);
      return;
    }

    if (!kids) return;

    setLoading(true);
    try {
      const promises = kids.map((kidId) =>
        axiosInstance.get(`item/${kidId}.json`),
      );
      const res = await Promise.all(promises);
      setSubComments(res.map((r) => r.data).filter((c) => c && !c.deleted));
      setIsOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!text) return null;

  return (
    <div className="comment-container">
      <div className="comment-meta">
        <UserOutlined className="comment-user-icon" />
        <Text className="comment-author">
          {by?.toUpperCase() || "UNKNOWN_USER"}
        </Text>
        <Text className="comment-timestamp">{formattedTime}</Text>
      </div>

      <div
        className="comment-content"
        dangerouslySetInnerHTML={{ __html: text }}
      />

      {kids && (
        <Button
          type="text"
          size="small"
          onClick={loadNested}
          className="comment-toggle-btn"
          icon={
            loading ? (
              <Spin size="small" />
            ) : isOpen ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )
          }
        >
          {loading
            ? "FETCHING..."
            : isOpen
              ? "CLOSE"
              : `ANSWER (${kids.length})`}
        </Button>
      )}

      {isOpen && (
        <div className="comment-nested-branch">
          {subComments.map((child) => (
            <Comment key={child.id} {...child} />
          ))}
        </div>
      )}
    </div>
  );
});

export default Comment;
