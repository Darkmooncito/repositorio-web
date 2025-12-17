/**
 * SVG Icon components for the application
 * Professional icons similar to Google Meet style
 */
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Microphone icon
 */
export const MicIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill={color}/>
    <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill={color}/>
  </svg>
);

/**
 * Microphone off icon
 */
export const MicOffIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M19 11H17.3C17.3 11.74 17.14 12.43 16.87 13.05L18.1 14.28C18.66 13.3 19 12.19 19 11ZM14.98 11.17C14.98 11.11 15 11.06 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V5.18L14.98 11.17ZM4.27 3L3 4.27L9.01 10.28V11C9.01 12.66 10.34 14 12 14C12.22 14 12.44 13.97 12.65 13.92L14.31 15.58C13.6 15.91 12.81 16.1 12 16.1C9.24 16.1 6.7 14 6.7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C13.91 17.59 14.77 17.27 15.54 16.82L19.73 21L21 19.73L4.27 3Z" fill={color}/>
  </svg>
);

/**
 * Videocam icon
 */
export const VideocamIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill={color}/>
  </svg>
);

/**
 * Videocam off icon
 */
export const VideocamOffIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 6.5L17 10.5V7C17 6.45 16.55 6 16 6H9.82L21 17.18V6.5ZM3.27 2L2 3.27L4.73 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.21 18 16.39 17.92 16.54 17.82L19.73 21L21 19.73L3.27 2Z" fill={color}/>
  </svg>
);

/**
 * Screen share icon
 */
export const ScreenShareIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 18C21.1 18 21.99 17.1 21.99 16L22 6C22 4.89 21.1 4 20 4H4C2.89 4 2 4.89 2 6V16C2 17.1 2.89 18 4 18H0V20H24V18H20ZM4 6H20V16H4V6ZM13 14.5L16 11.5L13 8.5V10.5H10V12.5H13V14.5Z" fill={color}/>
  </svg>
);

/**
 * Stop screen share icon
 */
export const StopScreenShareIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21.22 18.02L20 16.8V6H9.2L7.2 4H20C21.1 4 22 4.89 22 6V16C22 16.76 21.66 17.44 21.12 17.88L21.22 18.02ZM3.27 2L2 3.27L4.73 6H4C2.89 6 2 6.89 2 8V18C2 19.1 2.89 20 4 20H0V22H18.73L20.73 24L22 22.73L3.27 2ZM4 18V8H6.73L16.73 18H4Z" fill={color}/>
  </svg>
);

/**
 * Call end icon
 */
export const CallEndIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 9C10.5 9 8.25 9.77 6.24 11.12L3.82 8.7C6.65 6.52 9.2 5.5 12 5.5C14.8 5.5 17.35 6.52 20.18 8.7L17.76 11.12C15.75 9.77 13.5 9 12 9ZM6.44 13.32L4.03 10.91C1.47 12.74 0 14.76 0 17V19H4V15.5C4 14.42 5.06 13.65 6.44 13.32ZM12 13.5C13.38 13.5 14.5 14.62 14.5 16V20H9.5V16C9.5 14.62 10.62 13.5 12 13.5ZM17.56 13.32C18.94 13.65 20 14.42 20 15.5V19H24V17C24 14.76 22.53 12.74 19.97 10.91L17.56 13.32Z" fill={color}/>
  </svg>
);

/**
 * Chat icon
 */
export const ChatIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z" fill={color}/>
  </svg>
);

/**
 * Send icon
 */
export const SendIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill={color}/>
  </svg>
);
