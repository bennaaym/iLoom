import {Injectable} from '@nestjs/common';
import {chromium} from 'playwright';

@Injectable()
export class PdfService {
  async htmlToPdf(html: string) {
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.setContent(html);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();
    return Buffer.from(pdf);
  }
}
