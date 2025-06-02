
import { apiClient } from './apiClient';
import { logger } from './logger';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  timestamp: string;
  error?: string;
}

export interface ProjectSuggestionResponse {
  success: boolean;
  suggestion: string;
  timestamp: string;
  error?: string;
}

class ChatAPI {
  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      const response = await apiClient.post<ChatResponse>('/chat/message', {
        message,
        conversationHistory: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      return response;
    } catch (error) {
      logger.error('Failed to send chat message', { error, message });
      throw error;
    }
  }

  async getProjectSuggestion(projectDescription: string): Promise<ProjectSuggestionResponse> {
    try {
      const response = await apiClient.post<ProjectSuggestionResponse>('/chat/project-suggestion', {
        projectDescription
      });

      return response;
    } catch (error) {
      logger.error('Failed to get project suggestion', { error, projectDescription });
      throw error;
    }
  }
}

export const chatAPI = new ChatAPI();
