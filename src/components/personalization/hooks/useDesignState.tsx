import { useState } from "react";
import { Text } from "fabric";
import { UploadedImage } from "../types";
import { ContentItem } from "../types/contentItem";

export const useDesignState = () => {
  const [textColor, setTextColor] = useState("#000000");
  const [activeText, setActiveText] = useState<Text | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    const cached = localStorage.getItem('personalization-content');
    return cached ? JSON.parse(cached) : [];
  });
  const [selectedSide, setSelectedSide] = useState<string>('front');
  const [fontSize, setFontSize] = useState(16);
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'center'
  });
  const [text, setText] = useState("");

  return {
    textColor,
    setTextColor,
    activeText,
    setActiveText,
    uploadedImages,
    setUploadedImages,
    contentItems,
    setContentItems,
    selectedSide,
    setSelectedSide,
    fontSize,
    setFontSize,
    textStyle,
    setTextStyle,
    text,
    setText
  };
};