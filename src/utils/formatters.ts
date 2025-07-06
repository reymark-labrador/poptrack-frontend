/**
 * Formats a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Truncates a message to a specified maximum length
 * @param message - The message to truncate
 * @param maxLength - Maximum length before truncation (default: 50)
 * @returns Truncated message with ellipsis if needed
 */
export const truncateMessage = (message: string, maxLength: number = 50) => {
  return message.length > maxLength
    ? `${message.substring(0, maxLength)}...`
    : message
}
