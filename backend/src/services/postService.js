const { prisma } = require('@/config/db/db');

// Get all posts with optional filters
const getAllPosts = async ({ search, tag, sort, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const where = {
    status: 'published',
  };

  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Tag filter
  if (tag) {
    where.tags = { has: tag };
  }

  // Determine sort order
  let orderBy = { createdAt: 'desc' };
  if (sort === 'date_asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'date_desc') {
    orderBy = { createdAt: 'desc' };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy,
      skip,
      take: Number(limit),
    }),
    prisma.post.count({ where })
  ]);

  return {
    posts,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// Get trending posts (sorted by likes count)
const getTrendingPosts = async (limit = 10) => {
  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    },
    orderBy: {
      likes: {
        _count: 'desc'
      }
    },
    take: Number(limit),
  });

  return posts;
};

// Get post by ID
const getPostById = async (id) => {
  return await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      },
      comments: {
        include: {
          author: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });
};

// Get posts by user ID
const getPostsByUserId = async (userId) => {
  return await prisma.post.findMany({
    where: { authorId: Number(userId) },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Create post
const createPost = async (data) => {
  return await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      summary: data.summary || null,
      coverImage: data.coverImage || null,
      tags: data.tags || [],
      status: data.status || 'draft',
      authorId: data.authorId
    },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });
};

// Update post
const updatePost = async (id, data) => {
  return await prisma.post.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      content: data.content,
      summary: data.summary,
      coverImage: data.coverImage,
      tags: data.tags,
      status: data.status,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });
};

// Delete post
const deletePost = async (id) => {
  return await prisma.post.delete({
    where: { id: Number(id) }
  });
};

// Search posts
const searchPosts = async (query) => {
  return await prisma.post.findMany({
    where: {
      status: 'published',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } }
      ]
    },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

module.exports = {
  getAllPosts,
  getTrendingPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
  searchPosts
};
