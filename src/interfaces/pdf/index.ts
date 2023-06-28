import { WebPageInterface } from 'interfaces/web-page';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PdfInterface {
  id?: string;
  file_path: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  web_page?: WebPageInterface[];
  user?: UserInterface;
  _count?: {
    web_page?: number;
  };
}

export interface PdfGetQueryInterface extends GetQueryInterface {
  id?: string;
  file_path?: string;
  user_id?: string;
}
