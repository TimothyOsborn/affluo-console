import { apiClient } from './api'

export interface WebSocketMessage {
  event: string
  data: any
  timestamp: number
}

export interface WebSocketConfig {
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
  companyId?: string
}

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false
  private config: WebSocketConfig = {}

  connect(config: WebSocketConfig): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    this.config = config
    this.isConnecting = true

    try {
      const url = apiClient.getWebSocketUrl()
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        
        // Subscribe to company-specific topic if companyId is provided
        if (config.companyId) {
          this.subscribe(`/topic/forms/${config.companyId}`)
        }
        
        config.onConnect?.()
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          config.onMessage?.(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.isConnecting = false
        
        config.onDisconnect?.()
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
        config.onError?.(error)
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      this.isConnecting = false
      config.onError?.(error as Event)
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(this.config)
      }
    }, delay)
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    this.isConnecting = false
    this.reconnectAttempts = 0
  }

  subscribe(topic: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'subscribe',
        topic,
      }
      this.ws.send(JSON.stringify(message))
    }
  }

  unsubscribe(topic: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'unsubscribe',
        topic,
      }
      this.ws.send(JSON.stringify(message))
    }
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  getConnectionState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }
}

export const websocketService = new WebSocketService()
