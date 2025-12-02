const {
  getCommentsByPostId,
  getCommentsByUserId,
  createComment,
  getCommentById,
  deleteComment
} = require('@/services/commentService');

// GET /comments/:postId - Get comments for a post
const GetCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await getCommentsByPostId(postId);
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// GET /comments/user/:id - Get comments by user
const GetCommentsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await getCommentsByUserId(id);
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({ error: 'Failed to fetch user comments' });
  }
};

// POST /comments/:postId - Add comment to a post
const AddComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const comment = await createComment({
      content: content.trim(),
      authorId: req.user.id,
      postId: Number(postId)
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// DELETE /comments/:id - Delete a comment
const DeleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if comment exists and user is the owner
    const existingComment = await getCommentById(id);
    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (existingComment.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await deleteComment(id);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

module.exports = {
  GetCommentsByPost,
  GetCommentsByUser,
  AddComment,
  DeleteComment
};
