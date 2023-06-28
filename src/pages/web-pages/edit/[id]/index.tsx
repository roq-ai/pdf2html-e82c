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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getWebPageById, updateWebPageById } from 'apiSdk/web-pages';
import { Error } from 'components/error';
import { webPageValidationSchema } from 'validationSchema/web-pages';
import { WebPageInterface } from 'interfaces/web-page';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PdfInterface } from 'interfaces/pdf';
import { getPdfs } from 'apiSdk/pdfs';

function WebPageEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WebPageInterface>(
    () => (id ? `/web-pages/${id}` : null),
    () => getWebPageById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: WebPageInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateWebPageById(id, values);
      mutate(updated);
      resetForm();
      router.push('/web-pages');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<WebPageInterface>({
    initialValues: data,
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
            Edit Web Page
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'web_page',
  operation: AccessOperationEnum.UPDATE,
})(WebPageEditPage);
