/* eslint-disable jsx-a11y/label-has-associated-control */
import { TextField } from '@mui/material';
import Helper from '@services/helper';
import { Restrict } from '@type/field';
import clsx from 'clsx';
import { FieldInputProps, FieldMetaProps, useFormikContext } from 'formik';
import { FC, FormEvent } from 'react';

export interface FieldTextType {
  label?: string;
  prefix?: any;
  suffix?: any;
  className?: string;
  restric: Restrict;
  required?: boolean;
  field?: FieldInputProps<any>;
  meta?: FieldMetaProps<any>;
}

const FieldText: FC<FieldTextType> = ({ label, className, field, required, restric, ...props }) => {
  const { touched, errors, setFieldValue } = useFormikContext();
  const fieldTouch: boolean = Helper.objValue(touched, field?.name);
  const fieldError: string = Helper.objValue(errors, field?.name);
  const isError: boolean = fieldTouch && Boolean(fieldError);

  const onChangeInput = ({ currentTarget: { value } }: FormEvent<HTMLInputElement>) => {
    const includeSpecialChar = value.match(/[%<>\\$'"]/);
    if (Restrict.DISALLOW_SPECIAL_CHAR === restric && includeSpecialChar?.input) {
      return;
    }
    setFieldValue(field?.name as string, value);
  };

  return (
    <div style={{ marginTop: 12 }} className={clsx(className)}>
      {label && (
        <label style={{ fontWeight: 600 }}>
          {label}
          {required && <span style={{ color: 'red', fontWeight: 400, fontSize: 12 }}> *required</span>}
        </label>
      )}
      <TextField
        fullWidth
        id={field?.name}
        name={field?.name}
        value={field?.value}
        onChange={onChangeInput as any}
        error={isError}
        size="small"
        helperText={fieldTouch && fieldError}
        variant="outlined"
        {...props}
      />
    </div>
  );
};

export default FieldText;
