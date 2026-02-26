import QRCode from 'qrcode';

export interface QROptions {
  format?: 'png' | 'svg';
  width?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export async function generateQRCode(
  text: string,
  options: QROptions = {}
): Promise<string> {
  const {
    format = 'png',
    width = 300,
    errorCorrectionLevel = 'M',
  } = options;

  try {
    if (format === 'svg') {
      return await QRCode.toString(text, {
        type: 'svg',
        width,
        errorCorrectionLevel,
      });
    } else {
      // Return base64 data URL for PNG
      return await QRCode.toDataURL(text, {
        width,
        errorCorrectionLevel,
      });
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export async function generateQRCodeBuffer(
  text: string,
  width: number = 300
): Promise<Buffer> {
  try {
    return await QRCode.toBuffer(text, {
      width,
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}
