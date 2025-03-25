"use client";

import React, { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

/** 
 * MOTION INPUT 
 */
type MotionInputProps = Omit<
  HTMLMotionProps<"input">,
  | "ref"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onTransitionEnd"
  | "onFocus"
  | "onBlur"
  | "onChange"
> & {
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function MotionInput({
  onFocus,
  onBlur,
  onChange,
  ...rest
}: MotionInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.input
      {...rest}
      onFocus={(e) => {
        setIsFocused(true);
        if (onFocus) {
          onFocus(e);
        }
      }}
      onBlur={(e) => {
        setIsFocused(false);
        if (onBlur) {
          onBlur(e);
        }
      }}
      onChange={(e) => {
        if (onChange) {
          onChange(e);
        }
      }}
      animate={{
        outlineColor: isFocused ? ["#FF5733", "#33FF57", "#3357FF"] : "#FF5733",
        outlineWidth: isFocused ? "17px" : "9px",
        scale: typeof rest.value === "string" && rest.value.length > 0 ? 1.05 : 1,
      }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    />
  );
}

/** 
 * MOTION TEXTAREA 
 */
type MotionTextAreaProps = Omit<
  HTMLMotionProps<"textarea">,
  | "ref"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onTransitionEnd"
  | "onFocus"
  | "onBlur"
  | "onChange"
> & {
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export function MotionTextArea({
  onFocus,
  onBlur,
  onChange,
  ...rest
}: MotionTextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.textarea
      {...rest}
      onFocus={(e) => {
        setIsFocused(true);
        if (onFocus) {
          onFocus(e);
        }
      }}
      onBlur={(e) => {
        setIsFocused(false);
        if (onBlur) {
          onBlur(e);
        }
      }}
      onChange={(e) => {
        if (onChange) {
          onChange(e);
        }
      }}
      animate={{
        outlineColor: isFocused ? ["#FF5733", "#33FF57", "#3357FF"] : "#FF5733",
        outlineWidth: isFocused ? "17px" : "9px",
        scale: typeof rest.value === "string" && rest.value.length > 0 ? 1.05 : 1,
      }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    />
  );
}

/** 
 * MOTION SELECT 
 */
type MotionSelectProps = Omit<
  HTMLMotionProps<"select">,
  | "ref"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onTransitionEnd"
  | "onFocus"
  | "onBlur"
  | "onChange"
> & {
  onFocus?: React.FocusEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

export function MotionSelect({
  onFocus,
  onBlur,
  onChange,
  ...rest
}: MotionSelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.select
      {...rest}
      onFocus={(e) => {
        setIsFocused(true);
        if (onFocus) {
          onFocus(e);
        }
      }}
      onBlur={(e) => {
        setIsFocused(false);
        if (onBlur) {
          onBlur(e);
        }
      }}
      onChange={(e) => {
        if (onChange) {
          onChange(e);
        }
      }}
      animate={{
        outlineColor: isFocused ? ["#FF5733", "#33FF57", "#3357FF"] : "#FF5733",
        outlineWidth: isFocused ? "17px" : "9px",
        scale:
          typeof rest.value === "string" && rest.value.trim() !== "" ? 1.05 : 1,
      }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    />
  );
}

/** 
 * MOTION FILE INPUT 
 */
type MotionFileInputProps = Omit<
  HTMLMotionProps<"input">,
  | "ref"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onTransitionEnd"
  | "type"
  | "onFocus"
  | "onBlur"
  | "onChange"
> & {
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function MotionFileInput({
  onFocus,
  onBlur,
  onChange,
  ...rest
}: MotionFileInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.input
      {...rest}
      type="file"
      onFocus={(e) => {
        setIsFocused(true);
        if (onFocus) {
          onFocus(e);
        }
      }}
      onBlur={(e) => {
        setIsFocused(false);
        if (onBlur) {
          onBlur(e);
        }
      }}
      onChange={(e) => {
        if (onChange) {
          onChange(e);
        }
      }}
      animate={{
        outlineColor: isFocused ? ["#FF5733", "#33FF57", "#3357FF"] : "#FF5733",
        outlineWidth: isFocused ? "17px" : "9px",
        scale: isFocused ? 1.05 : 1,
      }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    />
  );
}
