import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

declare module 'fabric' {
  interface Object extends FabricObject {
    lastScaleX?: number;
    lastScaleY?: number;
  }
}

declare global {
  type Canvas = FabricCanvas;
}

export {};