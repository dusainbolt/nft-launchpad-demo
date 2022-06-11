/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@common/Button';
import { DialogModal } from '@common/Dialog/DialogModal';
import FieldText from '@common/Form/FieldInput';
import { CircularProgress, DialogActions } from '@mui/material';
import Helper from '@services/helper';
import { Restrict } from '@type/field';
import { Field, useFormikContext } from 'formik';
import { FC, useState } from 'react';

export const ModalCreateNFT: FC<{
  open: boolean;
  toggleModal: any;
  loading: boolean;
}> = ({ open, toggleModal, loading }) => {
  const { handleSubmit, values, setFieldValue } = useFormikContext();
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);

  const { image } = values as any;

  async function onInputFile(e) {
    const file = e.target.files[0];
    try {
      setLoadingUpload(true);
      const added = await Helper.ipfs.add(file);
      setFieldValue('image', Helper.ipfsPath(added));
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
    setLoadingUpload(false);
  }

  return (
    <DialogModal
      onCloseModal={loading ? false : toggleModal}
      width={600}
      id="modal-create-nft"
      open={open}
      title="Create NFT Form"
      action={
        <DialogActions>
          <Button autoFocus variant="contained" loading={loading} onClick={handleSubmit as any}>
            Create
          </Button>
        </DialogActions>
      }
      content={
        <div>
          <Field name="name" component={FieldText} label="Name" required restric={Restrict.DISALLOW_SPECIAL_CHAR} />
          <Field name="description" component={FieldText} label="Description" required multiline minRows={2} />
          <Field
            name="price"
            component={FieldText}
            type="number"
            label="Price"
            required
            sx={{ width: 150, display: 'block' }}
          />
          <label style={{ fontWeight: 600, display: 'block', marginTop: 12 }}>
            Image <span style={{ color: 'red', fontWeight: 400, fontSize: 12 }}> *required</span>
          </label>
          {loadingUpload ? (
            <CircularProgress />
          ) : (
            <input type="file" accept="image/png, image/gif, image/jpeg" name="image" onChange={onInputFile} />
          )}
          {image && !loadingUpload && (
            <img
              src={image}
              style={{ width: '40%', display: 'block', marginTop: 4, border: '1px solid #dc6a00', padding: 3 }}
              alt="NFT Image"
            />
          )}
        </div>
      }
    />
  );
};
