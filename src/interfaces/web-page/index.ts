import { ScrollSettingInterface } from 'interfaces/scroll-setting';
import { PdfInterface } from 'interfaces/pdf';
import { GetQueryInterface } from 'interfaces';

export interface WebPageInterface {
  id?: string;
  content: string;
  pdf_id?: string;
  created_at?: any;
  updated_at?: any;
  scroll_setting?: ScrollSettingInterface[];
  pdf?: PdfInterface;
  _count?: {
    scroll_setting?: number;
  };
}

export interface WebPageGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  pdf_id?: string;
}
