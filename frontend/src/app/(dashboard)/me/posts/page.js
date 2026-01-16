"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileText, MoreHorizontal, Eye, Heart, Calendar, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/loader";

const MyPosts = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, getCurrentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // Fetch user's posts
  const fetchPosts = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(`/posts/user/${user.id}`);
      const userPosts = response.data?.posts || response.data || [];
      setPosts(userPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.id) {
      fetchPosts();
    }
  }, [authLoading, isAuthenticated, user?.id, fetchPosts]);

  // Handle delete post
  const handleDelete = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setDeletingId(postId);
      await axios.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Show loader while auth is loading
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Posts</h1>
          <p className="text-gray-400">
            Manage and view all your published posts
          </p>
        </div>
        <Link
          href="/me/new"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
        >
          + New Post
        </Link>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">
            Start sharing your ideas with the world. Create your first post and inspire others.
          </p>
          <Link
            href="/me/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              {/* Cover Image Preview */}
              {post.coverImage && (
                <div className="relative h-32 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/me/${post.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-lg font-semibold text-white hover:text-violet-300 transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {post.summary || post.content?.substring(0, 120) || "No content preview..."}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.createdAt || new Date())}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post._count?.likes || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/me/${post.id}`);
                    }}
                    className="p-2 rounded-lg hover:bg-violet-500/20 transition-colors"
                    title="Edit post"
                  >
                    <Edit3 className="w-4 h-4 text-gray-400 hover:text-violet-400" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(post.id, e)}
                    className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                    title="Delete post"
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? (
                      <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
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

export default MyPosts;
