const { prisma } = require('@/config/db/db');

// Toggle like (like/unlike)
const toggleLike = async (userId, postId) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: Number(userId),
        postId: Number(postId)
      }
    }
  });

  if (existingLike) {
    // Unlike - remove the like
    await prisma.like.delete({
      where: { id: existingLike.id }
    });
    return { liked: false };
  } else {
    // Like - add the like
    await prisma.like.create({
      data: {
        userId: Number(userId),
        postId: Number(postId)
      }
    });
    return { liked: true };
  }
};

// Check if user liked a post
const hasUserLikedPost = async (userId, postId) => {
  const like = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: Number(userId),
        postId: Number(postId)
      }
    }
  });
  return !!like;
};

// Get liked posts by user
const getLikedPostsByUserId = async (userId) => {
  const likes = await prisma.like.findMany({
    where: { userId: Number(userId) },
    include: {
      post: {
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { likes: true, comments: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return likes.map(like => ({
    ...like.post,
    likedAt: like.createdAt
  }));
};

// Get like count for a post
const getLikeCount = async (postId) => {
  return await prisma.like.count({
    where: { postId: Number(postId) }
  });
};

module.exports = {
  toggleLike,
  hasUserLikedPost,
  getLikedPostsByUserId,
  getLikeCount
};
