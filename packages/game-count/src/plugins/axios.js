import axios from 'axios';

export default {
  install(
    Vue,
    { requestInterceptor, responseInterceptor, beforeError, addRequestHeaders, timeout = 60000 }
  ) {
    axios.defaults.timeout = timeout;
    // axios.defaults.withCredentials = true

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
      }
    );
  },
};
