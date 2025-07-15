// Combined SVG generator using injected order array

/*ORDERS_PLACEHOLDER*/

var COLOR_MAP = {
        // Page 1 - Solid Vinyls
        "black": [0, 0, 0],
        "matte black": [30, 30, 30],
        "matte white": [245, 245, 245],
        "white": [255, 255, 255],
        "gold metallic": [212, 175, 55],
        "silver metallic": [192, 192, 192],
        "copper metallic": [184, 115, 51],
        "golden yellow": [255, 201, 20],
        "signal yellow": [255, 204, 0],
        "yellow": [255, 221, 51],
        "light yellow": [255, 255, 153],
        "brimstone yellow": [255, 225, 53],
        "purple red": [128, 0, 64],
        "burgundy": [128, 0, 32],
        "dark red": [139, 0, 0],
        "red": [255, 0, 0],
        "light red": [255, 102, 102],
        "orange red": [255, 69, 0],
        "orange": [255, 140, 0],
        "light orange": [255, 165, 0],
        "pastel orange": [255, 179, 128],
        "coral": [255, 127, 80],
        "purple": [128, 0, 128],
        "violet": [238, 130, 238],
        "lavender": [230, 230, 250],
        "lilac": [200, 162, 200],
        "pink": [255, 105, 180],
        "soft pink": [255, 182, 193],
        "deep sea blue": [0, 51, 102],
        "steel blue": [70, 130, 180],
        "dark blue": [0, 0, 139],
        "cobalt blue": [0, 71, 171],
        "king blue": [0, 0, 255],
        "brillant blue": [0, 112, 255],
        "blue": [0, 0, 255],
        "traffic blue": [0, 114, 206],
        "gentian blue": [0, 86, 167],
        "gentian": [0, 70, 140],
        "azure blue": [0, 127, 255],
        "sky blue": [135, 206, 235],
        "light blue": [173, 216, 230],
        "ice blue": [173, 216, 255],
        "turquoise blue": [0, 199, 140],
        "turquoise": [64, 224, 208],
        "mint": [189, 252, 201],
        "dark green": [0, 100, 0],
        "forest green": [34, 139, 34],
        "green": [0, 255, 0],
        "grass green": [124, 252, 0],
        "light green": [144, 238, 144],
        "yellow green": [154, 205, 50],
        "lime-tree green": [50, 205, 50],
        "brown": [139, 69, 19],
        "nut brown": [153, 101, 21],
        "light brown": [181, 101, 29],
        "dark grey": [64, 64, 64],
        "cream": [255, 253, 208],
        "telegrey": [192, 192, 192],
        "beige": [245, 245, 220],
        "immitation gold": [204, 173, 96],
        "grey": [128, 128, 128],
        "middle grey": [169, 169, 169],
        "light grey": [211, 211, 211],

        // Page 2 - Glitter/Ultra Vinyl
        "black ultra": [10, 10, 10],
        "dark grey ultra": [64, 64, 64],
        "gold ultra": [212, 175, 55],
        "silver ultra": [192, 192, 192],
        "champagne ultra": [230, 216, 173],
        "rose gold ultra": [183, 110, 121],
        "dark red ultra": [128, 0, 0],
        "fluorescent pink ultra": [255, 20, 147],
        "coral ultra": [255, 114, 111],
        "orange ultra": [255, 140, 0],
        "fluorescent orange ultra": [255, 90, 0],
        "dark amethyst ultra": [153, 102, 204],
        "purple ultra": [160, 32, 240],
        "blue ultra": [0, 102, 204],
        "light blue ultra": [135, 206, 250],
        "green ultra": [0, 200, 0],
        "emerald green ultra": [0, 128, 102],
        "teal ultra": [0, 153, 153],
        "tiff blue ultra": [144, 224, 239],
        "sea foam ultra": [159, 226, 191],
        "fluorescent green ultra": [0, 255, 0],
        "lime tree green ultra": [50, 205, 50],
        "yellow ultra": [255, 255, 0],
        "melon ultra": [255, 105, 180],
        "fluorescent blue ultra": [30, 144, 255],

        // Page 3 - Fluorescent Vinyl (non-glitter)
        "orange fluorescent": [255, 102, 0],
        "red orange fluorescent": [255, 69, 0],
        "red fluorescent": [255, 0, 0],
        "pink fluorescent": [255, 20, 147],
        "green fluorescent": [0, 255, 0],
        "yellow fluorescent": [255, 255, 0],

        // Page 3 - Camouflage
        "green camo": [85, 107, 47],
        "brown camo": [139, 69, 19],
        "black camo": [40, 40, 40],
        "pink camo": [255, 105, 180],
        "blue camo": [0, 102, 204],
        "red camo": [178, 34, 34],

        // Page 3 - Holographic Vinyl
        "amber": [255, 191, 94],
        "bright green": [102, 255, 102],
        "holographic white": [255, 255, 255],
        "holographic orange": [255, 128, 0],
        "holographic pink": [255, 105, 180],
        "holographic gold": [255, 215, 0],
        "holographic yellow": [255, 255, 102],
        "holographic blue": [100, 149, 237],
        "holographic green": [0, 255, 127]
    };

    function getColorRGB(colorName) {
    var normalized = String(colorName).toLowerCase().replace(/^\\s+|\\s+$/g, "");
    return COLOR_MAP[normalized] || [0, 0, 0]; // Fallback to black
}

