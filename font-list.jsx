var fonts = app.textFonts;
var logFile = new File("C:/PAD_Flows/SVG_Generator/logs/font_list.txt");
logFile.encoding = "UTF-8";
logFile.open("w");

for (var i = 0; i < fonts.length; i++) {
    logFile.writeln(fonts[i].name);
}

logFile.close();
alert("Font list saved.");
