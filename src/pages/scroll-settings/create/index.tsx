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
import { createScrollSetting } from 'apiSdk/scroll-settings';
import { Error } from 'components/error';
import { scrollSettingValidationSchema } from 'validationSchema/scroll-settings';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { WebPageInterface } from 'interfaces/web-page';
import { getWebPages } from 'apiSdk/web-pages';
import { ScrollSettingInterface } from 'interfaces/scroll-setting';

function ScrollSettingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ScrollSettingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createScrollSetting(values);
      resetForm();
      router.push('/scroll-settings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ScrollSettingInterface>({
    initialValues: {
      speed: 0,
      auto_scroll: false,
      web_page_id: (router.query.web_page_id as string) ?? null,
    },
    validationSchema: scrollSettingValidationSchema,
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
            Create Scroll Setting
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="speed" mb="4" isInvalid={!!formik.errors?.speed}>
            <FormLabel>Speed</FormLabel>
            <NumberInput
              name="speed"
              value={formik.values?.speed}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('speed', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.speed && <FormErrorMessage>{formik.errors?.speed}</FormErrorMessage>}
          </FormControl>
          <FormControl
            id="auto_scroll"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.auto_scroll}
          >
            <FormLabel htmlFor="switch-auto_scroll">Auto Scroll</FormLabel>
            <Switch
              id="switch-auto_scroll"
              name="auto_scroll"
              onChange={formik.handleChange}
              value={formik.values?.auto_scroll ? 1 : 0}
            />
            {formik.errors?.auto_scroll && <FormErrorMessage>{formik.errors?.auto_scroll}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<WebPageInterface>
            formik={formik}
            name={'web_page_id'}
            label={'Select Web Page'}
            placeholder={'Select Web Page'}
            fetcher={getWebPages}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.content}
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
  entity: 'scroll_setting',
  operation: AccessOperationEnum.CREATE,
})(ScrollSettingCreatePage);
