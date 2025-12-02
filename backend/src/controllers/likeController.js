const { toggleLike, getLikedPostsByUserId, getLikeCount } = require('@/services/likeService');

// POST /likes/:postId - Like/unlike a post
const ToggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const result = await toggleLike(userId, postId);
    const likeCount = await getLikeCount(postId);

    res.status(200).json({
      ...result,
      likeCount
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// GET /likes/user/:id - Get liked posts by user
const GetLikedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await getLikedPostsByUserId(id);
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    res.status(500).json({ error: 'Failed to fetch liked posts' });
  }
};

module.exports = {
  ToggleLike,
  GetLikedPosts
};
