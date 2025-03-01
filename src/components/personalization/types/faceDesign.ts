
export interface FaceDesign {
  faceId: string;
  canvasImage: string;
  productName?: string;
  textElements: Array<{
    content: string;
    font: string;
    color: string;
    size: number;
    style: {
      bold: boolean;
      italic: boolean;
      underline: boolean;
      align: string;
    };
  }>;
  uploadedImages: Array<{
    name: string;
    url: string;
  }>;
}
