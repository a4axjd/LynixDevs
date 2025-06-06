
import { apiClient } from './apiClient';
import { logger } from './logger';

export interface AutomationRule {
  id: string;
  event_type: string;
  template_id: string;
  is_active: boolean;
  conditions: any;
  created_at: string;
  updated_at: string;
  email_templates?: {
    id: string;
    name: string;
    subject: string;
    content: string;
  };
}

export interface AutomationJob {
  id: string;
  rule_id: string;
  recipient_email: string;
  template_variables: any;
  status: 'pending' | 'completed' | 'failed';
  sent_at?: string;
  error_message?: string;
  retry_count: number;
  user_id?: string;
  created_at: string;
  updated_at: string;
  email_automation_rules?: {
    event_type: string;
    email_templates?: {
      name: string;
      subject: string;
    };
  };
}

export interface TriggerAutomationRequest {
  event_type: string;
  recipient_email: string;
  template_variables?: Record<string, string>;
  user_id?: string;
}

export interface CreateRuleRequest {
  event_type: string;
  template_id: string;
  is_active?: boolean;
  conditions?: any;
}

class EmailAutomationAPI {
  // Get all automation rules
  async getRules(): Promise<AutomationRule[]> {
    try {
      const response = await apiClient.get<{ success: boolean; rules: AutomationRule[] }>('/api/email-automation/rules');
      return response.rules || [];
    } catch (error) {
      logger.error('Failed to fetch automation rules', { error });
      throw error;
    }
  }

  // Create new automation rule
  async createRule(data: CreateRuleRequest): Promise<AutomationRule> {
    try {
      const response = await apiClient.post<{ success: boolean; rule: AutomationRule }>('/api/email-automation/rules', data);
      return response.rule;
    } catch (error) {
      logger.error('Failed to create automation rule', { error, data });
      throw error;
    }
  }

  // Update automation rule
  async updateRule(id: string, data: Partial<CreateRuleRequest>): Promise<AutomationRule> {
    try {
      const response = await apiClient.put<{ success: boolean; rule: AutomationRule }>(`/api/email-automation/rules/${id}`, data);
      return response.rule;
    } catch (error) {
      logger.error('Failed to update automation rule', { error, id, data });
      throw error;
    }
  }

  // Delete automation rule
  async deleteRule(id: string): Promise<void> {
    try {
      await apiClient.delete<{ success: boolean; message: string }>(`/api/email-automation/rules/${id}`);
    } catch (error) {
      logger.error('Failed to delete automation rule', { error, id });
      throw error;
    }
  }

  // Trigger automation
  async triggerAutomation(data: TriggerAutomationRequest): Promise<{ success: boolean; job_id?: string; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; job_id?: string; message: string }>('/api/email-automation/trigger', data);
      return response;
    } catch (error) {
      logger.error('Failed to trigger automation', { error, data });
      throw error;
    }
  }

  // Get automation jobs with pagination
  async getJobs(params: {
    page?: number;
    limit?: number;
    status?: string;
    rule_id?: string;
  } = {}): Promise<{
    jobs: AutomationJob[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }> {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.status) searchParams.append('status', params.status);
      if (params.rule_id) searchParams.append('rule_id', params.rule_id);

      const url = `/api/email-automation/jobs${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await apiClient.get<{
        success: boolean;
        jobs: AutomationJob[];
        pagination: { page: number; limit: number; total: number };
      }>(url);

      return {
        jobs: response.jobs || [],
        pagination: response.pagination || { page: 1, limit: 20, total: 0 }
      };
    } catch (error) {
      logger.error('Failed to fetch automation jobs', { error, params });
      throw error;
    }
  }

  // Retry failed job
  async retryJob(jobId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(`/api/email-automation/jobs/${jobId}/retry`);
      return response;
    } catch (error) {
      logger.error('Failed to retry automation job', { error, jobId });
      throw error;
    }
  }

  // Get automation statistics
  async getStats(): Promise<{
    total: number;
    completed: number;
    failed: number;
    pending: number;
  }> {
    try {
      // This would need to be implemented on the backend
      const jobs = await this.getJobs({ limit: 1000 }); // Get recent jobs for stats
      const stats = {
        total: jobs.jobs.length,
        completed: jobs.jobs.filter(j => j.status === 'completed').length,
        failed: jobs.jobs.filter(j => j.status === 'failed').length,
        pending: jobs.jobs.filter(j => j.status === 'pending').length,
      };
      return stats;
    } catch (error) {
      logger.error('Failed to fetch automation stats', { error });
      throw error;
    }
  }
}

export const emailAutomationAPI = new EmailAutomationAPI();
