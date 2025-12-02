"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Plus,
  Calendar,
  Heart,
  MessageCircle,
  CheckCircle,
  FileEdit,
  Search,
  TrendingUp,
  Eye,
  Trash2,
  Edit3
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Loader from "@/components/ui/loader";

const MyPosts = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'published' | 'draft'

  // Fetch user's posts
  const fetchPosts = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(`/posts/user/${user.id}`);
      const userPosts = response.data?.posts || response.data || [];
      setPosts(userPosts);
      setFilteredPosts(userPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get("/users/me/stats");
      setStats(response.data || {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalViews: 0
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.id) {
      fetchPosts();
      fetchStats();
    }
  }, [authLoading, isAuthenticated, user?.id, fetchPosts, fetchStats]);

  // Filter posts by tab and search
  const getDisplayedPosts = useCallback(() => {
    let result = posts;

    // Filter by tab
    if (activeTab === "published") {
      result = result.filter(post => post.status === "published");
    } else if (activeTab === "draft") {
      result = result.filter(post => post.status === "draft");
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [posts, activeTab, searchQuery]);

  // Get counts for tabs
  const publishedCount = posts.filter(p => p.status === "published").length;
  const draftCount = posts.filter(p => p.status === "draft").length;

  // Search handler
  const handleSearch = (e) => {
    // Search is handled reactively via getDisplayedPosts
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Delete post handler
  const handleDelete = async (postId, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setDeletingId(postId);
      await axios.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
      setFilteredPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const searchPlaceholders = [
    "Search your posts...",
    "Find by title...",
    "Search by tags...",
    "Look for drafts...",
  ];

  // Stats cards data
  const statsCards = [
    {
      label: "Total Posts",
      value: stats.totalPosts || posts.length,
      icon: FileText,
      gradient: "from-violet-500 to-purple-600"
    },
    {
      label: "Total Likes",
      value: stats.totalLikes || 0,
      icon: Heart,
      gradient: "from-pink-500 to-rose-600"
    },
    {
      label: "Total Comments",
      value: stats.totalComments || 0,
      icon: MessageCircle,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      label: "Total Views",
      value: stats.totalViews || 0,
      icon: Eye,
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  // Loading skeleton component
  const PostSkeleton = () => (
    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-6 bg-white/10 rounded-lg w-3/4" />
        <div className="h-5 bg-white/10 rounded-full w-16" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-2/3" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 bg-white/10 rounded w-20" />
        <div className="h-4 bg-white/10 rounded w-16" />
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 p-12 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
        <FileText className="w-10 h-10 text-violet-400" />
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3">
        You haven&apos;t written anything yet.
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Start sharing your ideas with the world. Create your first post and inspire others with your unique perspective.
      </p>
      <Link
        href="/me/new"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
          bg-gradient-to-r from-violet-500 to-fuchsia-500
          text-white font-medium
          hover:opacity-90 hover:shadow-xl hover:shadow-violet-500/25
          transition-all duration-300"
      >
        <Plus className="w-5 h-5" />
        Start Writing
      </Link>
    </div>
  );

  // Post card component
  const PostCard = ({ post, index }) => {
    const isPublished = post.status === "published";
    const isDeleting = deletingId === post.id;

    return (
      <div
        onClick={() => router.push(`/me/${post.id}`)}
        className={`group relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5
          cursor-pointer overflow-hidden
          hover:bg-white/10 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10
          transition-all duration-300 ease-out
          animate-in fade-in slide-in-from-bottom-4
          ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
        style={{
          animationDelay: `${index * 50}ms`,
          animationFillMode: 'backwards'
        }}
      >
        {/* Title + Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-violet-200 transition-colors line-clamp-2 flex-1">
            {post.title || "Untitled Post"}
          </h3>
          <span
            className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              isPublished
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            {isPublished ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <FileEdit className="w-3 h-3" />
            )}
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>

        {/* Excerpt */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {post.excerpt || post.content?.substring(0, 120) || "No content preview available..."}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.createdAt || new Date())}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              {post._count?.likes || post.likes || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              {post._count?.comments || post.comments || 0}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/me/${post.id}`);
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-violet-500/30 text-gray-400 hover:text-white transition-all"
              title="Edit post"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => handleDelete(post.id, e)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-gray-400 hover:text-red-400 transition-all"
              title="Delete post"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="w-3.5 h-3.5 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Hover glow overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5" />
        </div>
      </div>
    );
  };

  // Show loader while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            My Posts
          </h1>
          <p className="text-gray-400 mt-1">Manage and view all your posts</p>
        </div>
        <Link
          href="/me/new"
          className="self-end sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-white/10 backdrop-blur-md border border-white/20
            text-white font-medium
            hover:bg-white/15 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20
            transition-all duration-300 group"
        >
          <Plus className="w-4 h-4 text-violet-400 group-hover:text-violet-300 transition-colors" />
          New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-5
              hover:bg-white/10 hover:border-white/20 transition-all duration-300
              animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <PlaceholdersAndVanishInput
          placeholders={searchPlaceholders}
          onChange={handleSearchChange}
          onSubmit={handleSearch}
        />
      </div>

      {/* Tab Filters - Only show when there are posts */}
      {!loading && posts.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeTab === "all"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-200"
              }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeTab === "published"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-200"
              }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeTab === "draft"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-200"
              }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            Drafts ({draftCount})
          </button>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : getDisplayedPosts().length === 0 ? (
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center">
          <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {searchQuery
              ? <>No posts found matching &ldquo;{searchQuery}&rdquo;</>
              : `No ${activeTab === "published" ? "published posts" : "drafts"} yet`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {getDisplayedPosts().map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
