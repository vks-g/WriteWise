"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  Eye,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Link2,
  Code,
  Quote,
  Sparkles,
  X,
  Cloud,
  Wand2,
  BookOpen,
  Tags,
  FileText,
  RefreshCw,
  Check,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/loader";
import { DragDropZone } from "@/components/ImageUpload";

const NewPost = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [showContentImageUpload, setShowContentImageUpload] = useState(false);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [aiLoading, setAiLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("*", "*") },
    { icon: List, label: "List", action: () => insertMarkdown("\n- ", "") },
    { icon: Link2, label: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: Code, label: "Code", action: () => insertMarkdown("`", "`") },
    { icon: Quote, label: "Quote", action: () => insertMarkdown("\n> ", "") },
    { icon: ImageIcon, label: "Image", action: () => setShowContentImageUpload(!showContentImageUpload) },
  ];

  const aiTools = [
    { id: "title", label: "Generate Title", icon: Wand2, endpoint: "/ai/generate-title" },
    { id: "summary", label: "Generate Summary", icon: FileText, endpoint: "/ai/summary" },
    { id: "tags", label: "Suggest Tags", icon: Tags, endpoint: "/ai/tags" },
    { id: "outline", label: "Generate Outline", icon: BookOpen, endpoint: "/ai/outline" },
    { id: "rewrite", label: "Rewrite Content", icon: RefreshCw, endpoint: "/ai/rewrite" },
  ];

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Insert markdown at cursor position
  const insertMarkdown = (before, after) => {
    const textarea = document.querySelector('textarea[name="content"]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newContent);
  };

  // Handle tag input
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // AI Tool handler
  const handleAITool = async (tool) => {
    // For title generation, we need content. For others, we need content or title
    if (tool.id === "title" && !content.trim()) {
      showNotification("Please add some content first to generate a title", "error");
      return;
    }

    if (tool.id !== "title" && !content.trim() && !title.trim()) {
      showNotification("Please add some content first", "error");
      return;
    }

    try {
      setAiLoading(tool.id);
      setShowAIMenu(false);

      console.log("Calling AI endpoint:", tool.endpoint);
      const response = await axios.post(tool.endpoint, {
        content: content.trim() || title.trim(),
        title: title.trim()
      });

      console.log("AI response:", response.data);
      const result = response.data;

      switch (tool.id) {
        case "title":
          if (result.title) {
            setTitle(result.title);
            showNotification("Title generated!");
          } else {
            showNotification("No title generated", "error");
          }
          break;
        case "summary":
          if (result.summary) {
            setSummary(result.summary);
            showNotification("Summary generated!");
          } else {
            showNotification("No summary generated", "error");
          }
          break;
        case "tags":
          if (result.tags && Array.isArray(result.tags)) {
            setTags(result.tags.slice(0, 5));
            showNotification("Tags suggested!");
          } else {
            showNotification("No tags generated", "error");
          }
          break;
        case "outline":
          if (result.outline) {
            setContent(prev => prev + "\n\n" + result.outline);
            showNotification("Outline added!");
          } else {
            showNotification("No outline generated", "error");
          }
          break;
        case "rewrite":
          if (result.content) {
            setContent(result.content);
            showNotification("Content rewritten!");
          } else {
            showNotification("No rewritten content", "error");
          }
          break;
      }
    } catch (err) {
      console.error("AI tool error:", err);
      const errorMessage = err.response?.data?.error || "AI feature failed. Try again later.";
      showNotification(errorMessage, "error");
    } finally {
      setAiLoading(null);
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      showNotification("Please add a title", "error");
      return;
    }

    try {
      setIsSavingDraft(true);
      await axios.post("/posts", {
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim(),
        tags,
        coverImage,
        status: "draft"
      });
      showNotification("Draft saved!");
    } catch (err) {
      console.error("Save draft error:", err);
      showNotification("Failed to save draft", "error");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Publish post
  const handlePublish = async () => {
    if (!title.trim()) {
      showNotification("Please add a title", "error");
      return;
    }
    if (!content.trim()) {
      showNotification("Please add some content", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("/posts", {
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim(),
        tags,
        coverImage,
        status: "published"
      });

      showNotification("Post published!");
      setTimeout(() => {
        router.push("/me");
      }, 1000);
    } catch (err) {
      console.error("Publish error:", err);
      showNotification("Failed to publish post", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Animated Gradient Keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
        }
      `}</style>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-md border shadow-lg
            animate-in slide-in-from-top-2 fade-in duration-300
            ${notification.type === "error"
              ? "bg-red-500/20 border-red-500/30 text-red-300"
              : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
            }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {notification.message}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/me"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              <span className="bg-gradient-to-r from-white via-white to-violet-200 bg-clip-text text-transparent">
                Create New Post
              </span>
            </h1>
          </div>
        </div>

        {/* Draft save button */}
        <button
          onClick={handleSaveDraft}
          disabled={isSavingDraft || !title.trim()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-50 transition-colors self-end sm:self-auto"
        >
          {isSavingDraft ? (
            <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
          ) : (
            <Cloud className="w-4 h-4" />
          )}
          <span>{isSavingDraft ? "Saving..." : "Save Draft"}</span>
        </button>
      </div>

      {/* Main Form Container */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-xl shadow-black/10">
        {/* Action Buttons Row */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all
                ${previewMode
                  ? "bg-violet-500/20 border-violet-500/30 text-violet-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200"
                }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          {/* AI Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAIMenu(!showAIMenu)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full
                bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500
                text-white text-sm font-semibold
                hover:shadow-xl hover:shadow-cyan-500/30
                hover:scale-105
                transition-all duration-100
                relative overflow-hidden group
                animate-gradient"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
              <Sparkles className="w-4 h-4 relative z-10 group-hover:animate-spin" />
              <span className="relative z-10">AI Tools</span>
            </button>

            {/* AI Menu Dropdown */}
            {showAIMenu && (
              <div className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-gradient-to-b from-gray-900/98 to-gray-950/98 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-500/20 z-20 overflow-hidden animate-in fade-in slide-in-from-top-3">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">AI Assistant Tools</h3>
                  </div>
                  <p className="text-xs text-gray-400">Enhance your content with AI</p>
                </div>

                {/* Tools Grid */}
                <div className="p-3 space-y-2">
                  {aiTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleAITool(tool)}
                      disabled={aiLoading !== null}
                      className="w-full flex items-start gap-3 px-4 py-3.5 text-left rounded-lg
                        bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20
                        border border-white/5 hover:border-cyan-500/30
                        transition-all duration-200 group
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {aiLoading === tool.id ? (
                          <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                        ) : (
                          <tool.icon className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-cyan-200 transition-colors">
                          {tool.label}
                        </p>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors line-clamp-1 mt-0.5">
                          {tool.id === 'title' && 'Generate compelling title'}
                          {tool.id === 'summary' && 'Create content summary'}
                          {tool.id === 'tags' && 'Suggest relevant tags'}
                          {tool.id === 'outline' && 'Generate post outline'}
                          {tool.id === 'rewrite' && 'Improve your writing'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer Info */}
                <div className="px-6 py-3 border-t border-white/5 bg-white/2">
                  <p className="text-xs text-gray-500 text-center">Powered by AI</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title Input */}
        <div className="p-4 sm:p-6 border-b border-white/5">
          <input
            type="text"
            placeholder="Enter your title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-4
              text-2xl sm:text-3xl font-bold text-white placeholder:text-gray-600
              focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
              transition-all"
          />
        </div>

        {/* Tags Input */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/5">
          <label className="block text-sm font-medium text-gray-400 mb-2">Tags (max 5)</label>
          <div className="flex flex-wrap items-center gap-2 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl min-h-[48px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                  bg-violet-500/20 border border-violet-500/30
                  text-violet-300 text-sm font-medium
                  shadow-sm shadow-violet-500/10"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={tags.length === 0 ? "Add tags (press Enter to add a tag)" : tags.length >= 5 ? "" : "Add more..."}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              disabled={tags.length >= 5}
              className="flex-1 min-w-[120px] bg-transparent text-white placeholder:text-gray-600 focus:outline-none text-sm disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Summary Input */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/5">
          <label className="block text-sm font-medium text-gray-400 mb-2">Summary</label>
          <textarea
            placeholder="Write a brief summary of your post…"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3
              text-gray-300 placeholder:text-gray-600
              focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
              transition-all resize-none"
          />
        </div>

        {/* Cover Image Upload */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <label className="block text-sm font-medium text-gray-400">Cover Image</label>
            <button
              type="button"
              onClick={() => setShowCoverUpload(!showCoverUpload)}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              {showCoverUpload ? "Upload Image" : "Use URL"}
            </button>
          </div>

          {!showCoverUpload ? (
            <DragDropZone
              onImageUpload={(result) => {
                setCoverImage(result.imageUrl);
                showNotification("Cover image uploaded successfully!");
              }}
              onError={(error) => {
                showNotification(error, "error");
              }}
              maxWidth={600}
              showPreview={true}
            />
          ) : (
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3
                text-gray-300 placeholder:text-gray-600
                focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                transition-all"
            />
          )}

          {coverImage && !showCoverUpload && (
            <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-400 truncate">Cover image added</span>
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="text-xs px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Editor Section */}
        <div className="p-4 sm:p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden shadow-inner">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-3 border-b border-white/10 bg-white/5">
              {toolbarButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <button
                    key={button.label}
                    type="button"
                    onClick={button.action}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                    title={button.label}
                  >
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </button>
                );
              })}
            </div>

            {/* Content Image Upload */}
            {showContentImageUpload && (
              <div className="p-4 border-b border-white/10 bg-white/5 animate-in slide-in-from-top-2 fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Upload Image to Content</span>
                  <button onClick={() => setShowContentImageUpload(false)}>
                    <X className="w-4 h-4 text-gray-500 hover:text-white" />
                  </button>
                </div>
                <DragDropZone
                  onImageUpload={(result) => {
                    const imageMarkdown = `\n![Image](${result.imageUrl})\n`;
                    const textarea = document.querySelector('textarea[name="content"]');
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
                      setContent(newContent);
                    } else {
                      setContent(content + imageMarkdown);
                    }
                    setShowContentImageUpload(false);
                    showNotification("Image inserted into content!");
                  }}
                  onError={(error) => showNotification(error, "error")}
                  maxWidth={800}
                  showPreview={false}
                />
              </div>
            )}

            {/* Content Area */}
            {previewMode ? (
              <div
                className="p-4 sm:p-6 min-h-[350px] prose prose-invert prose-violet max-w-none text-gray-300"
              >
                {content.split('\n').map((line, i) => (
                  <p key={i}>{line || <br />}</p>
                ))}
              </div>
            ) : (
              <div className="p-4 sm:p-6 min-h-[350px]">
                <textarea
                  name="content"
                  placeholder="Start writing your story…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full min-h-[300px] bg-transparent text-gray-300 placeholder:text-gray-600
                    focus:outline-none resize-none leading-relaxed text-base"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="p-4 sm:p-6 pt-2 border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={handleSaveDraft}
            disabled={isSavingDraft || !title.trim()}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20
              text-white font-medium
              hover:bg-white/15 hover:border-white/30
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isSavingDraft ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Cloud className="w-5 h-5" />
            )}
            Save as Draft
          </button>

          <button
            onClick={handlePublish}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="px-8 py-3 rounded-xl
              bg-gradient-to-r from-violet-500 to-fuchsia-500
              text-white font-semibold
              flex items-center justify-center gap-2
              hover:opacity-90 hover:shadow-xl hover:shadow-violet-500/25
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Publish Post
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl bg-violet-500/10 backdrop-blur-sm border border-violet-500/20 p-4">
        <p className="text-sm text-violet-300">
          <span className="font-semibold">💡 Tip:</span> Use the AI Tools button to generate titles, summaries, tags, and more.
          You can also use markdown syntax for formatting: **bold**, *italic*, or `code` inline.
        </p>
      </div>

      {/* Click outside to close AI menu */}
      {showAIMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowAIMenu(false)}
        />
      )}
    </div>
  );
};

export default NewPost;
