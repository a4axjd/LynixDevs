
const { supabase, supabaseAdmin } = require('./supabase');

class DatabaseService {
  constructor() {
    this.supabase = supabase;
    this.supabaseAdmin = supabaseAdmin;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      console.log('Database already initialized');
      return;
    }

    try {
      console.log('Initializing database connection...');
      
      // Test the connection
      const { data, error } = await this.supabase
        .from('admin_settings')
        .select('id')
        .limit(1);

      if (error) {
        throw new Error(`Database connection failed: ${error.message}`);
      }

      console.log('Database connection established successfully');
      this.isInitialized = true;

      // Initialize default settings if needed
      await this.ensureDefaultSettings();
      
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async ensureDefaultSettings() {
    try {
      const { data: existingSettings, error } = await this.supabaseAdmin
        .from('admin_settings')
        .select('*')
        .single();

      if (error && error.code === 'PGRST116') {
        // No settings found, create default ones
        console.log('Creating default admin settings...');
        const { error: insertError } = await this.supabaseAdmin
          .from('admin_settings')
          .insert({
            email_notifications_enabled: true,
            user_registration_enabled: true,
            maintenance_mode: false,
            contact_form_enabled: true,
            newsletter_enabled: true,
          });

        if (insertError) {
          console.error('Failed to create default settings:', insertError);
        } else {
          console.log('Default admin settings created successfully');
        }
      } else if (error) {
        console.error('Error checking admin settings:', error);
      } else {
        console.log('Admin settings already exist');
      }
    } catch (error) {
      console.error('Error in ensureDefaultSettings:', error);
    }
  }

  getClient() {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.supabase;
  }

  getAdminClient() {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.supabaseAdmin;
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

module.exports = databaseService;
