"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BlurImage } from "@/components/ui/apple-cards-carousel";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Feather,
  User,
  Send,
  Trash2
} from "lucide-react";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/loader";
import Silk from "@/components/animated/Silk";

const PostDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, getCurrentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentFocused, setCommentFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-expand textarea
  const handleCommentChange = (e) => {
    const textarea = e.target;
    setCommentText(textarea.value);

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    // Set height to scrollHeight
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
  };

  // Check authentication on mount
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/posts/${id}`);
        const postData = response.data?.post || null;
        setPost(postData);
        setLikeCount(postData?.likes || 0);
      } catch (err) {
        console.log("Post fetch:", err.message);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const response = await axios.get(`/comments/${id}`);
        setComments(response.data?.comments || []);
      } catch (err) {
        console.log("Comments fetch:", err.message);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };
    if (id) fetchComments();
  }, [id]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to like posts");
      return;
    }

    try {
      await axios.post(`/likes/${id}`);
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    } catch (err) {
      console.log("Like error:", err.message);
    }
  };

  // Handle add comment
  const handleAddComment = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to comment");
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await axios.post(`/comments/${id}`, {
        content: commentText.trim()
      });

      // Add new comment to the list
      const newComment = response.data?.comment;
      if (newComment) {
        setComments(prev => [newComment, ...prev]);
      }
      setCommentText("");
    } catch (err) {
      console.log("Add comment error:", err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.log("Delete comment error:", err.message);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate reading time (rough estimate)
  const getReadingTime = (content) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
      <div className="space-y-4">
        <div className="h-12 bg-white/10 rounded-xl w-3/4" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10" />
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-32" />
            <div className="h-3 bg-white/10 rounded w-48" />
          </div>
        </div>
      </div>
      <div className="aspect-video rounded-2xl bg-white/10" />
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-white/10 rounded w-full" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Silk Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Silk
          speed={2}
          scale={0.8}
          color="#c8ccc9"
          noiseIntensity={0.8}
          rotation={0.3}
        />
        {/* Subtle overlay for content readability */}
        <div className="absolute inset-0 bg-gray-950/85" />
      </div>



      {/* Main Content */}
      <main className="relative z-10 min-h-screen pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Back Button and Dashboard */}
          <div className="flex items-center justify-between pt-8 mb-12">
            {/* Back Button */}
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Posts
            </Link>

            {/* Dashboard Button */}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="relative px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white font-semibold text-sm overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                {/* Animated background shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                <span className="relative">Dashboard</span>
              </Link>
            )}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : !post ? (
            /* Post Not Found State */
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-12 text-center shadow-2xl shadow-black/20 max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
                <Feather className="w-10 h-10 text-violet-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Post not found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                The post you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 hover:shadow-xl hover:shadow-violet-500/25 transition-all"
              >
                Explore Other Posts
              </Link>
            </div>
          ) : (
            <>
              {/* Centered Title Section */}
              <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto">
                  {post.title}
                </h1>
                <div className="flex justify-center">
                </div>
              </div>

              {/* Author Info - Centered */}
              <div className="flex justify-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/30">
                    {post.author?.name?.charAt(0) || <User className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">{post.author?.name || "Anonymous"}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-violet-400" />
                        {formatDate(post.createdAt || new Date())}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-violet-400" />
                        {getReadingTime(post.content)} min read
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary - Full Width Centered */}
              {post.summary && (
                <div className="mb-12 flex justify-center animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="rounded-2xl bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-500/20 p-6 max-w-2xl">
                    <p className="text-gray-200 text-lg leading-relaxed italic text-center">{post.summary}</p>
                  </div>
                </div>
              )}

              {/* Split Layout Container - Image floats right, text wraps below */}
              <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Sticky Image floated to right */}
                <div className="float-right lg:w-[600px] ml-8 mb-8">
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/20 overflow-hidden h-fit sticky top-24">
                    <div className="relative aspect-video bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 overflow-hidden group w-full">
                      {post.coverImage ? (
                        <BlurImage
                          src={post.coverImage}
                          alt={post.title}
                          className="absolute inset-0 object-cover transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Feather className="w-12 h-12 text-white/10" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Text wraps around the floated image */}
                <article
                  className="prose prose-invert prose-lg max-w-none
                    prose-headings:text-white prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                    prose-p:text-gray-300 prose-p:leading-9 prose-p:mb-4
                    prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-white prose-strong:font-bold
                    prose-em:text-gray-200
                    prose-code:bg-white/10 prose-code:text-violet-300 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                    prose-pre:bg-gray-900/70 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                    prose-blockquote:border-l-4 prose-blockquote:border-violet-500 prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                    prose-blockquote:text-gray-200
                    prose-img:rounded-2xl prose-img:shadow-lg prose-img:shadow-black/30
                    prose-hr:border-white/10"
                  dangerouslySetInnerHTML={{ __html: post.content || "<p>No content available.</p>" }}
                />

                {/* Clear float for elements after */}
                <div className="clear-both" />
              </div>

              {/* Like & Share Buttons Below - Full Width */}
              <div className="max-w-4xl mb-12">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 ${
                      liked
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/10"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                    <span className="text-sm font-medium">{likeCount}</span>
                  </button>
                  <button className="flex items-center gap-2 px-5 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-gray-400 hover:text-white hover:border-white/20">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>

              {/* COMMENTS SECTION - Full Width Below */}
              <div className="mt-16 border-t border-white/10 pt-12 max-w-4xl">
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Comments {comments.length > 0 && `(${comments.length})`}
                    </h2>
                    <p className="text-gray-400">Join the conversation</p>
                  </div>

                  {/* Comment Input */}
                  {isAuthenticated ? (
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg shadow-violet-500/20">
                        {user?.name?.charAt(0) || "U"}
                      </div>

                      <div className="flex-1">
                        <textarea
                          ref={textareaRef}
                          placeholder="Share your thoughts on this post..."
                          value={commentText}
                          onChange={handleCommentChange}
                          onFocus={() => setCommentFocused(true)}
                          onBlur={() => setCommentFocused(false)}
                          className="w-full bg-transparent text-gray-300 placeholder:text-gray-400
                            focus:outline-none resize-none min-h-[40px] leading-relaxed text-base overflow-hidden"
                        />

                        {/* Animated Underline */}
                        <div className={`h-px mb-4 transition-all duration-300 ${
                          commentFocused ? 'bg-white opacity-100' : 'bg-white/20 opacity-0'
                        } animate-in fade-in`} />

                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setCommentText("")}
                            className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddComment}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg
                              bg-gradient-to-r from-cyan-500 to-blue-500
                              text-white font-semibold
                              hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/25
                              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!commentText.trim() || submittingComment}
                          >
                            {submittingComment ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Posting...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Comment
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center">
                      <p className="text-gray-400">
                        <button onClick={() => router.push('/login')} className="text-violet-400 hover:text-violet-300 font-medium">
                          Login
                        </button>
                        {" "}to leave a comment
                      </p>
                    </div>
                  )}

                  {/* Comments List */}
                  {commentsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader />
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 text-center">
                      <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No comments yet. Be the first!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {comments.map((comment, index) => (
                        <div
                          key={comment.id || index}
                          className="flex items-start gap-4
                            animate-in fade-in slide-in-from-bottom-2"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Avatar */}
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-violet-500/20">
                              {comment.user?.name?.charAt(0) || comment.author?.name?.charAt(0) || "U"}
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Header */}
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-semibold text-white truncate">{comment.user?.name || comment.author?.name || "Anonymous"}</span>
                                  <span className="text-xs text-gray-500 flex-shrink-0">
                                    {formatDate(comment.createdAt || new Date())}
                                  </span>
                                </div>
                                {user && (comment.userId === user.id || comment.user?.id === user.id) && (
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors p-1 flex-shrink-0 hover:scale-125"
                                    title="Delete comment"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              {/* Body */}
                              <p className="text-gray-300 leading-relaxed">{comment.content || comment.body}</p>
                            </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostDetail;

