import { renderHook } from '@testing-library/react-hooks';
import { AxiosResponse, AxiosError } from 'axios';
import useServiceCall from './useServiceCall';

test('should be loading before the promise resolves', async () => {
  const promiseCall = () => new Promise<AxiosResponse<string>>(() => {});

  const { result } = renderHook(() => useServiceCall(promiseCall));

  expect(result.current.loading).toBe(true);
  expect(result.current.response).toBeUndefined();
  expect(result.current.error).toBeUndefined();
});

test('should stop loading return result after resolution', async () => {
  const returnVal = 'test';
  let resolve = (a: AxiosResponse<string>) => {
    a.data.toLowerCase();
  };
  const promiseCall = () =>
    new Promise<AxiosResponse<string>>(res => {
      resolve = res;
    });

  const { result, waitForNextUpdate } = renderHook(() => useServiceCall(promiseCall));

  resolve({ data: returnVal } as AxiosResponse<string>);
  await waitForNextUpdate();

  expect(result.current.loading).toBe(false);
  expect(result.current.response).toEqual(returnVal);
  expect(result.current.error).toBeUndefined();
});

test('should stop loading return error after rejecting', async () => {
  const returnVal = 'error';
  let reject = (a: AxiosError) => {
    a.message.toLowerCase();
  };
  const promiseCall = () =>
    new Promise<AxiosResponse<string>>((res, rej) => {
      reject = rej;
    });

  const { result, waitForNextUpdate } = renderHook(() => useServiceCall(promiseCall));

  reject({ message: returnVal } as AxiosError);
  await waitForNextUpdate();

  expect(result.current.loading).toBe(false);
  expect(result.current.response).toBeUndefined();
  expect(result.current.error).toEqual(returnVal);
});
