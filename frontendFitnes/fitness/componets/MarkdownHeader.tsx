import React from "react";
import ReactMarkdown from "react-markdown";


interface MarkdownHeaderProps {
  content: string;
}


export function MarkdownHeader({ content }: MarkdownHeaderProps) {
  return (
    <div className="bg-light border rounded-3 p-4 mb-4">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
