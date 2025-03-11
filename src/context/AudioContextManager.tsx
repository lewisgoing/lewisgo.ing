// src/context/AudioContextManager.tsx
class AudioContextManager {
  private static instance: AudioContextManager;
  private audioContext: AudioContext | null = null;
  private sourceNodes: WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>;

  private constructor() {
    this.sourceNodes = new WeakMap(); // Ensure this is initialized in the constructor
    if (typeof window !== 'undefined') {
      this.audioContext = new window.AudioContext();
    }
  }

  public static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  public getAudioContext(): AudioContext {
    if (!this.audioContext) {
      throw new Error('AudioContext has not been initialized or is not available.');
    }
    return this.audioContext;
  }

  public getSourceNodeForElement(element: HTMLMediaElement): MediaElementAudioSourceNode {
    let sourceNode = this.sourceNodes.get(element);
    if (!sourceNode && this.audioContext) {
      sourceNode = this.audioContext.createMediaElementSource(element);
      this.sourceNodes.set(element, sourceNode);
    } else if (!sourceNode) {
      throw new Error('AudioContext is not initialized.');
    }
    return sourceNode;
  }
}

export const audioContextManager = AudioContextManager.getInstance();
