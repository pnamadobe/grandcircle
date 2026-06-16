/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature.
 * Base block: columns
 * Source: https://pnamadobe.github.io/gcdifference/
 * Generated: 2026-06-16
 *
 * Each instance is a two-column grid:
 *   Column 1: div.col-span-1 containing the feature image (picture/img) — image-left.
 *   Column 2: div.col-span-1 containing .mce-content-body with the body paragraph
 *             (may contain <strong>/<em> emphasis).
 *
 * Target table (per library example/description):
 *   | Columns (feature) |
 *   | image | body paragraph |
 */
export default function parse(element, { document, url }) {
  // The source page references images with bare relative paths (e.g.
  // "assets/img/G37628.jpg"). WebImporter.rules.adjustImageUrls only handles
  // "./", "/", "../" or absolute same-host URLs and drops anything else, so
  // absolutize img/source URLs against the page URL up front.
  if (url) {
    element.querySelectorAll('img').forEach((im) => {
      const src = im.getAttribute('src');
      if (src && !/^(https?:|data:|\/)/.test(src)) {
        try { im.setAttribute('src', new URL(src, url).toString()); } catch (e) { /* leave as-is */ }
      }
    });
    element.querySelectorAll('source').forEach((so) => {
      const ss = so.getAttribute('srcset');
      if (ss && !/^(https?:|data:|\/)/.test(ss)) {
        try { so.setAttribute('srcset', new URL(ss, url).toString()); } catch (e) { /* leave as-is */ }
      }
    });
  }

  // The grid has two direct child columns. Order class (md:order-1 / md:order-2)
  // indicates layout position; image is in order-1, text in order-2.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Column 1 (image): prefer the column that actually contains a picture/img.
  const imageCol = columns.find((c) => c.querySelector('picture, img'))
    || element.querySelector('.md\\:order-1')
    || columns[0];

  // Column 2 (body text): prefer the column carrying the rich-text body, with
  // fallbacks for variation across the six feature instances.
  const textCol = columns.find(
    (c) => c !== imageCol && (c.querySelector('.mce-content-body, p')),
  )
    || element.querySelector('.md\\:order-2')
    || columns.find((c) => c !== imageCol);

  // Pull the image. Prefer the bare <img>: the source page's <picture> wrappers
  // carry no usable <source> for our externally-hosted images, and the project's
  // decoratePictures() assumes every <picture> has a <source> (crashes otherwise).
  // Emitting a plain <img> lets the rendering pipeline build the optimized picture.
  const img = imageCol ? imageCol.querySelector('img') : null;
  const picture = imageCol ? imageCol.querySelector('picture') : null;
  const imageContent = img || picture || null;

  // Pull the body paragraph. The rich text lives in .mce-content-body; fall back
  // to the first paragraph in the text column. Preserve inner emphasis markup.
  let bodyContent = null;
  if (textCol) {
    bodyContent = textCol.querySelector('.mce-content-body')
      || textCol.querySelector('p')
      || textCol;
  }

  // Empty-block guard: if neither column produced content, unwrap and bail.
  if (!imageContent && !bodyContent) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    [imageContent || '', bodyContent || ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-feature',
    cells,
  });

  element.replaceWith(block);
}
