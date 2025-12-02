"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileEdit, Calendar, Clock, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/loader";

const Drafts = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch user's drafts
  const fetchDrafts = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(`/posts/user/${user.id}`);
      const userPosts = response.data?.posts || response.data || [];
      // Filter only drafts
      const draftPosts = userPosts.filter(post => post.status === "draft");
      setDrafts(draftPosts);
    } catch (err) {
      console.error("Failed to fetch drafts:", err);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.id) {
      fetchDrafts();
    }
  }, [authLoading, isAuthenticated, user?.id, fetchDrafts]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Delete draft handler
  const handleDelete = async (draftId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this draft?")) return;

    try {
      setDeletingId(draftId);
      await axios.delete(`/posts/${draftId}`);
      setDrafts(prev => prev.filter(d => d.id !== draftId));
    } catch (err) {
      console.error("Failed to delete draft:", err);
      alert("Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  };

  // Loading skeleton
  const DraftSkeleton = () => (
    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-6 bg-white/10 rounded-lg w-3/4 mb-2" />
          <div className="h-4 bg-white/10 rounded w-full mb-3" />
          <div className="flex items-center gap-4">
            <div className="h-4 bg-white/10 rounded w-24" />
            <div className="h-4 bg-white/10 rounded w-24" />
          </div>
        </div>
        <div className="h-6 bg-white/10 rounded-lg w-16" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Drafts</h1>
          <p className="text-gray-400">
            Continue working on your unpublished posts
          </p>
        </div>
        <Link
          href="/me/new"
          className="self-end sm:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
        >
          + New Post
        </Link>
      </div>

      {/* Drafts List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <DraftSkeleton key={i} />
          ))}
        </div>
      ) : drafts.length === 0 ? (
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <FileEdit className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No drafts</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">
            All your work is published! Start a new post to begin writing.
          </p>
          <Link
            href="/me/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
          >
            Start New Draft
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft, index) => (
            <div
              key={draft.id}
              onClick={() => router.push(`/me/${draft.id}`)}
              className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5
                hover:bg-white/10 hover:border-violet-500/30
                transition-all cursor-pointer
                animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-violet-200 transition-colors line-clamp-1">
                    {draft.title || "Untitled Draft"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {draft.summary || draft.content?.substring(0, 120) || "No content yet..."}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(draft.createdAt)}
                    </span>
                    {draft.updatedAt && draft.updatedAt !== draft.createdAt && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Updated {formatDate(draft.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30">
                    Draft
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/me/${draft.id}`);
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                      title="Edit draft"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(draft.id, e)}
                      disabled={deletingId === draft.id}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all disabled:opacity-50"
                      title="Delete draft"
                    >
                      {deletingId === draft.id ? (
                        <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drafts;
