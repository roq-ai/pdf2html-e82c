import * as yup from 'yup';

export const scrollSettingValidationSchema = yup.object().shape({
  speed: yup.number().integer().required(),
  auto_scroll: yup.boolean().required(),
  web_page_id: yup.string().nullable(),
});
