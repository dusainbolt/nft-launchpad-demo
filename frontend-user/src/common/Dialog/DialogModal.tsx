import { CircularProgressCustom } from '@common/Progress/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import { Backdrop } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { FC, ReactNode, useEffect, useState } from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: ReactNode;
  onClose: () => void;
}

const CustomDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface DialogModalProps extends DialogProps {
  id: string;
  title?: string;
  onCloseModal: any;
  content?: ReactNode;
  action?: ReactNode;
  loadContent?: boolean;
}

export const DialogModal: FC<DialogModalProps> = ({
  id,
  loadContent,
  title = 'Modal Title',
  onCloseModal,
  content = '',
  action = '',
  ...otherProps
}) => {
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const handleClose: any = (event, reason) => {
    if (event && reason && reason === 'backdropClick') return;
    onCloseModal();
  };

  useEffect(() => {
    if (typeof loadContent !== 'undefined') {
      if (loadContent) {
        setLoadingContent(true);
      } else {
        setTimeout(() => {
          setLoadingContent(false);
        }, 0);
      }
    }
  }, [loadContent]);

  return (
    <div>
      {otherProps.open && loadingContent ? (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingContent}>
          <CircularProgressCustom color="inherit" />
        </Backdrop>
      ) : (
        <BootstrapDialog onClose={handleClose} aria-labelledby={id} {...otherProps}>
          <CustomDialogTitle id={id} onClose={handleClose}>
            {title}
          </CustomDialogTitle>
          <DialogContent dividers>{content}</DialogContent>
          {action}
        </BootstrapDialog>
      )}
    </div>
  );
};
