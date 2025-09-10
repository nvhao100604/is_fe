export class GitHubOAuth {
  private clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Ov23li2jcdSsIknaHXoV';
  private redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/oauth-callback';
  private scope = 'read:user user:email';

  generateAuthUrl(isLogin: boolean | undefined): string {
    const state = this.generateState();
    localStorage.setItem('github_oauth_state', state);

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  validateState(state: string): boolean {
    const savedState = localStorage.getItem('github_oauth_state');
    localStorage.removeItem('github_oauth_state');
    return state === savedState;
  }
}

export class GoogleOAuth {
  private clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  
  generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: 'http://localhost:3000/auth/oauth-callback',
      response_type: 'code',
      scope: 'openid email profile',
      state: 'google',
    });

    return `https://accounts.google.com/oauth/v2/auth?${params.toString()}`;
  }
}