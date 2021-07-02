import { Component } from '@angular/core';
import { PdfMakeService } from './pdf-make.service';

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
  NotoSansSC: {
    normal: 'NotoSansKR-Regular.otf',
    bold: 'NotoSansKR-Bold.otf',
  }
}

class Product{
  name: string;
  price: number;
  qty: number;
}
class Invoice{
  customerName: string;
  address: string;
  contactNo: number;
  email: string;

  products: Product[] = [];
  additionalDetails: string;

  constructor(){
    // Initially one empty product row we will show
    this.products.push(new Product());
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  invoice = new Invoice();
  WordsPerPage = 40;

  constructor(private pdfMakeService: PdfMakeService) {

  }

  generatePDF(action = 'open') {
    let docDefinition: any = {
      content: [
        {
          text: 'ELECTRONIC SHOP',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.invoice.customerName,
                bold:true
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              {
                text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
              [{text: 'Total Amount', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: this.invoice.additionalDetails,
            margin: [0, 0 ,0, 15]
        },
        {
          columns: [
            [{ qr: `${this.invoice.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Order can be return in max 10 days.',
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
              'This is system generated invoice.',
            ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]
        }
      }
    };

    docDefinition = this.getDocDefinition();

    if(action==='download'){
      // pdfMake.createPdf(docDefinition).download();
      this.pdfMakeService.downloadPdf(docDefinition);
    }else if(action === 'print'){
      // pdfMake.createPdf(docDefinition).print();
      this.pdfMakeService.printPdf(docDefinition);
    }else{
      this.pdfMakeService.openPdf(docDefinition);
      // pdfMake.createPdf(docDefinition).open();
    }

  }

  getDocDefinition() {
    const body = this.getTableBody();
    const dd = {
      content: [
        // { text: 'Voca Header1', style: 'header', alignment: 'center'},
        {
          style: 'header',
          table: {
            widths: this.WordsPerPage < 40 ? ['4%', '48%', '48%'] :  ['4%', '23%', '23%', '4%', '23%', '23%'],
            body:  body,
          }
        },
        // {text: 'PageBreak: Before', pageBreak: 'before', style: 'subheader'},
        // 'Next Page',
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 0]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        pageHeader: {
          bold: true,
          fontSize: 15,
          color: 'black',
          alignment: 'center',
          margin: [0, 1, 0, 1],
          fillColor: '#eeeeff',
        },
        textHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          alignment: 'center',
          margin: [0, 5, 0, 5],
          fillColor: '#eeeeee',
        },
        textBody: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 6, 0, 6]
        },
        textHanBody: {
          fontSize: 10,
          font: 'NotoSansSC',
          alignment: 'center',
          margin: [0, 6, 0, 6]
        },
      },
      defaultStyle: {
        // alignment: 'justify'
        // font: 'NotoSansSC',
        font: 'Roboto'
      }
    }

    return dd;
  }

  pages = [0, 1, 2];
  products = [
    {word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'}, {word: 'word3', han: 'han3: 한글, han3: 한글, han3: 한글'},
    {word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'}, {word: 'word3', han: 'han3: 한글, han3: 한글, han3: 한글'},
    {word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'}, {word: 'word3', han: 'han3: 한글'},
    {word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'}, {word: 'word3', han: 'han3: 한글'},
    {word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'}, {word: 'word3', han: 'han3: 한글'},
    {word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'}, {word: 'word3', han: 'han3: 한글'},
    {word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'},
    // {word: 'word3', han: 'han3: 한글'},
    // {word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'}, {word: 'word3', han: 'han3: 한글'},
    // {word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'}, {word: 'word3', han: 'han3: 한글'},
  ]
  getTableBody() {
    const pagesBody: any = this.pages.map(page => {
      const index = page;
      return this.getPageBody(index, this.products);
    });
    const pagesDD = pagesBody.flat();
    return pagesDD;
  }

  getPageBody(index: number, items: any[]) {
    // ! Change Data
    const date = '2021.07.02';
    let showMode = 'ko'
    const pageHeader = this.getPageHeader(index, date);
    const pageBody: any = [
      // [pageHeader],
      pageHeader,
      this.WordsPerPage < 40
      ? [
        {text: 'No', style: 'textHeader'},
        {text: 'English', style: 'textHeader'},
        {text: 'Korean', style: 'textHeader'}
      ]
      : [
        {text: 'No', style: 'textHeader'},
        {text: 'English', style: 'textHeader'},
        {text: 'Korean', style: 'textHeader'},
        {text: 'No', style: 'textHeader'},
        {text: 'English', style: 'textHeader'},
        {text: 'Korean', style: 'textHeader'}
      ],
      ...items.map((p, i) => {
        // const word = p,word;
        // const sentense = p.han;
        return this.WordsPerPage < 40 ?
        ([
          {text: '' + (index * this.WordsPerPage + i+1), style: 'textBody'},
          {text: showMode === 'ko' ? '' : p.word, style: 'textBody'},
          {text: showMode === 'en' ? '' : p.han, style: 'textHanBody'}
        ])
        : ([
          {text: '' + (index * this.WordsPerPage + i+1), style: 'textBody'},
          {text: showMode === 'ko' ? '' : p.word, style: 'textBody'},
          {text: showMode == 'en' ? '' : p.han, style: 'textHanBody'},
          {text: '' + (index * this.WordsPerPage + 20 + i+1), style: 'textBody'},
          {text: showMode === 'ko' ? '' : p.word, style: 'textBody'},
          {text: showMode === 'en' ? '' : p.han, style: 'textHanBody'}
        ])
      }),
    ];
    // const pageBreak = this.WordsPerPage < 40
    //   ? [{text: '참고: Page Break', style: 'textBody', pageBreak: 'before', colSpan: 3}, {}, {}]
    //   : [{text: '참고: Page Break', style: 'textBody', pageBreak: 'before', colSpan: 6}, {}, {}, {}, {}, {}];
    // // ! SKIP last page
    // pageBody.push(pageBreak);
    return pageBody;
  }

  getPageHeader(index: number, date) {
    const header = {
        // alignment: 'justify',
        columns: [
          {
            width: '18%',
            text: 'Academy',
            style: 'textBody',
            alignment: 'left'
          },
          {
            width: '*',
            stack: [
              {text: 'Voca Title'},
              {text: 'Chapter: ' + (index + 1), style: 'textBody'}
            ],
            style: 'pageHeader',
            alignment: 'center'
          },
          {
            width: '18%',
            stack: [
                    {text: 'Date: ' + date },
                    {text: 'Name:           '}
                  ],
            style: 'textBody',
            alignment: 'left'
          },
        ],
      // table: {
      //   widths: ['auto', '*', 'auto'],
      //   body: [
      //     [
      //       {stack: [
      //         {text: 'Academy Name'}
      //       ], border: [false, false, false, false], style: 'textBody'},
      //       {stack: [
      //         {text: 'Voca Title'},
      //         {text: 'Chapter:' + index}
      //       ], border: [false, false, false, false]},
      //       {stack: [
      //         {text: 'Date'},
      //         {text: 'Name'}
      //       ], border: [false, false, false, false], style: 'textBody'},
      //     ],
      //   ],
      // },
      style: 'pageHeader',
      colSpan:  this.WordsPerPage < 40 ? 3 : 6,
      pageBreak: index !== 0 ? 'before' : ''
    }
    const ddHeader = this.WordsPerPage < 40 ? [header, {}, {}] : [header, {}, {}, {}, {}, {}]
    return ddHeader; // [header, {}, {}];
  }

  addProduct(){
    this.invoice.products.push(new Product());
  }

}
