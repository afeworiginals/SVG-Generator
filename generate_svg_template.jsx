// Check if a document is open, otherwise create a new one
var doc = app.documents.length > 0 ? app.activeDocument : app.documents.add();

// Set artboard size to 12x24 inches
var artboard = doc.artboards[0];
artboard.artboardRect = [0, 1728, 864, 0]; // 12x24 in points (72 pt/in)

function getColorRGB(colorName) {
    var colors = {
        // Existing entries (partial)
        "black": [0, 0, 0],
        "matte black": [30, 30, 30],
        "matte white": [245, 245, 245],
        "white": [255, 255, 255],
        "white ultra": [255, 255, 255],
        "gold ultra": [153, 124, 60],
        "silver metallic": [192, 192, 192],
        "yellow": [255, 221, 51],
        "dark red": [139, 0, 0],
        "coral": [255, 127, 80],
        "purple": [128, 0, 128],
        "pink": [255, 105, 180],
        "blue": [0, 0, 255],
        "light blue": [173, 216, 230],
        "green": [0, 255, 0],
        "dark grey": [64, 64, 64],
        "teal": [0, 128, 128],

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

    var normalized = ("" + colorName).toLowerCase().replace(/^\s+|\s+$/g, "");
    return colors[normalized] || [0, 0, 0]; // Fallback to black
}


// Replace these during runtime (Power Automate will do that)
var textContent = "DecalText";
var fontName = "DecalFont";
var fontSizeInInches = parseFloat("DecalSize");
var colorName = "DecalColor";
var outputPath = "SVGOutputPath";

// Step 1: Use default safe point size initially
var initialSize = 100;

var fillColor = new RGBColor();
var rgb = getColorRGB(colorName);
fillColor.red = rgb[0];
fillColor.green = rgb[1];
fillColor.blue = rgb[2];

// Create text frame
var textFrame = doc.textFrames.add();
textFrame.contents = textContent;
textFrame.textRange.characterAttributes.size = initialSize;

try {
    textFrame.textRange.characterAttributes.textFont = app.textFonts.getByName(fontName);
} catch (e) {
    textFrame.textRange.characterAttributes.textFont = app.textFonts.getByName("MyriadPro-Regular");
}

textFrame.textRange.characterAttributes.fillColor = fillColor;

// Convert to outlines and group
var outlinedItems = textFrame.createOutline();
var group = doc.groupItems.add();
for (var i = 0; i < outlinedItems.length; i++) {
    outlinedItems[i].moveToBeginning(group);
}

// Resize to exact decal width using geometric bounds for accuracy
var targetWidthPts = fontSizeInInches * 72;
var groupBounds = group.geometricBounds; // [x1, y1, x2, y2]
var groupWidth = groupBounds[2] - groupBounds[0];
var scaleFactor = targetWidthPts / groupWidth;
group.resize(scaleFactor * 100, scaleFactor * 100);

// Align group 0.5" from top-left corner
var offsetX = 5.5 * 72;
var offsetY = 0.5 * 72;
groupBounds = group.geometricBounds; // recalculate after resize
var targetLeft = offsetX;
var targetTop = 1728 - offsetY; // top of 24"
var deltaX = targetLeft - groupBounds[0];
var deltaY = targetTop - groupBounds[1];
group.translate(deltaX, deltaY);

// Save as SVG
var saveFile = new File(outputPath);
var saveOptions = new ExportOptionsSVG();
saveOptions.embedRasterImages = true;
doc.exportFile(saveFile, ExportType.SVG, saveOptions);
// Show full artboard and center it in the window
// app.executeMenuCommand("fitinwindow"); // Removed to prevent error

