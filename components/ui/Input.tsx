"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            {label}
            {props.required && (
              <span style={{ color: "#ef4444", marginLeft: "0.25rem" }}>*</span>
            )}
          </label>
        )}

        <div style={{ position: "relative" }}>
          {leftIcon && (
            <span
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn("input", className)}
            style={{
              paddingLeft: leftIcon ? "2.5rem" : undefined,
              paddingRight: rightIcon ? "2.5rem" : undefined,
              borderColor: error ? "#ef4444" : undefined,
            }}
            {...props}
          />

          {rightIcon && (
            <span
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444" }}>{error}</p>
        )}
        {hint && !error && (
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
