/**
 * Rehype plugin : ouvre les liens externes dans un nouvel onglet (target="_blank"
 * + rel="noopener noreferrer", en conservant un éventuel rel existant) et force les
 * liens internes (maillage fructofinance.ca) à rester dans le même onglet.
 * S'applique automatiquement à tout le contenu Markdown/MDX (articles de blog, avis) :
 * couvre à la fois les liens `[texte](url)` (nœuds hast `element`) et les balises
 * `<a>` écrites à la main dans un fichier .mdx (nœuds `mdxJsxFlowElement`/`mdxJsxTextElement`,
 * qui portent leurs attributs dans `attributes` et non `properties`).
 */
function isInternalHref(href, internalHosts) {
  if (!href) return true;
  if (
    href.startsWith("#") ||
    href.startsWith("/") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return true;
  }
  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return true;
    return internalHosts.has(url.hostname.replace(/^www\./, ""));
  } catch {
    return true; // URL relative ou invalide -> traitée comme interne
  }
}

function isAnchor(node) {
  if (node.type === "element" && node.tagName === "a") return true;
  if (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === "a"
  ) {
    return true;
  }
  return false;
}

function getJsxAttr(node, name) {
  const attr = (node.attributes || []).find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name,
  );
  return typeof attr?.value === "string" ? attr.value : undefined;
}

function setJsxAttr(node, name, value) {
  if (!node.attributes) node.attributes = [];
  const existing = node.attributes.find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name,
  );
  if (value === undefined) {
    node.attributes = node.attributes.filter(
      (a) => !(a.type === "mdxJsxAttribute" && a.name === name),
    );
    return;
  }
  if (existing) existing.value = value;
  else node.attributes.push({ type: "mdxJsxAttribute", name, value });
}

function applyRule(node, internalHosts) {
  const isHast = node.type === "element";
  const href = isHast ? node.properties?.href : getJsxAttr(node, "href");

  if (isInternalHref(typeof href === "string" ? href : "", internalHosts)) {
    if (isHast) delete node.properties.target;
    else setJsxAttr(node, "target", undefined);
    return;
  }

  if (isHast) {
    if (!node.properties) node.properties = {};
    const existing = Array.isArray(node.properties.rel)
      ? node.properties.rel
      : typeof node.properties.rel === "string"
        ? node.properties.rel.split(/\s+/).filter(Boolean)
        : [];
    const rel = new Set(existing);
    rel.add("noopener");
    rel.add("noreferrer");
    node.properties.target = "_blank";
    node.properties.rel = Array.from(rel);
  } else {
    const existing = (getJsxAttr(node, "rel") || "").split(/\s+/).filter(Boolean);
    const rel = new Set(existing);
    rel.add("noopener");
    rel.add("noreferrer");
    setJsxAttr(node, "target", "_blank");
    setJsxAttr(node, "rel", Array.from(rel).join(" "));
  }
}

function walk(node, internalHosts) {
  if (isAnchor(node)) applyRule(node, internalHosts);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, internalHosts);
  }
}

export default function rehypeLinkTarget(options = {}) {
  const internalHosts = new Set(
    (options.internalHosts || []).map((host) => host.replace(/^www\./, "")),
  );
  return (tree) => walk(tree, internalHosts);
}
