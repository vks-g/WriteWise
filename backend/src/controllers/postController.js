const {
  getAllPosts,
  getTrendingPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
  searchPosts
} = require('@/services/postService');
const { hasUserLikedPost } = require('@/services/likeService');

// GET /posts - Get all posts with filters
const GetAllPosts = async (req, res) => {
  try {
    const { search, tag, sort, page, limit, filter } = req.query;
    const result = await getAllPosts({
      search: search || filter,
      tag,
      sort,
      page: page || 1,
      limit: limit || 10
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// GET /posts/trending - Get trending posts
const GetTrendingPosts = async (req, res) => {
  try {
    const { limit } = req.query;
    const posts = await getTrendingPosts(limit || 10);
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
};

// GET /posts/search - Search posts
const SearchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const posts = await searchPosts(q);
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
};

// GET /posts/:id - Get single post
const GetPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if current user has liked the post
    let hasLiked = false;
    if (req.user) {
      hasLiked = await hasUserLikedPost(req.user.id, id);
    }

    res.status(200).json({ post: { ...post, hasLiked } });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// GET /posts/user/:id - Get posts by user
const GetPostsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await getPostsByUserId(id);
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};

// POST /posts - Create post
const CreatePost = async (req, res) => {
  try {
    const { title, content, summary, coverImage, tags, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const post = await createPost({
      title,
      content: content || '',
      summary,
      coverImage,
      tags: tags || [],
      status: status || 'draft',
      authorId: req.user.id
    });

    res.status(201).json({ post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// PUT /posts/:id - Update post
const UpdatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, coverImage, tags, status } = req.body;

    // Check if post exists and user is the owner
    const existingPost = await getPostById(id);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const post = await updatePost(id, {
      title,
      content,
      summary,
      coverImage,
      tags,
      status
    });

    res.status(200).json({ post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// DELETE /posts/:id - Delete post
const DeletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists and user is the owner
    const existingPost = await getPostById(id);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await deletePost(id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

module.exports = {
  GetAllPosts,
  GetTrendingPosts,
  SearchPosts,
  GetPostById,
  GetPostsByUser,
  CreatePost,
  UpdatePost,
  DeletePost
};
