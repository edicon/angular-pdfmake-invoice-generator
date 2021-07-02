import { Injectable } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfFonts from "./vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  // download default Roboto font from cdnjs.com
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  },
  // custom fonts
  NotoSansSC: {
    normal: 'NotoSansKR-Regular.otf',
    bold: 'NotoSansKR-Bold.otf',
  }
}

@Injectable({
  providedIn: 'root'
})
export class PdfMakeService {

  constructor() { }

  getPdfMake() {
    return pdfMake;
  }

  openPdf(docDefinition: any) {
    pdfMake.createPdf(docDefinition).open();
  }

  downloadPdf(docDefinition: any) {
    pdfMake.createPdf(docDefinition).download();
  }

  printPdf(docDefinition: any) {
    pdfMake.createPdf(docDefinition).print();
  }
}
