// combine_pdfs.jsx
#target illustrator

// Set the default parent folder path
var defaultPath = "C:/PAD_Flows/SVG_Generator/output/2025";
var parentFolder = Folder.selectDialog(
    "Select the parent folder containing order folders:",
    new Folder(defaultPath)
);
if (!parentFolder) {
    alert("No folder selected. Script canceled.");
    exit();
}

var orderFolders = parentFolder.getFiles(function(f) {
    return f instanceof Folder;
});

if (orderFolders.length === 0) {
    alert("No order folders found in selected folder.");
    exit();
}

for (var o = 0; o < orderFolders.length; o++) {
    var folder = orderFolders[o];
    var pdfFiles = folder.getFiles(function(f) {
        return f instanceof File && f.name.match(/\.pdf$/i);
    });

    if (pdfFiles.length < 2) {
        // Skip orders with less than 2 PDFs
        continue;
    }

    // Create new 12x24 in (864 x 1728 pts) RGB document for this order
    var doc = app.documents.add(DocumentColorSpace.RGB, 864, 1728);

    // Layout settings
    var padding = 36; // 0.5 inch
    var xOffset = padding;
    var yOffset = padding;
    var maxRowHeight = 0;

    // Loop through PDFs in this order
    for (var i = 0; i < pdfFiles.length; i++) {
        try {
            alert("Trying to open: " + pdfFiles[i].fsName);
            var tempDoc = app.open(new File(pdfFiles[i].fsName));

            // Group all items in temp document
            var tempGroup = tempDoc.groupItems.add();
            for (var j = tempDoc.pageItems.length - 1; j >= 0; j--) {
                tempDoc.pageItems[j].move(tempGroup, ElementPlacement.PLACEATBEGINNING);
            }

            // Copy group
            app.activeDocument = tempDoc;
            tempGroup.selected = true;
            app.copy();

            // Paste into main layout
            app.activeDocument = doc;
            app.paste();

            var pastedGroup = doc.selection[0];
            pastedGroup.selected = false;

            // Resize to 100% (sometimes pastes smaller than expected)
            pastedGroup.resize(100, 100);

            // Get size
            var bounds = pastedGroup.geometricBounds; // [x1, y1, x2, y2]
            var width = bounds[2] - bounds[0];
            var height = bounds[1] - bounds[3];

            // Wrap row if needed
            if (xOffset + width + padding > 864) {
                xOffset = padding;
                yOffset += maxRowHeight + padding;
                maxRowHeight = 0;
            }

            if (yOffset + height + padding > 1728) {
                alert("Artboard space exceeded for order: " + folder.name + ". Not all PDFs could be placed.");
                tempDoc.close(SaveOptions.DONOTSAVECHANGES);
                break;
            }

            // Move to position
            pastedGroup.left = xOffset;
            pastedGroup.top = -yOffset;

            xOffset += width + padding;
            if (height > maxRowHeight) maxRowHeight = height;

            tempDoc.close(SaveOptions.DONOTSAVECHANGES);
        } catch (err) {
            alert("Error importing: " + pdfFiles[i].name + "\n\n" + err.message);
        }
    }

    alert("PDFs for order '" + folder.name + "' combined and arranged on 12x24 sheet.");
}
