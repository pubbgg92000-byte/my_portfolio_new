"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, X, ZoomIn } from "lucide-react";
import { responsiveImage } from "@/lib/responsive-image";

type GalleryImage = { src: string; alt: string; caption: string };

export function ProjectGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [tall, setTall] = useState(false);

  const open = (next: number) => {
    setIndex(next);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (delta: number) =>
      setIndex((current) => (current === null ? current : (current + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setIndex(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (!dialog.open) return;
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("close", onClose);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      dialog.removeEventListener("close", onClose);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [step]);

  const active = index === null ? null : images[index];

  return (
    <>
      <div className="project-gallery-grid">
        {images.map((image, i) => (
          <figure key={image.src}>
            <button type="button" onClick={() => open(i)} aria-label={`Enlarge screenshot: ${image.caption}`}>
              <img {...responsiveImage(image.src)} sizes="(max-width: 780px) 100vw, 50vw" alt={image.alt} loading="lazy" decoding="async" />
              <span aria-hidden="true"><ZoomIn /></span>
            </button>
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="gallery-lightbox"
        aria-label={`${title} screenshots`}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        {active ? (
          <div className="gallery-lightbox-body">
            {loadedSrc !== active.src ? (
              <span className="lightbox-spinner" role="status" aria-label="Loading screenshot">
                <Loader2 className="spin" aria-hidden="true" />
              </span>
            ) : null}
            <img
              key={active.src}
              src={active.src}
              alt={active.alt}
              className={`${loadedSrc === active.src ? "" : "is-loading"}${tall ? " tall" : ""}`.trim() || undefined}
              onLoad={(event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget;
                setTall(naturalHeight / naturalWidth > 1.6);
                setLoadedSrc(active.src);
              }}
            />
            <p>{active.caption}</p>
            <span className="gallery-lightbox-count" aria-live="polite">
              {index! + 1} / {images.length}
            </span>
          </div>
        ) : null}
        <button type="button" className="gallery-lightbox-close" onClick={close} aria-label="Close screenshot viewer">
          <X aria-hidden="true" />
        </button>
        {images.length > 1 ? (
          <>
            <button type="button" className="gallery-lightbox-nav prev" onClick={() => step(-1)} aria-label="Previous screenshot">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className="gallery-lightbox-nav next" onClick={() => step(1)} aria-label="Next screenshot">
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        ) : null}
      </dialog>
    </>
  );
}
