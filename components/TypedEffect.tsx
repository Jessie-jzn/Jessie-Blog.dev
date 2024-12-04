import React, { useState, useEffect } from "react";

export interface TypedEffectProps {
  texts: string[]; // 需要展示的文本数组
  typeSpeed?: number; // 打字速度
  deleteSpeed?: number; // 删除速度
  pauseTime?: number; // 完成一条文本后的暂停时间
  loop?: boolean; // 是否循环
  textStyle?: React.CSSProperties;
}

const TypedEffect: React.FC<TypedEffectProps> = ({
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseTime = 1500,
  loop = true,
  textStyle,
}) => {
  const [currentText, setCurrentText] = useState(""); // 当前显示的文本
  const [textIndex, setTextIndex] = useState(0); // 当前正在打的文本索引
  const [isDeleting, setIsDeleting] = useState(false); // 是否在删除字符
  const [isPaused, setIsPaused] = useState(false); // 是否在暂停状态

  useEffect(() => {
    if (isPaused) return; // 暂停状态下不进行任何操作

    const handleTyping = () => {
      const fullText = texts[textIndex]; // 当前要展示的完整文本

      if (isDeleting) {
        // 删除模式：逐个删除字符
        setCurrentText((prev) => fullText.substring(0, prev.length - 1));
        if (currentText === "") {
          // 文本删除完后切换到下一条文本
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        // 打字模式：逐个增加字符
        setCurrentText((prev) => fullText.substring(0, prev.length + 1));
        if (currentText === fullText) {
          // 文本打完后暂停一段时间，开始删除
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, pauseTime);
        }
      }
    };

    const typingSpeed = isDeleting ? deleteSpeed : typeSpeed; // 根据状态选择速度
    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    isPaused,
    textIndex,
    texts,
    typeSpeed,
    deleteSpeed,
    pauseTime,
  ]);

  // 循环结束的处理
  useEffect(() => {
    if (!loop && textIndex === texts.length - 1 && currentText === "") {
      setIsPaused(true); // 停止操作
    }
  }, [currentText, textIndex, texts, loop]);

  return <div style={textStyle}>{currentText}</div>;
};

export default TypedEffect;
