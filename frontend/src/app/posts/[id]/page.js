"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <Image src="/logo.svg" alt="WriteWise" width={120} height={32} className="h-8 w-auto" style={{ filter: "brightness(0) invert(1)" }}/>
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Posts
          </Link>

          {loading ? (
            <LoadingSkeleton />
          ) : !post ? (
            /* Post Not Found State */
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
                <Feather className="w-10 h-10 text-violet-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Post not found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                The post you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                  bg-gradient-to-r from-violet-500 to-fuchsia-500
                  text-white font-medium
                  hover:opacity-90 hover:shadow-xl hover:shadow-violet-500/25
                  transition-all"
              >
                Explore Other Posts
              </Link>
            </div>
          ) : (
            <>
              {/* 1️⃣ Post Header */}
              <header className="mb-8">
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                  style={{ fontWeight: 750 }}
                >
                  {post.title}
                </h1>

                {/* Author & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {post.author?.name?.charAt(0) || <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{post.author?.name || "Anonymous"}</p>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="hidden sm:block text-gray-700">•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.createdAt || new Date())}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {getReadingTime(post.content)} min read
                    </span>
                  </div>
                </div>
              </header>

              {/* Cover Image */}
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 mb-10 overflow-hidden relative">
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Feather className="w-16 h-16 text-white/10" />
                  </div>
                )}
                {/* Subtle aurora glow on edges */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent" />
              </div>

              {/* 2️⃣ Content Body */}
              <article
                className="prose prose-invert prose-lg max-w-none mb-10
                  prose-headings:text-white prose-headings:font-bold
                  prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-white/10
                  prose-blockquote:border-l-violet-500 prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl"
                dangerouslySetInnerHTML={{ __html: post.content || "<p>No content available.</p>" }}
              />

              {/* 3️⃣ Interaction Row */}
              <div className="flex items-center justify-between py-6 border-t border-b border-white/10 mb-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl
                      transition-all duration-300 ${
                      liked
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                    <span className="text-sm font-medium">{likeCount}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{comments.length}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      bookmarked
                        ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => console.log("Share clicked")}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 4️⃣ Comments Section */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Comments {comments.length > 0 && `(${comments.length})`}
                </h2>

                {/* Comment Input */}
                {isAuthenticated ? (
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 mb-6">
                    <textarea
                      placeholder="Share your thoughts..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-transparent text-gray-300 placeholder:text-gray-600
                        focus:outline-none resize-none min-h-[100px] leading-relaxed"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddComment}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                          bg-gradient-to-r from-violet-500 to-fuchsia-500
                          text-white font-medium
                          hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/25
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
                            Post Comment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 mb-6 text-center">
                    <p className="text-gray-400">
                      <button onClick={() => router.push('/login')} className="text-violet-400 hover:text-violet-300">
                        Login
                      </button>
                      {" "}to leave a comment
                    </p>
                  </div>
                )}

                {/* Comments List */}
                {commentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center">
                    <MessageCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment, index) => (
                      <div
                        key={comment.id || index}
                        className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5
                          animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {comment.user?.name?.charAt(0) || comment.author?.name?.charAt(0) || "U"}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Name & Date */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">{comment.user?.name || comment.author?.name || "Anonymous"}</span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(comment.createdAt || new Date())}
                                </span>
                              </div>
                              {/* Delete button for comment owner */}
                              {user && (comment.userId === user.id || comment.user?.id === user.id) && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                  title="Delete comment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {/* Comment Body */}
                            <p className="text-gray-400 leading-relaxed">{comment.content || comment.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
