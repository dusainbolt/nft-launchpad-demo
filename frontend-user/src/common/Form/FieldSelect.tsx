import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
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
  // prefix?: any;
  // suffix?: any;
  placeholder?: string;
  className?: string;
  options: OptionSelect[];
  // restric: Restrict;
  // type?: string;
  required?: boolean;
  field?: FieldInputProps<any>;
  meta?: FieldMetaProps<any>;
}

const FieldSelect: FC<FieldSelectType> = ({ label, placeholder, required, options, className, field }) => {
  const { touched, errors, setFieldValue } = useFormikContext();
  const fieldTouch: boolean = Helper.objValue(touched, field?.name);
  const fieldError: string = Helper.objValue(errors, field?.name);
  const isError: boolean = fieldTouch && Boolean(fieldError);

  const styles = fieldSelectStyle();

  const handleChange = (event) => {
    setFieldValue(field?.name as string, event.target.value);
  };

  label = `${label}${required && ' *'}`;

  return (
    <div className={clsx(className)}>
      <FormControl error={isError} fullWidth>
        <InputLabel className={styles.label} id={`${field?.name}-label`}>
          {label}
        </InputLabel>
        <Select
          labelId={`${field?.name}-label`}
          id={field?.name}
          name={field?.name}
          size="small"
          value={field?.value}
          placeholder={placeholder}
          label={label}
          onChange={handleChange}
          inputProps={{
            required,
          }}
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
