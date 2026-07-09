"use client";

import { TrailingBlockPlugin } from "platejs";
import type { Value } from "platejs";
import { useEditorRef } from "platejs/react";
import type { TPlateEditor } from "platejs/react";

import { AIKit } from "#/components/editor/plugins/ai-kit.tsx";
import { AlignKit } from "#/components/editor/plugins/align-kit.tsx";
import { AutoformatKit } from "#/components/editor/plugins/autoformat-kit.tsx";
import { BasicBlocksKit } from "#/components/editor/plugins/basic-blocks-kit.tsx";
import { BasicMarksKit } from "#/components/editor/plugins/basic-marks-kit.tsx";
import { BlockMenuKit } from "#/components/editor/plugins/block-menu-kit.tsx";
import { BlockPlaceholderKit } from "#/components/editor/plugins/block-placeholder-kit.tsx";
import { CalloutKit } from "#/components/editor/plugins/callout-kit.tsx";
import { CodeBlockKit } from "#/components/editor/plugins/code-block-kit.tsx";
import { ColumnKit } from "#/components/editor/plugins/column-kit.tsx";
import { CommentKit } from "#/components/editor/plugins/comment-kit.tsx";
import { CopilotKit } from "#/components/editor/plugins/copilot-kit.tsx";
import { CursorOverlayKit } from "#/components/editor/plugins/cursor-overlay-kit.tsx";
import { DateKit } from "#/components/editor/plugins/date-kit.tsx";
import { DiscussionKit } from "#/components/editor/plugins/discussion-kit.tsx";
import { DndKit } from "#/components/editor/plugins/dnd-kit.tsx";
import { DocxKit } from "#/components/editor/plugins/docx-kit.tsx";
import { EmojiKit } from "#/components/editor/plugins/emoji-kit.tsx";
import { ExitBreakKit } from "#/components/editor/plugins/exit-break-kit.tsx";
import { FixedToolbarKit } from "#/components/editor/plugins/fixed-toolbar-kit.tsx";
import { FloatingToolbarKit } from "#/components/editor/plugins/floating-toolbar-kit.tsx";
import { FontKit } from "#/components/editor/plugins/font-kit.tsx";
import { LineHeightKit } from "#/components/editor/plugins/line-height-kit.tsx";
import { LinkKit } from "#/components/editor/plugins/link-kit.tsx";
import { ListKit } from "#/components/editor/plugins/list-kit.tsx";
import { MarkdownKit } from "#/components/editor/plugins/markdown-kit.tsx";
import { MathKit } from "#/components/editor/plugins/math-kit.tsx";
import { MediaKit } from "#/components/editor/plugins/media-kit.tsx";
import { MentionKit } from "#/components/editor/plugins/mention-kit.tsx";
import { SlashKit } from "#/components/editor/plugins/slash-kit.tsx";
import { SuggestionKit } from "#/components/editor/plugins/suggestion-kit.tsx";
import { TableKit } from "#/components/editor/plugins/table-kit.tsx";
import { TocKit } from "#/components/editor/plugins/toc-kit.tsx";
import { ToggleKit } from "#/components/editor/plugins/toggle-kit.tsx";

export const EditorKit = [
    ...CopilotKit,
    ...AIKit,

    // Elements
    ...BasicBlocksKit,
    ...CodeBlockKit,
    ...TableKit,
    ...ToggleKit,
    ...TocKit,
    ...MediaKit,
    ...CalloutKit,
    ...ColumnKit,
    ...MathKit,
    ...DateKit,
    ...LinkKit,
    ...MentionKit,

    // Marks
    ...BasicMarksKit,
    ...FontKit,

    // Block Style
    ...ListKit,
    ...AlignKit,
    ...LineHeightKit,

    // Collaboration
    ...DiscussionKit,
    ...CommentKit,
    ...SuggestionKit,

    // Editing
    ...SlashKit,
    ...AutoformatKit,
    ...CursorOverlayKit,
    ...BlockMenuKit,
    ...DndKit,
    ...EmojiKit,
    ...ExitBreakKit,
    TrailingBlockPlugin,

    // Parsers
    ...DocxKit,
    ...MarkdownKit,

    // UI
    ...BlockPlaceholderKit,
    ...FixedToolbarKit,
    ...FloatingToolbarKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
