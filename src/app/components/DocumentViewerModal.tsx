"use client";

import useOnClickOutside from "@/hooks/hooks/useOnClickOutside";
import { Inter } from "next/font/google";
import React, { useMemo, useRef } from "react";
import { document } from "./DocumentsSection";
import { sentenceCase } from "../../../utils";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const interBold = Inter({ subsets: ["latin"], weight: "600" });
const interLight = Inter({ subsets: ["latin"], weight: "400" });

const DocumentViewerModal = ({
  openPreviewModal,
  setOpenPreviewModal,
  onDownloadDocument,
  document,
  documents,
}: {
  openPreviewModal: boolean;
  setOpenPreviewModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDownloadDocument: (filePath: string) => void;
  document: document;
  documents?: any;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const closePreview = () => {
    setOpenPreviewModal(false);
  };

  useOnClickOutside(ref, () => setOpenPreviewModal(false));

  const defaultZoom = useMemo(() => {
    if (window.innerWidth > 900) return 0.7;
    if (window.innerWidth > 600 && window.innerWidth < 900) return 0.9;
    if (window.innerWidth > 300 && window.innerWidth < 700) return 1.2;
  }, [window]);

  return (
    <div className="fixed h-screen w-full top-0 left-0 flex items-center justify-center z-10">
      <div className="overlay h-full w-full bg-white fixed -z-10"></div>

      <div
        className="content w-full lg:w-[60%] bg-white h-[90vh] max-h-[90vh] relative z-50"
        ref={ref}
      >
        <div className="max-h-[90%] h-[90%] px-2 lg:px-4 overflow-y-auto flex flex-col gap-4">
          <h1 className={`${interBold.className} `}>
            {sentenceCase(document.fileName)}
          </h1>

          <p className={`${interLight.className} text-[#101828]`}>
            {document.category}
          </p>
          <DocViewer
            documents={documents}
            pluginRenderers={DocViewerRenderers}
            config={{
              header: {
                disableHeader: true,
              },
              pdfZoom: {
                defaultZoom: defaultZoom as number,
                zoomJump: 0.2,
              },
              pdfVerticalScrollByDefault: true,
            }}
          />
        </div>
        <div className="absolute bottom-4 left-0 w-full flex items-center justify-end px-4 lg:px-10 gap-4 drop-shadow-2xl pt-6 min-h-max">
          <button
            className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] rounded-lg min-w-max"
            onClick={closePreview}
          >
            Cancel
          </button>

          <button
            className="flex items-center justify-center gap-4 border-2 px-4 py-2 bg-[#7F56D9] rounded-lg text-[#ffffff] min-w-max"
            onClick={() => onDownloadDocument(document.downloadURL)}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
