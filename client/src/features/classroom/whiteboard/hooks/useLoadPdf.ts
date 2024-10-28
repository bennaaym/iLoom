import axios from "axios";
import {
  AssetRecordType,
  Box,
  createShapeId,
  TLAssetId,
  TLShapeId,
} from "tldraw";

export interface PdfPage {
  src: string;
  bounds: Box;
  assetId: TLAssetId;
  shapeId: TLShapeId;
}

export interface Pdf {
  name: string;
  pages: PdfPage[];
  source: string | ArrayBuffer;
}

const pageSpacing = 32;

export const useLoadPdf = () => {
  const load = async (name: string, source: ArrayBuffer): Promise<Pdf> => {
    const PdfJS = await import("pdfjs-dist");
    PdfJS.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const pdf = await PdfJS.getDocument(source.slice(0)).promise;
    const pages: PdfPage[] = [];

    const canvas = window.document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to create canvas context");

    const visualScale = 1.5;
    const scale = window.devicePixelRatio;

    let top = 0;
    let widest = 0;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: scale * visualScale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const renderContext = {
        canvasContext: context,
        viewport,
      };
      await page.render(renderContext).promise;

      const width = viewport.width / scale;
      const height = viewport.height / scale;
      pages.push({
        src: canvas.toDataURL(),
        bounds: new Box(0, top, width, height),
        assetId: AssetRecordType.createId(),
        shapeId: createShapeId(),
      });
      top += height + pageSpacing;
      widest = Math.max(widest, width);
    }
    canvas.width = 0;
    canvas.height = 0;

    for (const page of pages) {
      page.bounds.x = (widest - page.bounds.width) / 2;
    }

    return {
      name,
      pages,
      source,
    };
  };

  const loadFromUrl = async (name: string, url: string) => {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const pdf = await load(name, response.data);
    return pdf;
  };

  const loadBlank = async () => {
    const response = await axios.get("/assets/blank.pdf", {
      responseType: "arraybuffer",
    });

    const pdf = await load("blankPdf", response.data);
    return pdf;
  };

  return {
    loadBlank,
    loadFromUrl,
  };
};
