const { prisma } = require('@/config/db/db');

// Get user stats for dashboard
const getUserStats = async (userId) => {
  const [postsData, likesReceived, commentsReceived] = await Promise.all([
    // Get post counts
    prisma.post.groupBy({
      by: ['status'],
      where: { authorId: Number(userId) },
      _count: true
    }),
    // Get total likes received on user's posts
    prisma.like.count({
      where: {
        post: {
          authorId: Number(userId)
        }
      }
    }),
    // Get total comments received on user's posts
    prisma.comment.count({
      where: {
        post: {
          authorId: Number(userId)
        }
      }
    })
  ]);

  // Calculate post stats
  let totalPosts = 0;
  let drafts = 0;
  let published = 0;

  postsData.forEach(item => {
    totalPosts += item._count;
    if (item.status === 'draft') {
      drafts = item._count;
    } else if (item.status === 'published') {
      published = item._count;
    }
  });

  return {
    totalPosts,
    drafts,
    published,
    totalLikes: likesReceived,
    totalComments: commentsReceived,
    totalViews: 0 // Placeholder - would need view tracking
  };
};

module.exports = {
  getUserStats
};
