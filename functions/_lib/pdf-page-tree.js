// Inspect the PDF page-tree dictionary without assuming key order.
// ReportLab commonly writes /Count before /Type /Pages; other producers
// write /Type first. Both describe the same 12-page document.
// This lightweight guard is only an upload format check, not a complete
// security or accessibility review of the PDF's content.
export function hasTwelvePageTree(ascii){
 if(typeof ascii!=='string')return false;
 const dictionaries=ascii.match(/<<[^<>]{0,4096}\/Type\s*\/Pages\b[^<>]{0,4096}>>/gs)||[];
 return dictionaries.some(d=>/\/Count\s+12\b/.test(d));
}
