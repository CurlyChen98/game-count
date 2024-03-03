import axios from 'axios';
import { qsStringify } from '@metaarchit/common-utils/lib/querystring';
import { getResponseError } from '@metaarchit/common-utils/lib/error';

export default {
  install(
    Vue,
    { requestInterceptor, responseInterceptor, beforeError, addRequestHeaders, timeout = 60000 }
  ) {
    axios.defaults.timeout = timeout;
    // axios.defaults.withCredentials = true
    axios.defaults.paramsSerializer = function (params) {
      return qsStringify(params);
    };

    axios.interceptors.request.use(
      requestInterceptor
        ? requestInterceptor
        : async (config) => {
            if (addRequestHeaders) {
              const headers = await addRequestHeaders(config);

              config.headers = { ...config.headers, ...headers };
            }

            return config;
          },
      (err) => {
        return Promise.reject(err);
      }
    );
    axios.interceptors.response.use(
      responseInterceptor
        ? responseInterceptor
        : (config) => {
            return config;
          },
      async (error) => {
        beforeError && (await beforeError(error));

        return Promise.reject(await getResponseError(error));
      }
    );
  },
};
