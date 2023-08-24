import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import { Subscription } from 'src/entities/subscription.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { formatDate } from './date-and-time.helper';

export function generatePDF(
  workspace: Workspace,
  user: User,
  subscription: Subscription,
  pricePerUser: number,
) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(`temp/invoice-${workspace.owner.email}.pdf`));

  //UP LEFT TEXT
  doc.fontSize(24).text('StandUp', 40, 20);
  doc.fontSize(10).text('www.stand-up.ba', 40, 50, {
    link: 'http://localhost:3000/',
    underline: true,
  });
  doc.fontSize(14).text(workspace.projectName, 40, 70);

  doc.fontSize(14).text('BILL TO', 40, 140);
  doc.lineCap('butt').moveTo(40, 155).lineTo(250, 155).stroke();
  doc.fontSize(10).text(user.name, 40, 160);
  doc.fontSize(10).text(user.email, 40, 175);

  //UP RIGHT TEXT
  doc.fontSize(20).text('Invoice', 450, 20, { align: 'right' });
  doc.fontSize(10).text('Invoice date:', 400, 160);
  doc
    .fontSize(10)
    .text(formatDate(subscription.createdAt), 470, 160, { align: 'right' });

  //BOTTOM LEFT TEXT
  doc.fontSize(10).text('Teams & instructions', 40, 650);
  doc.lineCap('butt').moveTo(40, 665).lineTo(250, 665).stroke();
  doc.fontSize(10).text('Pay within 14 days by MickoStripe,', 40, 670);
  doc
    .fontSize(10)
    .text('otherwise your workspace will be deactivated.', 40, 680);

    const status = subscription.status === 'paid' ? 'Paid' : 'Not Paid';
  doc.fontSize(15).fillColor(subscription.status === 'paid' ? 'green' : 'red')
    .text(`Payment Status: ${status}`, 30, 700);

  //BOTTOM RIGHT TEXT
  doc.fontSize(12).text('Total:', 420, 535);
  doc
    .fontSize(12)
    .text(subscription.price.toFixed(2) + '$', 460, 535, { align: 'right' });
  doc.lineCap('butt').moveTo(420, 550).lineTo(550, 550).stroke();

  //TABLE GENERATION
  //
  //VERTICAL LINES
  doc.lineCap('butt').moveTo(154, 340).lineTo(154, 380).stroke();
  doc.lineCap('butt').moveTo(268, 340).lineTo(268, 380).stroke();
  doc.lineCap('butt').moveTo(422, 340).lineTo(422, 380).stroke();
  //HORIZONTAL LINES
  row(doc, 340);
  row(doc, 360);
  //TEXT INSIDE COLUMNS
  textInRowFirst(doc, 'SUBSCRIPTION ID', 345);
  textInRowSecond(doc, 'PRICE PER USER', 345);
  textInRowThird(doc, 'NUMBER OF USERS', 345);
  textInRowFourth(doc, 'TOTAL PRICE', 345);
  textInRowFirst(doc, subscription.id.toString(), 365);
  textInRowSecond(doc, pricePerUser.toString() + '$', 365);
  textInRowThird(doc, workspace.users.length.toString(), 365);
  textInRowFourth(doc, subscription.price.toString() + '$', 365);
  doc.end();
}

function textInRowFirst(doc: PDFKit.PDFDocument, text: string, heigth: number) {
  doc.y = heigth;
  doc.x = 30;
  doc.fillColor('black');
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: 'justify',
    columns: 1,
  });
  return doc;
}

function textInRowSecond(
  doc: PDFKit.PDFDocument,
  text: string,
  heigth: number,
) {
  doc.y = heigth;
  doc.x = 154;
  doc.fillColor('black');
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: 'justify',
    columns: 1,
  });
  return doc;
}

function textInRowThird(doc: PDFKit.PDFDocument, text: string, heigth: number) {
  doc.y = heigth;
  doc.x = 268;
  doc.fillColor('black');
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: 'justify',
    columns: 1,
  });
  return doc;
}

function textInRowFourth(
  doc: PDFKit.PDFDocument,
  text: string,
  heigth: number,
) {
  doc.y = heigth;
  doc.x = 422;
  doc.fillColor('black');
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: 'justify',
    columns: 1,
  });
  return doc;
}

function row(doc: PDFKit.PDFDocument, heigth: number) {
  doc.lineJoin('miter').rect(30, heigth, 550, 20).stroke();
  return doc;
}
