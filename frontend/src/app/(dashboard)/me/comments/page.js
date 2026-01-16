"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageCircle, Calendar, ExternalLink, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/loader";

const MyComments = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch user's comments
  const fetchComments = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Try to get user's comments - may need to adjust endpoint based on backend
      const response = await axios.get(`/comments/user/${user.id}`);
      const userComments = response.data?.comments || response.data || [];
      setComments(userComments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.id) {
      fetchComments();
    }
  }, [authLoading, isAuthenticated, user?.id, fetchComments]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Delete comment handler
  const handleDelete = async (commentId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      setDeletingId(commentId);
      await axios.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  // Loading skeleton
  const CommentSkeleton = () => (
    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
      <div className="h-5 bg-white/10 rounded w-full mb-2" />
      <div className="h-4 bg-white/10 rounded w-2/3 mb-4" />
      <div className="h-3 bg-white/10 rounded w-24" />
    </div>
  );

  // Show loader while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Comments</h1>
        <p className="text-gray-400">Comments you have made on posts</p>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No comments yet</h3>
          <p className="text-gray-400 max-w-sm mx-auto mb-6">
            When you comment on posts, they will appear here.
          </p>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
          >
            Explore Posts
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment.id || index}
              className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden
                hover:bg-white/10 hover:border-white/20
                transition-all duration-300
                animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Post Cover Image */}
              {comment.post?.coverImage && (
                <div className="relative h-24 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={comment.post.coverImage}
                    alt={comment.post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-5">
              {/* Post info */}
              {comment.post && (
                <Link
                  href={`/posts/${comment.post.id || comment.postId}`}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors mb-3"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">{comment.post.title || "Post"}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )}

              {/* Comment content */}
              <p className="text-gray-300 leading-relaxed mb-3">
                {comment.content || comment.body}
              </p>

              {/* Meta row */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(comment.createdAt)}
                </span>

                <button
                  onClick={(e) => handleDelete(comment.id, e)}
                  disabled={deletingId === comment.id}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100
                    hover:bg-red-500/20 text-gray-400 hover:text-red-400
                    transition-all disabled:opacity-50"
                  title="Delete comment"
                >
                  {deletingId === comment.id ? (
                    <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComments;
