/* eslint-disable @typescript-eslint/no-explicit-any */
export const performanceMonitor = {
  // Track page load times
  trackPageLoad: (pageName: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      console.log(`Page ${pageName} loaded in ${loadTime}ms`);
      
      // Send to analytics service
      // analytics.track('page_load', { page: pageName, loadTime });
    }
  },

  // Track API response times
  trackAPICall: async <T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`API call to ${endpoint} took ${duration.toFixed(2)}ms`);
      
      // Send to monitoring service
      // monitoring.track('api_call', { endpoint, duration, status: 'success' });
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`API call to ${endpoint} failed after ${duration.toFixed(2)}ms`, error);
      
      // monitoring.track('api_call', { endpoint, duration, status: 'error' });
      
      throw error;
    }
  },

  // Track user interactions
  trackUserAction: (action: string, data?: any) => {
    console.log(`User action: ${action}`, data);
    // analytics.track('user_action', { action, ...data });
  },
};