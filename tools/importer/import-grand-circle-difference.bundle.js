/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-grand-circle-difference.js
  var import_grand_circle_difference_exports = {};
  __export(import_grand_circle_difference_exports, {
    default: () => import_grand_circle_difference_default
  });

  // tools/importer/parsers/columns-feature.js
  function parse(element, { document, url }) {
    if (url) {
      element.querySelectorAll("img").forEach((im) => {
        const src = im.getAttribute("src");
        if (src && !/^(https?:|data:|\/)/.test(src)) {
          try {
            im.setAttribute("src", new URL(src, url).toString());
          } catch (e) {
          }
        }
      });
      element.querySelectorAll("source").forEach((so) => {
        const ss = so.getAttribute("srcset");
        if (ss && !/^(https?:|data:|\/)/.test(ss)) {
          try {
            so.setAttribute("srcset", new URL(ss, url).toString());
          } catch (e) {
          }
        }
      });
    }
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const imageCol = columns.find((c) => c.querySelector("picture, img")) || element.querySelector(".md\\:order-1") || columns[0];
    const textCol = columns.find(
      (c) => c !== imageCol && c.querySelector(".mce-content-body, p")
    ) || element.querySelector(".md\\:order-2") || columns.find((c) => c !== imageCol);
    const img = imageCol ? imageCol.querySelector("img") : null;
    const picture = imageCol ? imageCol.querySelector("picture") : null;
    const imageContent = img || picture || null;
    let bodyContent = null;
    if (textCol) {
      bodyContent = textCol.querySelector(".mce-content-body") || textCol.querySelector("p") || textCol;
    }
    if (!imageContent && !bodyContent) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [imageContent || "", bodyContent || ""]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-feature",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/grand-circle-difference-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.bg-primary-70.text-white"
      ]);
      WebImporter.DOMUtils.remove(element, ["#top-page"]);
      const subNavCol = element.querySelector("div.col-span-1.xl\\:col-span-3");
      if (subNavCol) {
        const navEl = subNavCol.querySelector("nav") || subNavCol;
        const entries = [];
        [...navEl.children].forEach((child) => {
          const a = child.matches("a") ? child : child.querySelector("a");
          if (!a) return;
          const href = a.getAttribute("href") || "";
          const text = a.textContent.replace(/\s+/g, " ").trim();
          if (!text) return;
          const expandable = !!(child.querySelector("button") || child.matches("button"));
          const cls = ` ${a.className} `;
          const active = /\sactive\s/.test(cls) || /text-body-2xl/.test(cls);
          entries.push({ href, text, expandable, active });
        });
        if (entries.length) {
          const { document } = payload;
          const rows = entries.map((e) => {
            const flags = [];
            if (e.active) flags.push("active");
            if (e.expandable) flags.push("expand");
            const cell = document.createElement("div");
            const flagText = flags.length ? `[${flags.join(" ")}] ` : "";
            const link = document.createElement("a");
            link.setAttribute("href", e.href);
            link.textContent = e.text;
            cell.append(document.createTextNode(flagText), link);
            return [cell];
          });
          const block = WebImporter.Blocks.createBlock(document, {
            name: "section-nav",
            cells: rows
          });
          const main = element.querySelector("main") || element;
          main.insertBefore(block, main.firstChild);
        }
        subNavCol.remove();
      }
      WebImporter.DOMUtils.remove(element, [
        "#page-analytics",
        "#analytics-user-status",
        "#analytics-feature-flags"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav"
      ]);
      WebImporter.DOMUtils.remove(element, ["source"]);
    }
  }

  // tools/importer/import-grand-circle-difference.js
  var parsers = {
    "columns-feature": parse
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "grand-circle-difference",
    description: "Single content page describing the Grand Circle difference (cloned mirror of gct.com/grand-circle-difference). Hero plus six titled feature sections, each with heading, intro emphasis, image, and body copy.",
    urls: [
      "https://pnamadobe.github.io/gcdifference/"
    ],
    blocks: [
      {
        name: "columns-feature",
        instances: [
          "main .opti-content-area-item-0 .mt-10 > div.mb-5.grid.grid-cols-1.md\\:grid-cols-2"
        ]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_grand_circle_difference_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath("/grand-circle-difference");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_grand_circle_difference_exports);
})();
