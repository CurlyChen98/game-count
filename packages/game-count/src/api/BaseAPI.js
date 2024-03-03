export const context = process.env.VUE_APP_API_CONTEXT_PATH || '';

export class BaseAPI {
  context = context;
  prefix = '';
  api = '/api';
  version = '/v1';
  path = '';

  constructor(options) {
    if (!options) return;
    if (typeof options === 'string') this.path = options;
    else if (typeof options === 'object') {
      const { path, prefix, context, api, version } = options;
      if (path !== undefined) this.path = path;
      if (prefix !== undefined) this.prefix = prefix;
      if (context !== undefined) this.context = context;
      if (api !== undefined) this.api = api;
      if (version !== undefined) this.version = version;
    }
  }

  _getBasePath({ version } = {}) {
    return `${this.context}${this.prefix}${this.api}${version || this.version}${this.path}`;
  }
}
