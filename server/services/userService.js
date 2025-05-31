
const databaseService = require('../config/database');

class UserService {
  constructor() {
    this.supabaseAdmin = databaseService.getAdminClient();
  }

  async getAllUsers() {
    try {
      // Fetch users from Supabase Auth API using service role
      const response = await fetch(
        `${process.env.SUPABASE_URL}/auth/v1/admin/users`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const { users } = await response.json();

      // Check admin status for each user
      for (const user of users) {
        const { data: isAdmin, error } = await this.supabaseAdmin.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin',
        });
        
        if (error) {
          console.warn(`Error checking admin status for user ${user.id}:`, error.message);
        }
        
        user.isAdmin = !!isAdmin;
      }

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const response = await fetch(
        `${process.env.SUPABASE_URL}/auth/v1/admin/users/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const user = await response.json();

      // Check admin status
      const { data: isAdmin, error } = await this.supabaseAdmin.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });
      
      if (error) {
        console.warn(`Error checking admin status for user ${user.id}:`, error.message);
      }
      
      user.isAdmin = !!isAdmin;

      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async makeUserAdmin(userId) {
    try {
      const { error } = await this.supabaseAdmin.rpc('make_user_admin', {
        _user_id: userId,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error making user admin:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
