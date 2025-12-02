const { getUserStats } = require('@/services/statsService');
const { getUserById, updateUser, deleteUser } = require('@/services/userService');

// GET /users/me/stats - Get current user's stats
const GetUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await getUserStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};

// GET /users/:id - Get user profile by ID
const GetUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't expose sensitive info
    const { password, ...safeUser } = user;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// PUT /users/:id - Update user profile
const UpdateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is updating their own profile
    if (Number(id) !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const { name, email } = req.body;

    const updatedUser = await updateUser(id, {
      name,
      email
    });

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// DELETE /users/:id - Delete user account
const DeleteUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is deleting their own account
    if (Number(id) !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this account' });
    }

    await deleteUser(id);
    res.clearCookie('token');
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

module.exports = {
  GetUserStats,
  GetUserProfile,
  UpdateUserProfile,
  DeleteUserAccount
};
