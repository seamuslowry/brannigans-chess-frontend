import { renderHook, act } from '@testing-library/react-hooks';
import { AxiosError, AxiosResponse } from 'axios';
import { useServiceCall } from './hooks';

test('should be loading before the promise resolves', () => {
  const promise = new Promise<AxiosResponse<string>>(() => {});

  const { result } = renderHook(() => useServiceCall(promise));

  expect(result.current.loading).toBe(true);
  expect(result.current.response).toBeUndefined();
  expect(result.current.error).toBeUndefined();
});

test('should stop loading return result after resolution', async () => {
  const returnVal = 'test';
  let resolve = (a: AxiosResponse<string>) => {
    a.data.toLowerCase();
  };
  const promise = new Promise<AxiosResponse<string>>(res => {
    resolve = res;
  });

  const { result } = renderHook(() => useServiceCall(promise));

  await act(async () => {
    resolve({ data: returnVal } as AxiosResponse<string>);
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.response).toEqual(returnVal);
  expect(result.current.error).toBeUndefined();
});

test('should stop loading return error after rejecting', async () => {
  const returnVal = 'error';
  let reject = (a: AxiosError) => {
    a.message.toLowerCase();
  };
  const promise = new Promise<AxiosResponse<string>>((res, rej) => {
    reject = rej;
  });

  const { result } = renderHook(() => useServiceCall(promise));

  await act(async () => {
    reject({ message: returnVal } as AxiosError);
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.response).toBeUndefined();
  expect(result.current.error).toEqual(returnVal);
});
