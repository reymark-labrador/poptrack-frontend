import React from "react"

interface LoadingProps {
  label?: string
}
const Loading: React.FC<LoadingProps> = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center">
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-3 animate-spin"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="#888"
        strokeWidth="4"
        opacity="0.2"
      />
      <path
        d="M38 20a18 18 0 0 1-18 18"
        stroke="#1976d2"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-gray-600">{label}</span>
  </div>
)

export default Loading
