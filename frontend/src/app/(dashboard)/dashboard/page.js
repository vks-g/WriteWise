"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Loader from "@/components/ui/loader";
import { TrendingUp, PenTool, Heart, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const router = useRouter();
  const { user, isAuthenticated, getCurrentUser } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    avgLikesPerPost: 0,
    draftPosts: 0,
  });
  const [authLoading, setAuthLoading] = useState(true);

  console.log(user,'user');

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        await getCurrentUser();
        console.log("User authenticated:", isAuthenticated);
      } catch (err) {
        console.log("Auth check error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [getCurrentUser, isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/posts");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || !user?.id) return;

      try {
        setStatsLoading(true);
        // Call user's posts to compute stats client-side
        const response = await axios.get(`/posts/user/${user.id}`);
        const userPosts = response.data?.posts || [];

        const totalPosts = userPosts.length;
        const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
        const avgLikesPerPost = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0;
        const draftPosts = userPosts.filter(post => post.status === "draft").length;

        setStats({
          totalPosts,
          totalLikes,
          avgLikesPerPost,
          draftPosts,
        });
      } catch (err) {
        console.log("Stats fetch error:", err.message);
        // Keep default stats if fetch fails
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user?.id]);

  // Search placeholders
  const placeholders = [
    "Search your posts...",
    "Find by title...",
    "Jump to a post...",
    "Quick search...",
  ];

  const handleSearch = (e) => {
    const value = e?.target?.value || "";
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      // Navigate to /me page with search query
      router.push(`/me?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, label, value, loading }) => (
    <div className="group rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10
      overflow-hidden hover:bg-white/10 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10
      transition-all duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20
          border border-violet-500/20 flex items-center justify-center
          group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-all duration-300">
          <Icon className="w-6 h-6 text-violet-400" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        {loading ? (
          <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
        ) : (
          <p className="text-4xl font-bold text-white">{value}</p>
        )}
      </div>

      {/* Subtle gradient border effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5" />
      </div>
    </div>
  );

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Show nothing while redirecting unauthenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-10">
      {/* 1️⃣ Search Bar */}
      <div className="w-full max-w-3xl mx-auto">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleSearch}
          onSubmit={handleSearchSubmit}
        />
      </div>

      {/* 2️⃣ Welcome Section */}
      <div className="pt-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-white via-white to-violet-200 bg-clip-text text-transparent drop-shadow-sm">
            Welcome back, {user?.name || "Writer"}! 👋
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Here&rsquo;s your writing dashboard overview
        </p>
      </div>

      {/* 3️⃣ Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={PenTool}
          label="Total Posts"
          value={stats.totalPosts}
          loading={statsLoading}
        />
        <StatCard
          icon={Heart}
          label="Total Likes Received"
          value={stats.totalLikes}
          loading={statsLoading}
        />
        <StatCard
          icon={BarChart3}
          label="Avg Likes per Post"
          value={stats.avgLikesPerPost}
          loading={statsLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Draft Posts"
          value={stats.draftPosts}
          loading={statsLoading}
        />
      </div>

      {/* 4️⃣ Quick Actions Section */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/dashboard/me/new")}
            className="group rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10
              border border-violet-500/20 hover:border-violet-500/50
              p-6 text-left transition-all duration-300
              hover:bg-gradient-to-r hover:from-violet-500/20 hover:to-fuchsia-500/20
              hover:shadow-lg hover:shadow-violet-500/20">
            <div className="flex items-center gap-3 mb-2">
              <PenTool className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-semibold text-white">Create New Post</h3>
            </div>
            <p className="text-sm text-gray-400">Start writing your next post</p>
          </button>

          <button
            onClick={() => router.push("/me/posts")}
            className="group rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10
              border border-blue-500/20 hover:border-blue-500/50
              p-6 text-left transition-all duration-300
              hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-violet-500/20
              hover:shadow-lg hover:shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <PenTool className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">My Posts</h3>
            </div>
            <p className="text-sm text-gray-400">View and manage all your posts</p>
          </button>

          <button
            onClick={() => router.push("/posts")}
            className="group rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10
              border border-fuchsia-500/20 hover:border-fuchsia-500/50
              p-6 text-left transition-all duration-300
              hover:bg-gradient-to-r hover:from-fuchsia-500/20 hover:to-pink-500/20
              hover:shadow-lg hover:shadow-fuchsia-500/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-fuchsia-400" />
              <h3 className="text-lg font-semibold text-white">Explore Posts</h3>
            </div>
            <p className="text-sm text-gray-400">Discover posts from the community</p>
          </button>
        </div>
      </div>

      {/* 5️⃣ Placeholder for Future Sections */}
      <div className="pt-8 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8
          text-center">
          <p className="text-gray-400">Your recent posts activity will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
