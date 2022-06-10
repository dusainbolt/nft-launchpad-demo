import { makeStyles } from '@mui/styles';
import theme from '@styles/theme';

export const layoutStyle = makeStyles({
  header: {
    position: 'sticky',
    left: 0,
    top: 0,
    zIndex: 10,
    willChange: 'transform',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #e8ebed',
    background: '#ffffff',
    height: theme.spacing(8),
    padding: `0 ${theme.spacing(3)}`,
  },
  body: {
    display: 'flex',
    // minHeight: '100vh',
    flex: '1 1',
  },
  bodyContent: {
    maxWidth: 'calc(100% - 96px)',
    padding: `30px 40px 0 20px`,
    width: '100%',
  },
  sidebar: {
    flexShrink: 0,
  },
  sidebarWrap: {
    width: 132,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexShrink: 0,
    left: 0,
    padding: `0 ${theme.spacing(3)}`,
    position: 'sticky',
    top: 74,
  },
  navWrap: {
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    '& a.MuiLink-root': {
      width: '100%',
    },
    '&.Mui-selected': {
      background: '#e8ebed',
    },
    '& .MuiListItemButton-root': {
      flexDirection: 'column',
    },
    '& .MuiListItemIcon-root': {
      minWidth: 'unset',
    },
    '& .MuiTypography-root': {
      fontWeight: 700,
      fontSize: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.common.black,
      textDecoration: 'unset',
    },
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    flex: '1 1',
    '& svg': {
      marginRight: '5px',
      width: 36,
      height: 36,
    },
    '& div': {
      fontWeight: 'bold',
      marginRight: theme.spacing(2),
    },
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    flex: '1 1',
    border: '1px solid #e8ebed',
    borderRadius: theme.spacing(2),
  },
  walletWrap: {
    flex: '1 1',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  walletAddress: {
    border: '1px solid #dc6a00',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    color: '#dc6a00',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
    '& svg': {
      marginRight: 3,
    },
  },
});
