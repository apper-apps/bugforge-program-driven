import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";

const CommentForm = ({ 
  onSubmit, 
  placeholder = "Write a comment...", 
  initialText = "",
  submitLabel = "Post Comment",
  isReply = false,
  onCancel
}) => {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handleUserMentions = (inputText) => {
    // Simple user mention detection - could be enhanced with actual user lookup
    return inputText.replace(/@(\w+)/g, '<span class="text-primary font-medium">@$1</span>');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        text: text.trim(),
        authorId: user?.userId || user?.Id,
        mentions: extractMentions(text)
      });
      setText("");
      toast.success(isReply ? "Reply posted successfully" : "Comment posted successfully");
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const extractMentions = (text) => {
    const mentions = text.match(/@(\w+)/g);
    return mentions ? mentions.map(mention => mention.substring(1)) : [];
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
          rows={isReply ? 2 : 3}
          className="resize-none"
          disabled={loading}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          Use @username to mention users
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {text.length > 0 && (
            <span>
              {extractMentions(text).length > 0 && 
                `${extractMentions(text).length} mention${extractMentions(text).length > 1 ? 's' : ''} • `
              }
              {text.length} characters
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isReply && onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={loading || !text.trim()}
            className="inline-flex items-center gap-2"
          >
            {loading ? (
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
            ) : (
              <ApperIcon name="Send" className="w-4 h-4" />
            )}
            {loading ? "Posting..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;