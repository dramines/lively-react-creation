
export interface DesignApiPayload {
  designs: {
    [key: string]: {
      faceId: string;
      canvasImage: string;
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
    };
  };
  sizeQuantities: {
    [size: string]: number;
  };
  totalQuantity: number;
}
