import { IPagination } from './types';

export default function getPaginationOffset(pageParams: IPagination) {
  const { pageNumber, pageSize } = pageParams;
  const pageOffset = (pageNumber - 1) * pageSize;
  return pageOffset;
}
