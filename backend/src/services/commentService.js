const { prisma } = require('@/config/db/db');

// Get comments for a post
const getCommentsByPostId = async (postId) => {
  return await prisma.comment.findMany({
    where: { postId: Number(postId) },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Get comments by user ID
const getCommentsByUserId = async (userId) => {
  return await prisma.comment.findMany({
    where: { authorId: Number(userId) },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      },
      post: {
        select: { id: true, title: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Create comment
const createComment = async (data) => {
  return await prisma.comment.create({
    data: {
      content: data.content,
      authorId: data.authorId,
      postId: data.postId
    },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

// Get comment by ID
const getCommentById = async (id) => {
  return await prisma.comment.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

// Delete comment
const deleteComment = async (id) => {
  return await prisma.comment.delete({
    where: { id: Number(id) }
  });
};

module.exports = {
  getCommentsByPostId,
  getCommentsByUserId,
  createComment,
  getCommentById,
  deleteComment
};
