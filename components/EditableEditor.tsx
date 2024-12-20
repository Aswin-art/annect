"use client";
import React, { useCallback, useState } from "react";
import { useTheme } from "next-themes";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { PartialBlock } from "@blocknote/core";

type Props = {
  onChange: (value?: string) => void;
  value?: string;
};

const EditableEditor = ({ onChange, value }: Props) => {
  const [content, setContent] = useState<PartialBlock[]>();
  const editor = useCreateBlockNote({
    initialContent: content,
  });

  const { theme } = useTheme();
  const blockNoteTheme =
    theme === "light" || theme === "dark" ? theme : "light";

  const handleChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);

    if (html == undefined || html == "") {
      return;
    }

    onChange(html);
  };

  useCallback(async () => {
    const blocks = await editor.tryParseHTMLToBlocks(value ?? "");
    setContent(blocks);
  }, [editor, value]);

  return (
    <BlockNoteView
      editor={editor}
      theme={blockNoteTheme}
      onChange={handleChange}
      editable={true}
    />
  );
};

export default EditableEditor;
