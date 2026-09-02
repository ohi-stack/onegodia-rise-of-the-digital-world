// Service layer to interface with server-side nodes and API endpoints

export interface SystemNodesConfig {
  timestamp: string;
  nodes: {
    gemini: { configured: boolean; model: string; role: string };
    openai: { configured: boolean; model: string; role: string };
    anthropic: { configured: boolean; model: string; role: string };
    xai: { configured: boolean; model: string; role: string };
    accGateway: { configured: boolean; url: string | null; role: string };
    obpNode: { configured: boolean; url: string | null; role: string };
    qrvVerify: { configured: boolean; url: string | null; role: string };
    database: { configured: boolean; role: string };
    stripe: { configured: boolean; publishableKeySet: boolean; publishableKey: string | null; mode: string; role: string };
  };
}

export interface AgentDispatchResponse {
  provider: string;
  model: string;
  response: string;
  agentRole: string;
  isSimulated?: boolean;
  timestamp: string;
  error?: string;
}

export interface ObpStatusResponse {
  connected: boolean;
  nodeUrl: string | null;
  status: string;
  blockHeight?: number;
  epoch?: number;
  peerCount?: number;
  consensus?: string;
  gasPriceGwei?: string;
  timestamp: string;
}

export const networkNodeService = {
  // 1. Get status of all environment nodes
  async getSystemNodes(): Promise<SystemNodesConfig | null> {
    try {
      const res = await fetch('/api/config/system-nodes');
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch system nodes config:', err);
      return null;
    }
  },

  // 2. Dispatch prompt to Multi-Agent AI (Gemini, OpenAI, Anthropic, xAI, ACC)
  async dispatchAgentQuery(
    prompt: string, 
    agentRole = 'AI-Game-Designer', 
    provider: 'auto' | 'gemini' | 'openai' | 'anthropic' | 'xai' | 'acc' = 'auto',
    context = {}
  ): Promise<AgentDispatchResponse> {
    try {
      const res = await fetch('/api/ai/agent-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, agentRole, provider, context })
      });
      return await res.json();
    } catch (err: any) {
      return {
        provider: 'fallback',
        model: 'local-recovery',
        response: `Connection error during agent dispatch: ${err.message}`,
        agentRole,
        isSimulated: true,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 3. Check OBP Blockchain & Node status
  async getObpStatus(): Promise<ObpStatusResponse> {
    try {
      const res = await fetch('/api/obp/status');
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('OBP status check failed:', err);
    }
    return {
      connected: false,
      nodeUrl: null,
      status: 'simulated_offline',
      blockHeight: 1489204,
      epoch: 842,
      peerCount: 38,
      consensus: 'Proof-of-Integrity (PoI)',
      timestamp: new Date().toISOString()
    };
  },

  // 4. Verify Quantum Asset Receipt with QRV Node
  async verifyQrvReceipt(receiptId: string, assetId: string, proofHash?: string) {
    try {
      const res = await fetch('/api/qrv/verify-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptId, assetId, proofHash })
      });
      return await res.json();
    } catch (err: any) {
      return {
        verified: false,
        live: false,
        error: err.message
      };
    }
  },

  // 5. Check Database Health
  async getDatabaseHealth() {
    try {
      const res = await fetch('/api/db/health');
      return await res.json();
    } catch (err: any) {
      return {
        configured: false,
        status: 'disconnected',
        error: err.message
      };
    }
  }
};
