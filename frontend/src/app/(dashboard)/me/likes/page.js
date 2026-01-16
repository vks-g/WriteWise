"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Heart, Calendar, User, MessageCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/loader";

const LikedPosts = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch liked posts
  const fetchLikedPosts = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(`/likes/user/${user.id}`);
      const posts = response.data?.posts || response.data?.likes || response.data || [];
      setLikedPosts(posts);
    } catch (err) {
      console.error("Failed to fetch liked posts:", err);
      setLikedPosts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.id) {
      fetchLikedPosts();
    }
  }, [authLoading, isAuthenticated, user?.id, fetchLikedPosts]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading skeleton
  const PostSkeleton = () => (
    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 animate-pulse">
      <div className="h-6 bg-white/10 rounded-lg w-3/4 mb-3" />
      <div className="h-4 bg-white/10 rounded w-full mb-2" />
      <div className="h-4 bg-white/10 rounded w-2/3 mb-4" />
      <div className="flex items-center gap-4">
        <div className="h-4 bg-white/10 rounded w-24" />
        <div className="h-4 bg-white/10 rounded w-20" />
      </div>
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
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Liked Posts</h1>
        <p className="text-gray-400">Posts you have liked</p>
      </div>

      {/* Liked Posts List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : likedPosts.length === 0 ? (
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-pink-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No liked posts yet</h3>
          <p className="text-gray-400 max-w-sm mx-auto mb-6">
            When you like posts, they will appear here.
          </p>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
          >
            Explore Posts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {likedPosts.map((item, index) => {
            // Handle both formats: direct post or { post, likedAt }
            const post = item.post || item;
            const likedAt = item.likedAt || item.createdAt;

            return (
              <Link
                key={post.id || index}
                href={`/posts/${post.id}`}
                className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden
                  hover:bg-white/10 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10
                  transition-all duration-300
                  animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Cover Image */}
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
                <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-semibold text-white group-hover:text-violet-200 transition-colors line-clamp-2 mb-2">
                  {post.title || "Untitled Post"}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                  {post.summary || post.content?.substring(0, 120) || "No content preview..."}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {post.author?.name || post.user?.name || "Anonymous"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      {post._count?.likes || post.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post._count?.comments || post.comments || 0}
                    </span>
                  </div>
                </div>

                {/* Liked indicator */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-pink-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    Liked {likedAt ? formatDate(likedAt) : ""}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LikedPosts;
