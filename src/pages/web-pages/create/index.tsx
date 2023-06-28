import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createWebPage } from 'apiSdk/web-pages';
import { Error } from 'components/error';
import { webPageValidationSchema } from 'validationSchema/web-pages';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PdfInterface } from 'interfaces/pdf';
import { getPdfs } from 'apiSdk/pdfs';
import { WebPageInterface } from 'interfaces/web-page';

function WebPageCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WebPageInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWebPage(values);
      resetForm();
      router.push('/web-pages');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WebPageInterface>({
    initialValues: {
      content: '',
      pdf_id: (router.query.pdf_id as string) ?? null,
    },
    validationSchema: webPageValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Web Page
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
            <FormLabel>Content</FormLabel>
            <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
            {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<PdfInterface>
            formik={formik}
            name={'pdf_id'}
            label={'Select Pdf'}
            placeholder={'Select Pdf'}
            fetcher={getPdfs}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.file_path}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'web_page',
  operation: AccessOperationEnum.CREATE,
})(WebPageCreatePage);
