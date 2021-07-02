import { Component } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfFonts from "./vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  // download default Roboto font from cdnjs.com
  // Roboto: {
  //   normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
  //   bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
  //   italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
  //   bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  // },
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
      pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition).print();
    }else{
      pdfMake.createPdf(docDefinition).open();
    }

  }

  getDocDefinition() {
    const body = this.getTableBody();
    const dd = {
      content: [
        // { text: 'Voca Header1', style: 'header', alignment: 'center'}, {text: 'Voca Header2', style: 'header', alignment: 'center'},
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
          margin: [0, 0, 0, 10]
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
          margin: [0, 3, 0, 3]
        },
      },
      defaultStyle: {
        // alignment: 'justify'
        font: 'NotoSansSC',
        // font: 'Roboto'
      }
    }

    return dd;
  }

  products = [{word: 'word1', han: 'han1'}, {word: 'word2', han: 'han2'}, {word: 'word3', han: 'han3: 한글'}]
  getTableBody() {
    const pages = [0, 1, 2];
    const pagesBody: any = pages.map(page => {
      const index = page;
      return this.getPageBody(index, this.products);
    });
    const pagesDD = pagesBody.flat();
    return pagesDD;
  }

  getPageBody(index: number, items: any[]) {
    const pageHeader = this.getPageHeader(index);
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
        return this.WordsPerPage < 40 ?
        ([
          {text: '' + (index * this.WordsPerPage + i+1), style: 'textBody'},
          {text: p.word, style: 'textBody'},
          {text: p.han, style: 'textBody'}
        ])
        : ([
          {text: '' + (index * this.WordsPerPage + i+1), style: 'textBody'},
          {text: p.word, style: 'textBody'},
          {text: p.han, style: 'textBody'},
          {text: '' + (index * this.WordsPerPage + 20 + i+1), style: 'textBody'},
          {text: p.word, style: 'textBody'},
          {text: p.han, style: 'textBody'}
        ])
      }),
    ];
    const pageBreak = this.WordsPerPage < 40
      ? [{text: '참고: Page Break', style: 'textBody', pageBreak: 'after', colSpan: 3}, {}, {}]
      : [{text: '참고: Page Break', style: 'textBody', pageBreak: 'after', colSpan: 6}, {}, {}, {}, {}, {}];
    // ! SKIP last page
    pageBody.push(pageBreak);
    return pageBody;
  }

  getPageHeader(index: number) {
    const header = {
        // alignment: 'justify',
        columns: [
          {
            width: '15%',
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
            width: '15%',
            stack: [
                    {text: 'Date: xxxx-xx-xx'},
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
      style: 'pageHeader', colSpan:  this.WordsPerPage < 40 ? 3 : 6
    }
    const ddHeader = this.WordsPerPage < 40 ? [header, {}, {}] : [header, {}, {}, {}, {}, {}]
    return ddHeader; // [header, {}, {}];
  }

  addProduct(){
    this.invoice.products.push(new Product());
  }

}
