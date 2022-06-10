/* eslint-disable class-methods-use-this */
import { logout } from '@redux/slices/authSlice';
import { storeWrapper } from '@redux/store';
import Constant from '@services/constant';
import axios, { AxiosInstance } from 'axios';
import { NotificationManager } from 'react-notifications';

class AxiosServer {
  private instance: AxiosInstance;

  constructor() {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-type': 'application/json',
      },
    });
    instance.interceptors.response.use(this.handelSuccess, this.handelError);
    this.instance = instance;
  }

  setTokenRequest(token: string) {
    if (token) {
      this.instance.defaults.headers.common['x-access-token'] = token;
    }
  }

  //   getFullUrl(url) {
  //     if (!url.startsWith('/')) {
  //       url = '/' + url;
  //     }
  //     const timeStamp = Date.now();
  //     let hash_key = `${process.env.REACT_APP_API_KEY}_${timeStamp}_${url}`;
  //     this.instance.defaults.headers.common['hash_key'] = crypto.MD5(hash_key).toString();
  //     this.instance.defaults.headers.common['timestamp'] = timeStamp;
  //     return `${process.env.REACT_APP_API_URL}` + url;
  //   }

  handelSuccess(response) {
    if (Constant.CODE.ERROR_RESPONSE === response.data?.code) {
      NotificationManager.warning(response.data?.msg, 'Warning');
    } else if (Constant.CODE.ERROR_AUTHENTICATION === response.data?.code) {
      NotificationManager.warning('Your session is expire', 'Warning');
      // console.log('storeWrapper: ', storeWrapper);
      // Promise.all([storeWrapper.dispatch(logout())]);
    }
    return response.data;
  }

  handelError(error) {
    NotificationManager.error(error.toString(), 'Error');
    return Promise.reject(error);
  }

  get(endpoint, body = {}) {
    return this.instance.get(endpoint, { params: body });
  }

  post(endpoint, body = {}) {
    return this.instance.post(endpoint, body);
  }

  put(endpoint, body = {}) {
    return this.instance.put(endpoint, body);
  }

  patch(endpoint, body = {}) {
    return this.instance.patch(endpoint, body);
  }

  delete(endpoint) {
    return this.instance.delete(endpoint);
  }
}

export default new AxiosServer();
