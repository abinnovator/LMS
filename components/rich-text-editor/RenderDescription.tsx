"use client";

import { generateHTML, JSONContent } from "@tiptap/react";
import { useMemo } from "react";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import parse from "html-react-parser";

export function RenderDescription({
  description,
}: {
  description: JSONContent | string;
}) {
  const output = useMemo(() => {
    let content = description;

    // Handle string input
    if (typeof description === "string") {
      try {
        content = JSON.parse(description);
      } catch (error) {
        // If parsing fails, it's plain text - return it as is
        return description;
      }
    }

    // Handle invalid content
    if (!content || typeof content !== "object" || !(content as any).type) {
      return "";
    }

    return generateHTML(content as JSONContent, [
      StarterKit.configure({
        horizontalRule: false,
      }),
      HorizontalRule,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Underline,
      Typography,
      Superscript,
      Subscript,
    ]);
  }, [description]);

  // If output is plain string, render it directly
  if (typeof output === "string" && !output.includes("<")) {
    return <div>{output}</div>;
  }

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
}
