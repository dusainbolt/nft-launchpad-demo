import { AnyAction, Store } from 'redux';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

export type SSRContext = GetServerSidePropsContext & {
  store: Store<any, AnyAction>;
};

export type SSGContext = GetStaticPropsContext & {
  store: Store<any, AnyAction>;
};

export type StatusField = {
  color: string;
  text: string;
};

export type Paging = {
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
};

export type SearchResponse = {
  data?: any;
  paging: Paging;
};

export type querySearchDefault = { page: number; pageSize: number; sortBy?: string };
