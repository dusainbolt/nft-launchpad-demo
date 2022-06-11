/* eslint-disable jsx-a11y/label-has-associated-control */
import { FormControl, FormHelperText, Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';
import Helper from '@services/helper';
import { OptionSelect } from '@type/field';
import clsx from 'clsx';
import { FieldInputProps, FieldMetaProps, useFormikContext } from 'formik';
import { FC } from 'react';

export const fieldSelectStyle = makeStyles({
  label: {
    top: -7,
    '&.MuiInputLabel-shrink': {
      top: 0,
    },
  },
});

export interface FieldSelectType {
  label?: string;
  className?: string;
  options: OptionSelect[];
  field?: FieldInputProps<any>;
  meta?: FieldMetaProps<any>;
}

const FieldSelect: FC<FieldSelectType> = ({ label, options, className, field }) => {
  const { touched, errors, setFieldValue } = useFormikContext();
  const fieldTouch: boolean = Helper.objValue(touched, field?.name);
  const fieldError: string = Helper.objValue(errors, field?.name);
  const isError: boolean = fieldTouch && Boolean(fieldError);

  const handleChange = (event) => {
    setFieldValue(field?.name as string, event.target.value);
  };

  return (
    <div style={{ marginTop: 12 }} className={clsx(className)}>
      <FormControl error={isError} fullWidth>
        {label && <label style={{ fontWeight: 600 }}>{label}</label>}
        <Select
          labelId={`${field?.name}-label`}
          id={field?.name}
          name={field?.name}
          size="small"
          value={field?.value}
          onChange={handleChange}
        >
          {options?.map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {fieldTouch && fieldError && <FormHelperText>{fieldError}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default FieldSelect;
