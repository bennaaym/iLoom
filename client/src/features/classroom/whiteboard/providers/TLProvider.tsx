"use client";
import {
  Tldraw,
  DefaultStylePanel,
  getIndicesBetween,
  TLShapePartial,
  TLImageShape,
  sortByIndex,
} from "tldraw";
import { useSelf } from "@liveblocks/react/suspense";
import { useTLStore } from "../hooks";
import "tldraw/tldraw.css";
import { Pdf } from "../hooks/useLoadPdf";
import { Box } from "@mui/material";
import { useEffect } from "react";

interface Props {
  pdf: Pdf | null;
}

export const TLProvider = ({ pdf }: Props) => {
  const { id, info, isReadonly } = useSelf((me) => ({
    id: me.id,
    info: me.info,
    isReadonly: !me.canWrite,
  }));

  const store = useTLStore({
    user: { id, name: info?.name },
  });

  useEffect(() => {
    return () => {
      store.store?.clear();
    };
  }, []);

  return (
    <Tldraw
      store={store}
      components={{
        MainMenu: null,
        MenuPanel: null,
        Background: () => (
          <Box width="100%" height="100%" bgcolor="white"></Box>
        ),
        StylePanel: () => <DefaultStylePanel />,
      }}
      onMount={(editor) => {
        editor.updateInstanceState({ isReadonly });
        if (pdf) {
          editor.createAssets(
            pdf.pages.map((page) => ({
              id: page.assetId,
              typeName: "asset",
              type: "image",
              meta: {},
              props: {
                w: page.bounds.w,
                h: page.bounds.h,
                mimeType: "image/png",
                src: page.src,
                name: "page",
                isAnimated: false,
              },
            }))
          );
          editor.createShapes(
            pdf.pages.map(
              (page): TLShapePartial<TLImageShape> => ({
                id: page.shapeId,
                type: "image",
                x: page.bounds.x,
                y: page.bounds.y,
                isLocked: true,
                props: {
                  assetId: page.assetId,
                  w: page.bounds.w,
                  h: page.bounds.h,
                },
              })
            )
          );

          const shapeIds = pdf.pages.map((page) => page.shapeId);
          const shapeIdSet = new Set(shapeIds);

          // Don't let the user unlock the pages
          editor.sideEffects.registerBeforeChangeHandler(
            "shape",
            (prev, next) => {
              if (!shapeIdSet.has(next.id)) return next;
              if (next.isLocked) return next;
              return { ...prev, isLocked: true };
            }
          );

          const makeSureShapesAreAtBottom = () => {
            const shapes = shapeIds
              .map((id) => editor.getShape(id)!)
              .sort(sortByIndex);
            const pageId = editor.getCurrentPageId();

            const siblings = editor.getSortedChildIdsForParent(pageId);
            const currentBottomShapes = siblings
              .slice(0, shapes.length)
              .map((id) => editor.getShape(id)!);

            if (
              currentBottomShapes.every((shape, i) => shape.id === shapes[i].id)
            )
              return;

            const otherSiblings = siblings.filter((id) => !shapeIdSet.has(id));
            const bottomSibling = otherSiblings[0];
            const lowestIndex = editor.getShape(bottomSibling)!.index;

            const indexes = getIndicesBetween(
              undefined,
              lowestIndex,
              shapes.length
            );
            editor.updateShapes(
              shapes.map((shape, i) => ({
                id: shape.id,
                type: shape.type,
                isLocked: shape.isLocked,
                index: indexes[i],
              }))
            );
          };

          makeSureShapesAreAtBottom();
          editor.sideEffects.registerAfterCreateHandler(
            "shape",
            makeSureShapesAreAtBottom
          );
          editor.sideEffects.registerAfterChangeHandler(
            "shape",
            makeSureShapesAreAtBottom
          );
        }
      }}
      autoFocus
    />
  );
};
