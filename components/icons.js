// components/icons.js

/**
 * Lädt eine SVG-Datei und gibt das SVG-Element zurück.
 * @param {string} iconName - Der Name der SVG-Datei ohne die .svg Erweiterung.
 * @returns {Promise<SVGElement|null>} - Das geladene SVG-Element oder null bei Fehler.
 */
export async function loadSVG(iconName) {
  try {
    const response = await fetch(`icons/${iconName}.svg`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.querySelector("svg");
    if (svgElement) {
      // Entferne eventuelle `xmlns` Attribute, um Konflikte zu vermeiden
      svgElement.removeAttribute("xmlns");
      svgElement.classList.add("icon-svg"); // Füge eine Klasse für Styling hinzu
      svgElement.setAttribute("aria-hidden", "true"); // Verbessere die Barrierefreiheit
      return svgElement;
    } else {
      throw new Error("Kein SVG-Element gefunden");
    }
  } catch (error) {
    console.error(`Fehler beim Laden des Icons ${iconName}:`, error);
    return null;
  }
}
