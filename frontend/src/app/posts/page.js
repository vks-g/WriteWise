"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Calendar,
  Heart,
  ArrowRight,
  Feather,
  TrendingUp,
  SlidersHorizontal,
  Sparkles,
  User,
  ChevronRight,
  Lock,
} from "lucide-react";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Silk from "@/components/animated/Silk";
import AppleCardsCarousel, { Carousel, Card, BlurImage } from "@/components/ui/apple-cards-carousel";
import ContainerCover from "@/components/ui/container-cover";
import Loader, { LoaderOne, LoaderTwo, LoaderThree, LoaderFour, LoaderFive } from "@/components/ui/loader";

const PublicPosts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, getCurrentUser } = useAuth();

  // State management
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryPosts, setCategoryPosts] = useState([]);

  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const searchTimeout = useRef(null);

  // Handle search - debounced search as user types
  const handleSearch = (query) => {
    console.log("handleSearch called with:", query);
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query || !query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Debounce the search - wait 300ms after user stops typing
    searchTimeout.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        console.log("Making search request for:", query.trim());
        const response = await axios.get(`/posts/search?q=${encodeURIComponent(query.trim())}`);
        console.log("Search response:", response.data);
        setSearchResults(response.data?.posts || []);
        console.log("Search results set:", response.data?.posts?.length || 0, "posts");
      } catch (err) {
        console.log("Search error:", err.message);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Show welcome toast if user just logged in
  useEffect(() => {
    const isLoggedIn = searchParams.get("isLoggedIn");
    if (isLoggedIn === "true") {
      toast.success("Welcome! You're now logged in 🎉");
      // Clear the URL parameter without refreshing the page
      router.replace("/posts", { scroll: false });
    }
  }, [searchParams, router]);

  // Check authentication status on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        await getCurrentUser();
      } catch (err) {
        console.log("Auth check error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [getCurrentUser]);

  // Fetch trending posts
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoadingTrending(true);
        // Use trending endpoint as per API spec
        const response = await axios.get("/posts/trending?limit=10");
        setTrendingPosts(response.data?.posts || []);
      } catch (err) {
        console.log("Trending posts fetch:", err.message);
        setTrendingPosts([]);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, []);

  // Fetch all posts and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingAll(true);
        const postsResponse = await axios.get("/posts");
        setAllPosts(postsResponse.data?.posts || []);

        // Extract unique categories from posts
        const uniqueCategories = Array.from(
          new Set(
            postsResponse.data?.posts
              ?.flatMap(post => post.tags || [])
              .filter(Boolean) || []
          )
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.log("Posts/categories fetch:", err.message);
        setAllPosts([]);
        setCategories([]);
      } finally {
        setLoadingAll(false);
      }
    };
    fetchData();
  }, []);

  // Fetch posts by category
  const handleCategoryClick = async (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setCategoryPosts([]);
      return;
    }

    setSelectedCategory(category);
    setLoadingCategory(true);

    try {
      const response = await axios.get(`/posts?tag=${category}`);
      setCategoryPosts(response.data?.posts || []);
    } catch (err) {
      console.log("Category posts fetch:", err.message);
      setCategoryPosts([]);
    } finally {
      setLoadingCategory(false);
    }
  };

  // Get posts to display - use search results if searching, otherwise show all posts
  const getDisplayedPosts = () => {
    console.log("getDisplayedPosts called - searchQuery:", searchQuery, "searchResults:", searchResults.length);
    if (searchQuery && searchQuery.trim()) {
      return searchResults;
    }
    return allPosts;
  };

  // Check if we're in search mode
  const isInSearchMode = searchQuery && searchQuery.trim().length > 0;
  console.log("isInSearchMode:", isInSearchMode, "searchQuery:", searchQuery);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Post card component
  const PostCard = ({ post, index }) => (
    <div
      onClick={() => router.push(`/posts/${post.id}`)}
      className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10
        overflow-hidden cursor-pointer
        hover:bg-white/10 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10 hover:scale-[1.02]
        transition-all duration-300
        animate-in fade-in slide-in-from-bottom-4"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {/* Cover Image */}
      <div className={`aspect-video relative overflow-hidden ${
        post.coverImage ? '' : 'bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30'
      }`}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Feather className="w-12 h-12 text-white/20" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {post.aiAssisted && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/80 backdrop-blur-sm text-white text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          )}
          {post.trending && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/80 backdrop-blur-sm text-white text-xs font-medium">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-2 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {post.excerpt || post.content?.substring(0, 100)}
        </p>

        {/* Author & Date & Likes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-semibold">
              {post.author?.name?.charAt(0) || <User className="w-4 h-4" />}
            </div>
            <span className="text-sm text-gray-400 truncate">{post.author?.name || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Heart className="w-3.5 h-3.5" />
            {post._count?.likes || post.likes || 0}
          </div>
        </div>
      </div>
    </div>
  );

  // Loading skeleton
  const PostSkeleton = () => (
    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden animate-pulse">
      <div className="aspect-video bg-white/10" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10" />
            <div className="h-3 bg-white/10 rounded w-20" />
          </div>
          <div className="h-3 bg-white/10 rounded w-16" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <Silk speed={2} scale={0.7} color="#8b5cf6" noiseIntensity={0.7} rotation={0.2} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/80" />
      </div>

      <div className="relative z-10">
        {/* Auth Popup - Only show when not authenticated and auth check is complete */}
        {!authLoading && !isAuthenticated && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
            <div className="w-full max-w-md rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-8 shadow-2xl shadow-violet-500/20">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Explore Posts
              </h2>
              <p className="text-center text-gray-400 mb-8">
                Create an account or sign in to discover amazing blog posts, engage with writers, and share your voice with the community.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/signup")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500 hover:from-blue-600 hover:via-purple-600 hover:to-violet-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-3 rounded-xl border border-white/20 hover:border-violet-500/50 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-300"
                >
                  Sign In
                </button>
              </div>

              <p className="text-center text-gray-500 text-sm mt-6">
                Join WriteWise to unlock full access
              </p>
            </div>
          </div>
        )}

        {/* Top Bar - Only show when authenticated */}
        {isAuthenticated && (
          <div className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-md bg-blue-gray-900/20">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/">
                <Image src="/logo.svg" alt="WriteWise Logo" width={130} height={130} className="brightness-0 invert" />
              </Link>

              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:block flex-1 max-w-xs mx-8">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-200
                    focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-violet-500/50 bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                Dashboard
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Trending Section - Hide when searching */}
          {!isInSearchMode && (loadingTrending ? (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Trending Now</h2>
              <Loader />
            </div>
          ) : trendingPosts.length > 0 ? (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
                🔥 Trending Now
              </h2>
              <AppleCardsCarousel
                cards={trendingPosts.map(post => ({
                  ...post,
                  src: post.coverImage || post.thumbnail || '/default-post.png'
                }))}
                onCardClick={(card) => router.push(`/posts/${card.id}`)}
              />
            </div>
          ) : null)}

          {/* Mobile Search Bar - Only on mobile when authenticated */}
          {isAuthenticated && (
            <div className="md:hidden mb-8">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500
                  focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          )}

          {/* Categories Section - Hide when searching */}
          {!isInSearchMode && categories.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Filter by Category</h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-300 flex-shrink-0 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-violet-500/30'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                {selectedCategory && (
                  <button
                    onClick={() => handleCategoryClick(selectedCategory)}
                    className="px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-300 flex-shrink-0 bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Posts Section - Hide when searching */}
          {!isInSearchMode && selectedCategory && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8">Posts in &ldquo;{selectedCategory}&rdquo;</h3>
              {loadingCategory ? (
                <Loader />
              ) : categoryPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPosts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No posts found in this category</p>
                </div>
              )}
            </div>
          )}

          {/* All Posts Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              {isInSearchMode ? `Search Results for "${searchQuery}"` : selectedCategory ? "Other Posts" : "All Posts"}
            </h2>

            {(loadingAll && !selectedCategory && !isInSearchMode) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {isSearching ? (
                  <div className="flex justify-center py-12">
                    <Loader />
                  </div>
                ) : getDisplayedPosts().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getDisplayedPosts().map((post, index) => (
                      <PostCard key={post.id} post={post} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-400 text-lg mb-4">
                      {searchQuery ? `No posts match "${searchQuery}"` : "No posts found"}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="px-6 py-2 rounded-lg border border-white/20 hover:border-violet-500/50 bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPosts;
