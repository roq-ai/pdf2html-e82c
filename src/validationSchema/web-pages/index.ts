import * as yup from 'yup';

export const webPageValidationSchema = yup.object().shape({
  content: yup.string().required(),
  pdf_id: yup.string().nullable(),
});
