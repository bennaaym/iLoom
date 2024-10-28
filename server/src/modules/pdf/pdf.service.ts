import {Injectable} from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async htmlToPdf(html: string) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.setContent(html);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();
    return Buffer.from(pdf);
  }
}
