import { type Editor } from "@tiptap/core";
import React from "react";
import { ThemeToggle } from "../tiptap-templates/simple/theme-toggle";
import { Spacer } from "../tiptap-ui-primitive/spacer";
import { ToolbarGroup, ToolbarSeparator } from "../tiptap-ui-primitive/toolbar";
import { BlockquoteButton } from "../tiptap-ui/blockquote-button";
import { CodeBlockButton } from "../tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
} from "../tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "../tiptap-ui/heading-dropdown-menu";
import { LinkPopover, LinkButton } from "../tiptap-ui/link-popover";
import { ListDropdownMenu } from "../tiptap-ui/list-dropdown-menu";
import { MarkButton } from "../tiptap-ui/mark-button";
import { TextAlignButton } from "../tiptap-ui/text-align-button";
import { UndoRedoButton } from "../tiptap-ui/undo-redo-button";

interface iAppProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: iAppProps) => {
  if (!editor) return null;

  return (
    <div className="border border-input rounded-t-lg p-2 bg-card flex flex-wrap">
      <div className="flex flex-wrap gap-1">
        <ToolbarGroup>
          <UndoRedoButton action="undo" editor={editor} />
          <UndoRedoButton action="redo" editor={editor} />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <HeadingDropdownMenu levels={[1, 2, 3, 4]} editor={editor} />
          <ListDropdownMenu
            types={["bulletList", "orderedList", "taskList"]}
            editor={editor}
          />
          <BlockquoteButton editor={editor} />
          <CodeBlockButton editor={editor} />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <MarkButton type="bold" editor={editor} />
          <MarkButton type="italic" editor={editor} />
          <MarkButton type="strike" editor={editor} />
          <MarkButton type="code" editor={editor} />
          <MarkButton type="underline" editor={editor} />
          <ColorHighlightPopover editor={editor} />
          <LinkPopover editor={editor} />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <MarkButton type="superscript" editor={editor} />
          <MarkButton type="subscript" editor={editor} />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <TextAlignButton align="left" editor={editor} />
          <TextAlignButton align="center" editor={editor} />
          <TextAlignButton align="right" editor={editor} />
          <TextAlignButton align="justify" editor={editor} />
        </ToolbarGroup>
      </div>

      <ToolbarSeparator />

      <Spacer />

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </div>
  );
};

export default MenuBar;
