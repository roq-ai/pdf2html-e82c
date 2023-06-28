import { WebPageInterface } from 'interfaces/web-page';
import { GetQueryInterface } from 'interfaces';

export interface ScrollSettingInterface {
  id?: string;
  speed: number;
  auto_scroll: boolean;
  web_page_id?: string;
  created_at?: any;
  updated_at?: any;

  web_page?: WebPageInterface;
  _count?: {};
}

export interface ScrollSettingGetQueryInterface extends GetQueryInterface {
  id?: string;
  web_page_id?: string;
}
