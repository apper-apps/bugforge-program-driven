import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import CommentForm from "@/components/molecules/CommentForm";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import { commentService } from "@/services/api/commentService";
import { replyService } from "@/services/api/replyService";

const CommentsSection = ({ testCaseId, bugId }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [loadingReplies, setLoadingReplies] = useState({});
  
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
loadComments();
  }, [testCaseId, bugId]);

  const loadComments = async () => {
    setLoading(true);
    try {
const data = testCaseId 
        ? await commentService.getByTestCase(testCaseId)
        : await commentService.getByBug(bugId);
      setComments(data);
      
      // Load replies for each comment
      for (const comment of data) {
        await loadReplies(comment.Id);
      }
    } catch (error) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async (commentId) => {
    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
    try {
      const data = await replyService.getByComment(commentId);
      setReplies(prev => ({ ...prev, [commentId]: data }));
    } catch (error) {
      console.error("Failed to load replies for comment:", commentId);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleCommentSubmit = async (commentData) => {
    const newComment = await commentService.create({
...commentData,
      testCaseId: testCaseId || undefined,
      bugId: bugId || undefined
    });
    
    if (newComment) {
      setComments(prev => [...prev, newComment]);
      setReplies(prev => ({ ...prev, [newComment.Id]: [] }));
    }
  };

  const handleReplySubmit = async (replyData) => {
    const newReply = await replyService.create({
      ...replyData,
      commentId: replyingTo
    });
    
    if (newReply) {
      setReplies(prev => ({
        ...prev,
        [replyingTo]: [...(prev[replyingTo] || []), newReply]
      }));
      setReplyingTo(null);
    }
  };

  const handleEditComment = async (commentData) => {
    const updatedComment = await commentService.update(editingComment, commentData);
    
    if (updatedComment) {
      setComments(prev => 
        prev.map(comment => 
          comment.Id === editingComment ? { ...comment, ...updatedComment } : comment
        )
      );
      setEditingComment(null);
      toast.success("Comment updated successfully");
    }
  };

  const handleEditReply = async (replyData) => {
    const updatedReply = await replyService.update(editingReply.id, replyData);
    
    if (updatedReply) {
      setReplies(prev => ({
        ...prev,
        [editingReply.commentId]: prev[editingReply.commentId].map(reply =>
          reply.Id === editingReply.id ? { ...reply, ...updatedReply } : reply
        )
      }));
      setEditingReply(null);
      toast.success("Reply updated successfully");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment? This will also delete all replies.")) {
      const success = await commentService.delete(commentId);
      
      if (success) {
        setComments(prev => prev.filter(comment => comment.Id !== commentId));
        setReplies(prev => {
          const newReplies = { ...prev };
          delete newReplies[commentId];
          return newReplies;
        });
        toast.success("Comment deleted successfully");
      }
    }
  };

  const handleDeleteReply = async (replyId, commentId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      const success = await replyService.delete(replyId);
      
      if (success) {
        setReplies(prev => ({
          ...prev,
          [commentId]: prev[commentId].filter(reply => reply.Id !== replyId)
        }));
        toast.success("Reply deleted successfully");
      }
    }
  };

  const renderCommentText = (text) => {
    // Simple user mention highlighting
    return text.replace(/@(\w+)/g, '<span class="text-primary font-medium">@$1</span>');
  };

  const canEdit = (item) => {
    const authorId = item.author_id_c?.Id || item.author_id_c;
    const userId = user?.userId || user?.Id;
    return authorId === userId;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
<div className="bg-gray-50 rounded-lg p-4">
        <CommentForm 
          onSubmit={handleCommentSubmit} 
          placeholder={`Add a comment about this ${testCaseId ? 'test case' : 'bug'}...`}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {comment.CreatedBy?.Name?.[0] || comment.author_id_c?.Name?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {comment.CreatedBy?.Name || comment.author_id_c?.Name || 'Unknown User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(comment.CreatedOn), 'MMM d, yyyy at h:mm a')}
                      {comment.ModifiedOn !== comment.CreatedOn && (
                        <span className="text-gray-400"> • edited</span>
                      )}
                    </div>
                  </div>
                </div>

                {canEdit(comment) && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingComment(comment.Id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.Id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {editingComment === comment.Id ? (
                <div className="mb-4">
                  <CommentForm
                    onSubmit={handleEditComment}
                    initialText={comment.text_c}
                    submitLabel="Update Comment"
                    isReply={true}
                    onCancel={() => setEditingComment(null)}
                  />
                </div>
              ) : (
                <div 
                  className="text-gray-700 mb-3"
                  dangerouslySetInnerHTML={{ 
                    __html: renderCommentText(comment.text_c || '') 
                  }}
                />
              )}

              {/* Comment Actions */}
              <div className="flex items-center gap-4 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.Id ? null : comment.Id)}
                  className="text-gray-500 hover:text-primary inline-flex items-center gap-1"
                >
                  <ApperIcon name="MessageCircle" className="w-4 h-4" />
                  Reply ({replies[comment.Id]?.length || 0})
                </Button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.Id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 ml-6 bg-gray-50 rounded-lg p-3"
                >
                  <CommentForm
                    onSubmit={handleReplySubmit}
                    placeholder="Write a reply..."
                    submitLabel="Post Reply"
                    isReply={true}
                    onCancel={() => setReplyingTo(null)}
                  />
                </motion.div>
              )}

              {/* Replies */}
              {replies[comment.Id] && replies[comment.Id].length > 0 && (
                <div className="mt-4 ml-6 space-y-3">
                  {replies[comment.Id].map((reply) => (
                    <motion.div
                      key={reply.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50 rounded-lg p-3 border-l-2 border-primary/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {reply.CreatedBy?.Name?.[0] || reply.author_id_c?.Name?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {reply.CreatedBy?.Name || reply.author_id_c?.Name || 'Unknown User'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {format(new Date(reply.CreatedOn), 'MMM d, h:mm a')}
                              {reply.ModifiedOn !== reply.CreatedOn && (
                                <span className="text-gray-400"> • edited</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {canEdit(reply) && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingReply({ id: reply.Id, commentId: comment.Id })}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <ApperIcon name="Edit" className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReply(reply.Id, comment.Id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <ApperIcon name="Trash2" className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {editingReply?.id === reply.Id ? (
                        <CommentForm
                          onSubmit={handleEditReply}
                          initialText={reply.text_c}
                          submitLabel="Update Reply"
                          isReply={true}
                          onCancel={() => setEditingReply(null)}
                        />
                      ) : (
                        <div 
                          className="text-gray-700 text-sm"
                          dangerouslySetInnerHTML={{ 
                            __html: renderCommentText(reply.text_c || '') 
                          }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {loadingReplies[comment.Id] && (
                <div className="mt-4 ml-6 text-center py-2">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                    Loading replies...
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="MessageCircle" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;