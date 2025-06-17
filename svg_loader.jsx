var tempFile = new File("C:/PAD_Flows/SVG_Generator/temp/generate_svg_temp.jsx");
if (tempFile.exists) {
    $.evalFile(tempFile);
}
