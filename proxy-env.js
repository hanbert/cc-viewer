import { createRequire } from 'node:module';

// 纯函数，从 env 中解析代理配置（可独立测试）
export function resolveProxyConfig(env = process.env) {
  const allProxy = env.all_proxy || env.ALL_PROXY;
  return {
    httpProxy: env.http_proxy || env.HTTP_PROXY || allProxy || undefined,
    httpsProxy: env.https_proxy || env.HTTPS_PROXY || allProxy || undefined,
    noProxy: env.no_proxy || env.NO_PROXY || undefined,
  };
}

export function setupProxyEnv() {
  const { httpProxy, httpsProxy, noProxy } = resolveProxyConfig();
  if (!httpProxy && !httpsProxy) return;

  try {
    const require = createRequire(import.meta.url);
    const { EnvHttpProxyAgent, setGlobalDispatcher } = require('undici');
    setGlobalDispatcher(new EnvHttpProxyAgent({ httpProxy, httpsProxy, noProxy }));
    console.error(`[CC Viewer] HTTP proxy: http=${httpProxy || '(none)'}, https=${httpsProxy || '(none)'}${noProxy ? `, no_proxy=${noProxy}` : ''}`);
  } catch (err) {
    console.error(`[CC Viewer] Failed to setup HTTP proxy: ${err.message}`);
  }
}

setupProxyEnv();
