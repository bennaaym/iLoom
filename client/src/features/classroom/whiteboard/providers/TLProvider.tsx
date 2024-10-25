"use client";
import { Tldraw, DefaultStylePanel } from "tldraw";
import { useSelf } from "@liveblocks/react/suspense";
import { Box } from "@mui/material";
import "tldraw/tldraw.css";
import { useTLStore } from "../hooks";

export const TLProvider = () => {
  const { id, info, isReadonly } = useSelf((me) => ({
    id: me.id,
    info: me.info,
    isReadonly: !me.canWrite,
  }));

  const store = useTLStore({
    user: { id, name: info?.name },
  });

  return (
    <Tldraw
      store={store}
      components={{
        StylePanel: () => <DefaultStylePanel />,
      }}
      onMount={(editor) => {
        editor.updateInstanceState({ isReadonly });
      }}
      autoFocus
    />
  );
};
