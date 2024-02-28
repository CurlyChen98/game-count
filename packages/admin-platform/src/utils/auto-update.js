import Vue from 'vue';

const intervalTime = ['dev'].includes(process.env.VUE_APP_ENV) ? 1000 * 60 * 5 : 1000 * 60 * 30;
let timer = null;

function getScriptUrls(htmlContent) {
  const scriptUrls = [];
  const scriptTags = htmlContent.match(/<script[^>]*src="([^"]*)"[^>]*>/g) || [];
  for (const tag of scriptTags) {
    const match = tag.match(/src="([^"]*)"/);
    if (match && match[1] && !match[1].includes('?') && match[1].endsWith('.js')) {
      scriptUrls.push(match[1].split('/').pop());
    }
  }
  return scriptUrls;
}

function getLinkUrls(htmlContent) {
  const linkUrls = [];
  const linkTags = htmlContent.match(/<link[^>]*href="([^"]*)"[^>]*>/g) || [];
  for (const tag of linkTags) {
    const match = tag.match(/href="([^"]*)"/);
    if (match && match[1] && !match[1].includes('?') && match[1].endsWith('.css')) {
      linkUrls.push(match[1].split('/').pop());
    }
  }
  return linkUrls;
}

async function getFilesName() {
  let { origin } = window.location;
  let path = process.env.VUE_APP_API_PUBLIC_PATH;
  const response = await fetch(`${origin}${path}/index.html`);
  const htmlContent = await response.text();

  const scriptsList = new Set(getScriptUrls(htmlContent));
  const linksList = new Set(getLinkUrls(htmlContent));
  return {
    scriptsList,
    linksList,
  };
}

let oldFiles = {};
getFilesName().then((res) => {
  oldFiles = res;
  timer = setInterval(checkForUpdates, intervalTime);
});

async function checkForUpdates() {
  getFilesName().then((res) => {
    const scriptsList = res.scriptsList;
    const linksList = res.linksList;
    for (const script of scriptsList) {
      if (!oldFiles.scriptsList.has(script)) return updatePage(script);
    }

    for (const link of linksList) {
      if (!oldFiles.linksList.has(link)) return updatePage(link);
    }
  });
}

async function updatePage() {
  try {
    clearInterval(timer);
    await Vue.prototype.$edgeDialog({
      text: '新版本已經發佈，請點擊確定或刷新獲取最新版本!',
      showCancel: true,
    });
    window.location.reload();
  } catch (error) {
    Vue.prototype.$error(error);
  }
}