function ensureFolderExists(fileObj) {
    var folder = fileObj.parent;
    if (!folder.exists) folder.create();
}

var doc = app.documents.length > 0 ? app.activeDocument : app.documents.add(DocumentColorSpace.RGB, 864, 1728);

var padding = 36;
var xOffset = padding;
var yOffset = padding;
var maxRowHeight = 0;
var outputPath = "SVGOutputPath";

for (var i = 0; i < orders.length; i++) {
    var order = orders[i];

    var initialSize = 100;
    var fillColor = new RGBColor();
    var rgb = getColorRGB(order.color);
    fillColor.red = rgb[0];
    fillColor.green = rgb[1];
    fillColor.blue = rgb[2];

    var textFrame = doc.textFrames.add();
    textFrame.contents = order.text;
    textFrame.textRange.characterAttributes.size = initialSize;

    try {
        textFrame.textRange.characterAttributes.textFont = app.textFonts.getByName(order.font);
    } catch (e) {
        textFrame.textRange.characterAttributes.textFont = app.textFonts.getByName("MyriadPro-Regular");
    }

    textFrame.textRange.characterAttributes.fillColor = fillColor;

    var outlinedItems = textFrame.createOutline();
    var group = doc.groupItems.add();
    if (outlinedItems.length !== undefined) {
        for (var j = 0; j < outlinedItems.length; j++) {
            outlinedItems[j].moveToBeginning(group);
        }
    } else {
        outlinedItems.moveToBeginning(group);
    }

    app.selection = null;
    for (var j = 0; j < group.pageItems.length; j++) {
        group.pageItems[j].selected = true;
    }
    app.executeMenuCommand("Live Pathfinder Add");

    var sel = app.activeDocument.selection;
    app.selection = null;
    var unitedGroup = null;
    if (sel[0].typename === "GroupItem") {
        unitedGroup = sel[0];
    } else {
        unitedGroup = doc.groupItems.add();
        for (var j = 0; j < sel.length; j++) {
            sel[j].moveToBeginning(unitedGroup);
        }
    }

    var targetWidthPts = order.size * 72;
    var bounds = unitedGroup.geometricBounds;
    var width = bounds[2] - bounds[0];
    var height = bounds[1] - bounds[3];
    var scale = targetWidthPts / width;
    unitedGroup.resize(scale * 100, scale * 100);

    bounds = unitedGroup.geometricBounds;
    width = bounds[2] - bounds[0];
    height = bounds[1] - bounds[3];

    if (xOffset + width + padding > doc.width) {
        xOffset = padding;
        yOffset += maxRowHeight + padding;
        maxRowHeight = 0;
    }
    if (yOffset + height + padding > doc.height) {
        alert("Artboard space exceeded. Some items not placed.");
        break;
    }

    // Updated positioning logic to align properly within the artboard
    unitedGroup.left = xOffset;
    unitedGroup.top = doc.height - yOffset;

    xOffset += width + padding;
    if (height > maxRowHeight) maxRowHeight = height;
}

// Save the file as SVG
var outputFile = new File(outputPath);
ensureFolderExists(outputFile);
var exportOptions = new ExportOptionsSVG();
exportOptions.embedRasterImages = true;
doc.exportFile(outputFile, ExportType.SVG, exportOptions);

// Optional: Remove all page items (clean up for next use)
while (doc.pageItems.length > 0) {
    doc.pageItems[0].remove();
}

alert("SVGs generated, saved to Desktop, and document cleaned up.");
