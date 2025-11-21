
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.9.0";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/.pnpm/cookie@1.0.2/node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/cookie@1.0.2/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse3;
    exports.serialize = serialize;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parse3(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = str.indexOf("=", index);
        if (eqIdx === -1)
          break;
        const colonIdx = str.indexOf(";", index);
        const endIdx = colonIdx === -1 ? len : colonIdx;
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const keyStartIdx = startIndex(str, index, eqIdx);
        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        const key = str.slice(keyStartIdx, keyEndIdx);
        if (obj[key] === void 0) {
          let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
          let valEndIdx = endIndex(str, endIdx, valStartIdx);
          const value = dec(str.slice(valStartIdx, valEndIdx));
          obj[key] = value;
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function startIndex(str, index, max) {
      do {
        const code = str.charCodeAt(index);
        if (code !== 32 && code !== 9)
          return index;
      } while (++index < max);
      return max;
    }
    function endIndex(str, index, min) {
      while (index > min) {
        const code = str.charCodeAt(--index);
        if (code !== 32 && code !== 9)
          return index + 1;
      }
      return min;
    }
    function serialize(name, val, options) {
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`argument name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${val}`);
      }
      let str = name + "=" + value;
      if (!options)
        return str;
      if (options.maxAge !== void 0) {
        if (!Number.isInteger(options.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
        }
        str += "; Max-Age=" + options.maxAge;
      }
      if (options.domain) {
        if (!domainValueRegExp.test(options.domain)) {
          throw new TypeError(`option domain is invalid: ${options.domain}`);
        }
        str += "; Domain=" + options.domain;
      }
      if (options.path) {
        if (!pathValueRegExp.test(options.path)) {
          throw new TypeError(`option path is invalid: ${options.path}`);
        }
        str += "; Path=" + options.path;
      }
      if (options.expires) {
        if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${options.expires}`);
        }
        str += "; Expires=" + options.expires.toUTCString();
      }
      if (options.httpOnly) {
        str += "; HttpOnly";
      }
      if (options.secure) {
        str += "; Secure";
      }
      if (options.partitioned) {
        str += "; Partitioned";
      }
      if (options.priority) {
        const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${options.priority}`);
        }
      }
      if (options.sameSite) {
        const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
        }
      }
      return str;
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/prerender-manifest.js
var require_prerender_manifest = __commonJS({
  ".next/prerender-manifest.js"() {
    "use strict";
    self.__PRERENDER_MANIFEST = '{"version":4,"routes":{"/dashboard/notes":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/dashboard/notes","dataRoute":"/dashboard/notes.rsc"},"/dashboard/leads":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/dashboard/leads","dataRoute":"/dashboard/leads.rsc"},"/dashboard/projects/new":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/dashboard/projects/new","dataRoute":"/dashboard/projects/new.rsc"},"/dashboard/projects":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/dashboard/projects","dataRoute":"/dashboard/projects.rsc"},"/dashboard/sales":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/dashboard/sales","dataRoute":"/dashboard/sales.rsc"},"/login":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/login","dataRoute":"/login.rsc"},"/dashboard/admin":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/dashboard/admin","dataRoute":"/dashboard/admin.rsc"},"/dashboard":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/dashboard","dataRoute":"/dashboard.rsc"},"/dashboard/tasks":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/dashboard/tasks","dataRoute":"/dashboard/tasks.rsc"},"/":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/","dataRoute":"/index.rsc"},"/favicon.ico":{"initialHeaders":{"cache-control":"public, max-age=0, must-revalidate","content-type":"image/x-icon","x-next-cache-tags":"_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico"},"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/favicon.ico","dataRoute":null},"/dashboard/people":{"experimentalBypassFor":[{"type":"header","key":"Next-Action"},{"type":"header","key":"content-type","value":"multipart/form-data;.*"}],"initialRevalidateSeconds":false,"srcRoute":"/dashboard/people","dataRoute":"/dashboard/people.rsc"}},"dynamicRoutes":{},"notFoundRoutes":[],"preview":{"previewModeId":"process.env.__NEXT_PREVIEW_MODE_ID","previewModeSigningKey":"process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY","previewModeEncryptionKey":"process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY"}}';
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var e = {}, r = {};
      function t(o) {
        var n = r[o];
        if (void 0 !== n) return n.exports;
        var i = r[o] = { exports: {} }, l = true;
        try {
          e[o](i, i.exports, t), l = false;
        } finally {
          l && delete r[o];
        }
        return i.exports;
      }
      t.m = e, t.amdO = {}, (() => {
        var e2 = [];
        t.O = (r2, o, n, i) => {
          if (o) {
            i = i || 0;
            for (var l = e2.length; l > 0 && e2[l - 1][2] > i; l--) e2[l] = e2[l - 1];
            e2[l] = [o, n, i];
            return;
          }
          for (var a = 1 / 0, l = 0; l < e2.length; l++) {
            for (var [o, n, i] = e2[l], u = true, f = 0; f < o.length; f++) a >= i && Object.keys(t.O).every((e3) => t.O[e3](o[f])) ? o.splice(f--, 1) : (u = false, i < a && (a = i));
            if (u) {
              e2.splice(l--, 1);
              var s = n();
              void 0 !== s && (r2 = s);
            }
          }
          return r2;
        };
      })(), t.n = (e2) => {
        var r2 = e2 && e2.__esModule ? () => e2.default : () => e2;
        return t.d(r2, { a: r2 }), r2;
      }, t.d = (e2, r2) => {
        for (var o in r2) t.o(r2, o) && !t.o(e2, o) && Object.defineProperty(e2, o, { enumerable: true, get: r2[o] });
      }, t.e = () => Promise.resolve(), t.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (e2) {
          if ("object" == typeof window) return window;
        }
      }(), t.o = (e2, r2) => Object.prototype.hasOwnProperty.call(e2, r2), t.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, (() => {
        var e2 = { 993: 0 };
        t.O.j = (r3) => 0 === e2[r3];
        var r2 = (r3, o2) => {
          var n, i, [l, a, u] = o2, f = 0;
          if (l.some((r4) => 0 !== e2[r4])) {
            for (n in a) t.o(a, n) && (t.m[n] = a[n]);
            if (u) var s = u(t);
          }
          for (r3 && r3(o2); f < l.length; f++) i = l[f], t.o(e2, i) && e2[i] && e2[i][0](), e2[i] = 0;
          return t.O(s);
        }, o = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
        o.forEach(r2.bind(null, 0)), o.push = r2.bind(null, o.push.bind(o));
      })();
    })();
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// .next/server/src/middleware.js
var require_middleware = __commonJS({
  ".next/server/src/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[727], { 2067: (e) => {
      "use strict";
      e.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 6195: (e) => {
      "use strict";
      e.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 4880: (e, t, r) => {
      "use strict";
      let n, a, i;
      r.r(t), r.d(t, { default: () => tj });
      var o, s, l, c, d, u, p, h, g, f, m, b, w = {};
      async function v() {
        let e10 = "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && (await _ENTRIES.middleware_instrumentation).register;
        if (e10) try {
          await e10();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      r.r(w), r.d(w, { config: () => tk, middleware: () => tI });
      let y = null;
      function S() {
        return y || (y = v()), y;
      }
      function _(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== r.g.process && (process.env = r.g.process.env, r.g.process = process), Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
        let t2 = new Proxy(function() {
        }, { get(t3, r2) {
          if ("then" === r2) return {};
          throw Error(_(e10));
        }, construct() {
          throw Error(_(e10));
        }, apply(r2, n2, a2) {
          if ("function" == typeof a2[0]) return a2[0](t2);
          throw Error(_(e10));
        } });
        return new Proxy({}, { get: () => t2 });
      }, enumerable: false, configurable: false }), S();
      class x extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class E extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class P extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      function R(e10) {
        let t2 = {}, r2 = [];
        if (e10) for (let [n2, a2] of e10.entries()) "set-cookie" === n2.toLowerCase() ? (r2.push(...function(e11) {
          var t3, r3, n3, a3, i2, o2 = [], s2 = 0;
          function l2() {
            for (; s2 < e11.length && /\s/.test(e11.charAt(s2)); ) s2 += 1;
            return s2 < e11.length;
          }
          for (; s2 < e11.length; ) {
            for (t3 = s2, i2 = false; l2(); ) if ("," === (r3 = e11.charAt(s2))) {
              for (n3 = s2, s2 += 1, l2(), a3 = s2; s2 < e11.length && "=" !== (r3 = e11.charAt(s2)) && ";" !== r3 && "," !== r3; ) s2 += 1;
              s2 < e11.length && "=" === e11.charAt(s2) ? (i2 = true, s2 = a3, o2.push(e11.substring(t3, n3)), t3 = s2) : s2 = n3 + 1;
            } else s2 += 1;
            (!i2 || s2 >= e11.length) && o2.push(e11.substring(t3, e11.length));
          }
          return o2;
        }(a2)), t2[n2] = 1 === r2.length ? r2[0] : r2) : t2[n2] = a2;
        return t2;
      }
      function O(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t2) {
          throw Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t2 });
        }
      }
      let T = Symbol("response"), C = Symbol("passThrough"), N = Symbol("waitUntil");
      class A {
        constructor(e10) {
          this[N] = [], this[C] = false;
        }
        respondWith(e10) {
          this[T] || (this[T] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[C] = true;
        }
        waitUntil(e10) {
          this[N].push(e10);
        }
      }
      class I extends A {
        constructor(e10) {
          super(e10.request), this.sourcePage = e10.page;
        }
        get request() {
          throw new x({ page: this.sourcePage });
        }
        respondWith() {
          throw new x({ page: this.sourcePage });
        }
      }
      function k(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function M(e10) {
        let t2 = e10.indexOf("#"), r2 = e10.indexOf("?"), n2 = r2 > -1 && (t2 < 0 || r2 < t2);
        return n2 || t2 > -1 ? { pathname: e10.substring(0, n2 ? r2 : t2), query: n2 ? e10.substring(r2, t2 > -1 ? t2 : void 0) : "", hash: t2 > -1 ? e10.slice(t2) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function L(e10, t2) {
        if (!e10.startsWith("/") || !t2) return e10;
        let { pathname: r2, query: n2, hash: a2 } = M(e10);
        return "" + t2 + r2 + n2 + a2;
      }
      function D(e10, t2) {
        if (!e10.startsWith("/") || !t2) return e10;
        let { pathname: r2, query: n2, hash: a2 } = M(e10);
        return "" + r2 + t2 + n2 + a2;
      }
      function j(e10, t2) {
        if ("string" != typeof e10) return false;
        let { pathname: r2 } = M(e10);
        return r2 === t2 || r2.startsWith(t2 + "/");
      }
      function U(e10, t2) {
        let r2;
        let n2 = e10.split("/");
        return (t2 || []).some((t3) => !!n2[1] && n2[1].toLowerCase() === t3.toLowerCase() && (r2 = t3, n2.splice(1, 1), e10 = n2.join("/") || "/", true)), { pathname: e10, detectedLocale: r2 };
      }
      let V = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function H(e10, t2) {
        return new URL(String(e10).replace(V, "localhost"), t2 && String(t2).replace(V, "localhost"));
      }
      let W = Symbol("NextURLInternal");
      class $ {
        constructor(e10, t2, r2) {
          let n2, a2;
          "object" == typeof t2 && "pathname" in t2 || "string" == typeof t2 ? (n2 = t2, a2 = r2 || {}) : a2 = r2 || t2 || {}, this[W] = { url: H(e10, n2 ?? a2.base), options: a2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t2, r2, n2, a2;
          let i2 = function(e11, t3) {
            var r3, n3;
            let { basePath: a3, i18n: i3, trailingSlash: o3 } = null != (r3 = t3.nextConfig) ? r3 : {}, s3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : o3 };
            a3 && j(s3.pathname, a3) && (s3.pathname = function(e12, t4) {
              if (!j(e12, t4)) return e12;
              let r4 = e12.slice(t4.length);
              return r4.startsWith("/") ? r4 : "/" + r4;
            }(s3.pathname, a3), s3.basePath = a3);
            let l2 = s3.pathname;
            if (s3.pathname.startsWith("/_next/data/") && s3.pathname.endsWith(".json")) {
              let e12 = s3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/"), r4 = e12[0];
              s3.buildId = r4, l2 = "index" !== e12[1] ? "/" + e12.slice(1).join("/") : "/", true === t3.parseData && (s3.pathname = l2);
            }
            if (i3) {
              let e12 = t3.i18nProvider ? t3.i18nProvider.analyze(s3.pathname) : U(s3.pathname, i3.locales);
              s3.locale = e12.detectedLocale, s3.pathname = null != (n3 = e12.pathname) ? n3 : s3.pathname, !e12.detectedLocale && s3.buildId && (e12 = t3.i18nProvider ? t3.i18nProvider.analyze(l2) : U(l2, i3.locales)).detectedLocale && (s3.locale = e12.detectedLocale);
            }
            return s3;
          }(this[W].url.pathname, { nextConfig: this[W].options.nextConfig, parseData: true, i18nProvider: this[W].options.i18nProvider }), o2 = function(e11, t3) {
            let r3;
            if ((null == t3 ? void 0 : t3.host) && !Array.isArray(t3.host)) r3 = t3.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r3 = e11.hostname;
            }
            return r3.toLowerCase();
          }(this[W].url, this[W].options.headers);
          this[W].domainLocale = this[W].options.i18nProvider ? this[W].options.i18nProvider.detectDomainLocale(o2) : function(e11, t3, r3) {
            if (e11) for (let i3 of (r3 && (r3 = r3.toLowerCase()), e11)) {
              var n3, a3;
              if (t3 === (null == (n3 = i3.domain) ? void 0 : n3.split(":", 1)[0].toLowerCase()) || r3 === i3.defaultLocale.toLowerCase() || (null == (a3 = i3.locales) ? void 0 : a3.some((e12) => e12.toLowerCase() === r3))) return i3;
            }
          }(null == (t2 = this[W].options.nextConfig) ? void 0 : null == (e10 = t2.i18n) ? void 0 : e10.domains, o2);
          let s2 = (null == (r2 = this[W].domainLocale) ? void 0 : r2.defaultLocale) || (null == (a2 = this[W].options.nextConfig) ? void 0 : null == (n2 = a2.i18n) ? void 0 : n2.defaultLocale);
          this[W].url.pathname = i2.pathname, this[W].defaultLocale = s2, this[W].basePath = i2.basePath ?? "", this[W].buildId = i2.buildId, this[W].locale = i2.locale ?? s2, this[W].trailingSlash = i2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t2;
          return t2 = function(e11, t3, r2, n2) {
            if (!t3 || t3 === r2) return e11;
            let a2 = e11.toLowerCase();
            return !n2 && (j(a2, "/api") || j(a2, "/" + t3.toLowerCase())) ? e11 : L(e11, "/" + t3);
          }((e10 = { basePath: this[W].basePath, buildId: this[W].buildId, defaultLocale: this[W].options.forceLocale ? void 0 : this[W].defaultLocale, locale: this[W].locale, pathname: this[W].url.pathname, trailingSlash: this[W].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t2 = k(t2)), e10.buildId && (t2 = D(L(t2, "/_next/data/" + e10.buildId), "/" === e10.pathname ? "index.json" : ".json")), t2 = L(t2, e10.basePath), !e10.buildId && e10.trailingSlash ? t2.endsWith("/") ? t2 : D(t2, "/") : k(t2);
        }
        formatSearch() {
          return this[W].url.search;
        }
        get buildId() {
          return this[W].buildId;
        }
        set buildId(e10) {
          this[W].buildId = e10;
        }
        get locale() {
          return this[W].locale ?? "";
        }
        set locale(e10) {
          var t2, r2;
          if (!this[W].locale || !(null == (r2 = this[W].options.nextConfig) ? void 0 : null == (t2 = r2.i18n) ? void 0 : t2.locales.includes(e10))) throw TypeError(`The NextURL configuration includes no locale "${e10}"`);
          this[W].locale = e10;
        }
        get defaultLocale() {
          return this[W].defaultLocale;
        }
        get domainLocale() {
          return this[W].domainLocale;
        }
        get searchParams() {
          return this[W].url.searchParams;
        }
        get host() {
          return this[W].url.host;
        }
        set host(e10) {
          this[W].url.host = e10;
        }
        get hostname() {
          return this[W].url.hostname;
        }
        set hostname(e10) {
          this[W].url.hostname = e10;
        }
        get port() {
          return this[W].url.port;
        }
        set port(e10) {
          this[W].url.port = e10;
        }
        get protocol() {
          return this[W].url.protocol;
        }
        set protocol(e10) {
          this[W].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t2 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t2}${this.hash}`;
        }
        set href(e10) {
          this[W].url = H(e10), this.analyze();
        }
        get origin() {
          return this[W].url.origin;
        }
        get pathname() {
          return this[W].url.pathname;
        }
        set pathname(e10) {
          this[W].url.pathname = e10;
        }
        get hash() {
          return this[W].url.hash;
        }
        set hash(e10) {
          this[W].url.hash = e10;
        }
        get search() {
          return this[W].url.search;
        }
        set search(e10) {
          this[W].url.search = e10;
        }
        get password() {
          return this[W].url.password;
        }
        set password(e10) {
          this[W].url.password = e10;
        }
        get username() {
          return this[W].url.username;
        }
        set username(e10) {
          this[W].url.username = e10;
        }
        get basePath() {
          return this[W].basePath;
        }
        set basePath(e10) {
          this[W].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new $(String(this), this[W].options);
        }
      }
      var q = r(5066);
      let B = Symbol("internal request");
      class K extends Request {
        constructor(e10, t2 = {}) {
          let r2 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          O(r2), e10 instanceof Request ? super(e10, t2) : super(r2, t2);
          let n2 = new $(r2, { headers: R(this.headers), nextConfig: t2.nextConfig });
          this[B] = { cookies: new q.RequestCookies(this.headers), geo: t2.geo || {}, ip: t2.ip, nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, geo: this.geo, ip: this.ip, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[B].cookies;
        }
        get geo() {
          return this[B].geo;
        }
        get ip() {
          return this[B].ip;
        }
        get nextUrl() {
          return this[B].nextUrl;
        }
        get page() {
          throw new E();
        }
        get ua() {
          throw new P();
        }
        get url() {
          return this[B].url;
        }
      }
      let J = Symbol("internal response"), G = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function F(e10, t2) {
        var r2;
        if (null == e10 ? void 0 : null == (r2 = e10.request) ? void 0 : r2.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Error("request.headers must be an instance of Headers");
          let r3 = [];
          for (let [n2, a2] of e10.request.headers) t2.set("x-middleware-request-" + n2, a2), r3.push(n2);
          t2.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class z extends Response {
        constructor(e10, t2 = {}) {
          super(e10, t2), this[J] = { cookies: new q.ResponseCookies(this.headers), url: t2.url ? new $(t2.url, { headers: R(this.headers), nextConfig: t2.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[J].cookies;
        }
        static json(e10, t2) {
          let r2 = Response.json(e10, t2);
          return new z(r2.body, r2);
        }
        static redirect(e10, t2) {
          let r2 = "number" == typeof t2 ? t2 : (null == t2 ? void 0 : t2.status) ?? 307;
          if (!G.has(r2)) throw RangeError('Failed to execute "redirect" on "response": Invalid status code');
          let n2 = "object" == typeof t2 ? t2 : {}, a2 = new Headers(null == n2 ? void 0 : n2.headers);
          return a2.set("Location", O(e10)), new z(null, { ...n2, headers: a2, status: r2 });
        }
        static rewrite(e10, t2) {
          let r2 = new Headers(null == t2 ? void 0 : t2.headers);
          return r2.set("x-middleware-rewrite", O(e10)), F(t2, r2), new z(null, { ...t2, headers: r2 });
        }
        static next(e10) {
          let t2 = new Headers(null == e10 ? void 0 : e10.headers);
          return t2.set("x-middleware-next", "1"), F(e10, t2), new z(null, { ...e10, headers: t2 });
        }
      }
      function X(e10, t2) {
        let r2 = "string" == typeof t2 ? new URL(t2) : t2, n2 = new URL(e10, t2), a2 = r2.protocol + "//" + r2.host;
        return n2.protocol + "//" + n2.host === a2 ? n2.toString().replace(a2, "") : n2.toString();
      }
      let Y = [["RSC"], ["Next-Router-State-Tree"], ["Next-Router-Prefetch"]];
      r(641);
      let Z = { client: "client", server: "server", edgeServer: "edge-server" };
      Z.client, Z.server, Z.edgeServer, Symbol("polyfills");
      let Q = ["__nextFallback", "__nextLocale", "__nextInferredLocaleFromDefault", "__nextDefaultLocale", "__nextIsNotFound", "_rsc"], ee = ["__nextDataReq"], et = "nxtP", er = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", api: "api", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", appMetadataRoute: "app-metadata-route", appRouteHandler: "app-route-handler" };
      ({ ...er, GROUP: { serverOnly: [er.reactServerComponents, er.actionBrowser, er.appMetadataRoute, er.appRouteHandler, er.instrument], clientOnly: [er.serverSideRendering, er.appPagesBrowser], nonClientServerTarget: [er.middleware, er.api], app: [er.reactServerComponents, er.actionBrowser, er.appMetadataRoute, er.appRouteHandler, er.serverSideRendering, er.appPagesBrowser, er.shared, er.instrument] } });
      class en {
        static get(e10, t2, r2) {
          let n2 = Reflect.get(e10, t2, r2);
          return "function" == typeof n2 ? n2.bind(e10) : n2;
        }
        static set(e10, t2, r2, n2) {
          return Reflect.set(e10, t2, r2, n2);
        }
        static has(e10, t2) {
          return Reflect.has(e10, t2);
        }
        static deleteProperty(e10, t2) {
          return Reflect.deleteProperty(e10, t2);
        }
      }
      class ea extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new ea();
        }
      }
      class ei extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t2, r2, n2) {
            if ("symbol" == typeof r2) return en.get(t2, r2, n2);
            let a2 = r2.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === a2);
            if (void 0 !== i2) return en.get(t2, i2, n2);
          }, set(t2, r2, n2, a2) {
            if ("symbol" == typeof r2) return en.set(t2, r2, n2, a2);
            let i2 = r2.toLowerCase(), o2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            return en.set(t2, o2 ?? r2, n2, a2);
          }, has(t2, r2) {
            if ("symbol" == typeof r2) return en.has(t2, r2);
            let n2 = r2.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 !== a2 && en.has(t2, a2);
          }, deleteProperty(t2, r2) {
            if ("symbol" == typeof r2) return en.deleteProperty(t2, r2);
            let n2 = r2.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 === a2 || en.deleteProperty(t2, a2);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t2, r2) {
            switch (t2) {
              case "append":
              case "delete":
              case "set":
                return ea.callable;
              default:
                return en.get(e11, t2, r2);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new ei(e10);
        }
        append(e10, t2) {
          let r2 = this.headers[e10];
          "string" == typeof r2 ? this.headers[e10] = [r2, t2] : Array.isArray(r2) ? r2.push(t2) : this.headers[e10] = t2;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t2 = this.headers[e10];
          return void 0 !== t2 ? this.merge(t2) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t2) {
          this.headers[e10] = t2;
        }
        forEach(e10, t2) {
          for (let [r2, n2] of this.entries()) e10.call(t2, n2, r2, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t2 = e10.toLowerCase(), r2 = this.get(t2);
            yield [t2, r2];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t2 = e10.toLowerCase();
            yield t2;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t2 = this.get(e10);
            yield t2;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      var eo = r(9510);
      class es extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
        }
        static callable() {
          throw new es();
        }
      }
      class el {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t2, r2) {
            switch (t2) {
              case "clear":
              case "delete":
              case "set":
                return es.callable;
              default:
                return en.get(e11, t2, r2);
            }
          } });
        }
      }
      let ec = Symbol.for("next.mutated.cookies");
      class ed {
        static wrap(e10, t2) {
          let r2 = new q.ResponseCookies(new Headers());
          for (let t3 of e10.getAll()) r2.set(t3);
          let n2 = [], a2 = /* @__PURE__ */ new Set(), i2 = () => {
            let e11 = eo.A.getStore();
            if (e11 && (e11.pathWasRevalidated = true), n2 = r2.getAll().filter((e12) => a2.has(e12.name)), t2) {
              let e12 = [];
              for (let t3 of n2) {
                let r3 = new q.ResponseCookies(new Headers());
                r3.set(t3), e12.push(r3.toString());
              }
              t2(e12);
            }
          };
          return new Proxy(r2, { get(e11, t3, r3) {
            switch (t3) {
              case ec:
                return n2;
              case "delete":
                return function(...t4) {
                  a2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    e11.delete(...t4);
                  } finally {
                    i2();
                  }
                };
              case "set":
                return function(...t4) {
                  a2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    return e11.set(...t4);
                  } finally {
                    i2();
                  }
                };
              default:
                return en.get(e11, t3, r3);
            }
          } });
        }
      }
      !function(e10) {
        e10.handleRequest = "BaseServer.handleRequest", e10.run = "BaseServer.run", e10.pipe = "BaseServer.pipe", e10.getStaticHTML = "BaseServer.getStaticHTML", e10.render = "BaseServer.render", e10.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e10.renderToResponse = "BaseServer.renderToResponse", e10.renderToHTML = "BaseServer.renderToHTML", e10.renderError = "BaseServer.renderError", e10.renderErrorToResponse = "BaseServer.renderErrorToResponse", e10.renderErrorToHTML = "BaseServer.renderErrorToHTML", e10.render404 = "BaseServer.render404";
      }(o || (o = {})), function(e10) {
        e10.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e10.loadComponents = "LoadComponents.loadComponents";
      }(s || (s = {})), function(e10) {
        e10.getRequestHandler = "NextServer.getRequestHandler", e10.getServer = "NextServer.getServer", e10.getServerRequestHandler = "NextServer.getServerRequestHandler", e10.createServer = "createServer.createServer";
      }(l || (l = {})), function(e10) {
        e10.compression = "NextNodeServer.compression", e10.getBuildId = "NextNodeServer.getBuildId", e10.createComponentTree = "NextNodeServer.createComponentTree", e10.clientComponentLoading = "NextNodeServer.clientComponentLoading", e10.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e10.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e10.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e10.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e10.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e10.sendRenderResult = "NextNodeServer.sendRenderResult", e10.proxyRequest = "NextNodeServer.proxyRequest", e10.runApi = "NextNodeServer.runApi", e10.render = "NextNodeServer.render", e10.renderHTML = "NextNodeServer.renderHTML", e10.imageOptimizer = "NextNodeServer.imageOptimizer", e10.getPagePath = "NextNodeServer.getPagePath", e10.getRoutesManifest = "NextNodeServer.getRoutesManifest", e10.findPageComponents = "NextNodeServer.findPageComponents", e10.getFontManifest = "NextNodeServer.getFontManifest", e10.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e10.getRequestHandler = "NextNodeServer.getRequestHandler", e10.renderToHTML = "NextNodeServer.renderToHTML", e10.renderError = "NextNodeServer.renderError", e10.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e10.render404 = "NextNodeServer.render404", e10.startResponse = "NextNodeServer.startResponse", e10.route = "route", e10.onProxyReq = "onProxyReq", e10.apiResolver = "apiResolver", e10.internalFetch = "internalFetch";
      }(c || (c = {})), (d || (d = {})).startServer = "startServer.startServer", function(e10) {
        e10.getServerSideProps = "Render.getServerSideProps", e10.getStaticProps = "Render.getStaticProps", e10.renderToString = "Render.renderToString", e10.renderDocument = "Render.renderDocument", e10.createBodyResult = "Render.createBodyResult";
      }(u || (u = {})), function(e10) {
        e10.renderToString = "AppRender.renderToString", e10.renderToReadableStream = "AppRender.renderToReadableStream", e10.getBodyResult = "AppRender.getBodyResult", e10.fetch = "AppRender.fetch";
      }(p || (p = {})), (h || (h = {})).executeRoute = "Router.executeRoute", (g || (g = {})).runHandler = "Node.runHandler", (f || (f = {})).runHandler = "AppRouteRouteHandlers.runHandler", function(e10) {
        e10.generateMetadata = "ResolveMetadata.generateMetadata", e10.generateViewport = "ResolveMetadata.generateViewport";
      }(m || (m = {})), (b || (b = {})).execute = "Middleware.execute";
      let eu = ["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"], ep = ["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"], { context: eh, propagation: eg, trace: ef, SpanStatusCode: em, SpanKind: eb, ROOT_CONTEXT: ew } = n = r(4213), ev = (e10) => null !== e10 && "object" == typeof e10 && "function" == typeof e10.then, ey = (e10, t2) => {
        (null == t2 ? void 0 : t2.bubble) === true ? e10.setAttribute("next.bubble", true) : (t2 && e10.recordException(t2), e10.setStatus({ code: em.ERROR, message: null == t2 ? void 0 : t2.message })), e10.end();
      }, eS = /* @__PURE__ */ new Map(), e_ = n.createContextKey("next.rootSpanId"), ex = 0, eE = () => ex++;
      class eP {
        getTracerInstance() {
          return ef.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return eh;
        }
        getActiveScopeSpan() {
          return ef.getSpan(null == eh ? void 0 : eh.active());
        }
        withPropagatedContext(e10, t2, r2) {
          let n2 = eh.active();
          if (ef.getSpanContext(n2)) return t2();
          let a2 = eg.extract(n2, e10, r2);
          return eh.with(a2, t2);
        }
        trace(...e10) {
          var t2;
          let [r2, n2, a2] = e10, { fn: i2, options: o2 } = "function" == typeof n2 ? { fn: n2, options: {} } : { fn: a2, options: { ...n2 } }, s2 = o2.spanName ?? r2;
          if (!eu.includes(r2) && "1" !== process.env.NEXT_OTEL_VERBOSE || o2.hideSpan) return i2();
          let l2 = this.getSpanContext((null == o2 ? void 0 : o2.parentSpan) ?? this.getActiveScopeSpan()), c2 = false;
          l2 ? (null == (t2 = ef.getSpanContext(l2)) ? void 0 : t2.isRemote) && (c2 = true) : (l2 = (null == eh ? void 0 : eh.active()) ?? ew, c2 = true);
          let d2 = eE();
          return o2.attributes = { "next.span_name": s2, "next.span_type": r2, ...o2.attributes }, eh.with(l2.setValue(e_, d2), () => this.getTracerInstance().startActiveSpan(s2, o2, (e11) => {
            let t3 = "performance" in globalThis ? globalThis.performance.now() : void 0, n3 = () => {
              eS.delete(d2), t3 && process.env.NEXT_OTEL_PERFORMANCE_PREFIX && ep.includes(r2 || "") && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(r2.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: t3, end: performance.now() });
            };
            c2 && eS.set(d2, new Map(Object.entries(o2.attributes ?? {})));
            try {
              if (i2.length > 1) return i2(e11, (t5) => ey(e11, t5));
              let t4 = i2(e11);
              if (ev(t4)) return t4.then((t5) => (e11.end(), t5)).catch((t5) => {
                throw ey(e11, t5), t5;
              }).finally(n3);
              return e11.end(), n3(), t4;
            } catch (t4) {
              throw ey(e11, t4), n3(), t4;
            }
          }));
        }
        wrap(...e10) {
          let t2 = this, [r2, n2, a2] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eu.includes(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n2;
            "function" == typeof e11 && "function" == typeof a2 && (e11 = e11.apply(this, arguments));
            let i2 = arguments.length - 1, o2 = arguments[i2];
            if ("function" != typeof o2) return t2.trace(r2, e11, () => a2.apply(this, arguments));
            {
              let n3 = t2.getContext().bind(eh.active(), o2);
              return t2.trace(r2, e11, (e12, t3) => (arguments[i2] = function(e13) {
                return null == t3 || t3(e13), n3.apply(this, arguments);
              }, a2.apply(this, arguments)));
            }
          } : a2;
        }
        startSpan(...e10) {
          let [t2, r2] = e10, n2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t2, r2, n2);
        }
        getSpanContext(e10) {
          return e10 ? ef.setSpan(eh.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = eh.active().getValue(e_);
          return eS.get(e10);
        }
      }
      let eR = (() => {
        let e10 = new eP();
        return () => e10;
      })(), eO = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(eO);
      class eT {
        constructor(e10, t2, r2, n2) {
          var a2;
          let i2 = e10 && function(e11, t3) {
            let r3 = ei.from(e11.headers);
            return { isOnDemandRevalidate: r3.get("x-prerender-revalidate") === t3.previewModeId, revalidateOnlyGenerated: r3.has("x-prerender-revalidate-if-generated") };
          }(t2, e10).isOnDemandRevalidate, o2 = null == (a2 = r2.get(eO)) ? void 0 : a2.value;
          this.isEnabled = !!(!i2 && o2 && e10 && o2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n2;
        }
        enable() {
          if (!this._previewModeId) throw Error("Invariant: previewProps missing previewModeId this should never happen");
          this._mutableCookies.set({ name: eO, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" });
        }
        disable() {
          this._mutableCookies.set({ name: eO, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) });
        }
      }
      let eC = { wrap(e10, { req: t2, res: r2, renderOpts: n2 }, a2) {
        let i2;
        function o2(e11) {
          r2 && r2.setHeader("Set-Cookie", e11);
        }
        n2 && "previewProps" in n2 && (i2 = n2.previewProps);
        let s2 = {}, l2 = { get headers() {
          return s2.headers || (s2.headers = function(e11) {
            let t3 = ei.from(e11);
            for (let e12 of Y) t3.delete(e12.toString().toLowerCase());
            return ei.seal(t3);
          }(t2.headers)), s2.headers;
        }, get cookies() {
          return s2.cookies || (s2.cookies = function(e11) {
            let t3 = new q.RequestCookies(ei.from(e11));
            return el.seal(t3);
          }(t2.headers)), s2.cookies;
        }, get mutableCookies() {
          return s2.mutableCookies || (s2.mutableCookies = function(e11, t3) {
            let r3 = new q.RequestCookies(ei.from(e11));
            return ed.wrap(r3, t3);
          }(t2.headers, (null == n2 ? void 0 : n2.onUpdateCookies) || (r2 ? o2 : void 0))), s2.mutableCookies;
        }, get draftMode() {
          return s2.draftMode || (s2.draftMode = new eT(i2, t2, this.cookies, this.mutableCookies)), s2.draftMode;
        }, reactLoadableManifest: (null == n2 ? void 0 : n2.reactLoadableManifest) || {}, assetPrefix: (null == n2 ? void 0 : n2.assetPrefix) || "" };
        return e10.run(l2, a2, l2);
      } };
      var eN = r(5945);
      class eA extends K {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw new x({ page: this.sourcePage });
        }
        respondWith() {
          throw new x({ page: this.sourcePage });
        }
        waitUntil() {
          throw new x({ page: this.sourcePage });
        }
      }
      let eI = { keys: (e10) => Array.from(e10.keys()), get: (e10, t2) => e10.get(t2) ?? void 0 }, ek = (e10, t2) => eR().withPropagatedContext(e10.headers, t2, eI), eM = false;
      async function eL(e10) {
        let t2, n2;
        !function() {
          if (!eM && (eM = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: e11, wrapRequestHandler: t3 } = r(1423);
            e11(), ek = t3(ek);
          }
        }(), await S();
        let a2 = void 0 !== self.__BUILD_MANIFEST, i2 = "string" == typeof self.__PRERENDER_MANIFEST ? JSON.parse(self.__PRERENDER_MANIFEST) : void 0;
        e10.request.url = e10.request.url.replace(/\.rsc($|\?)/, "$1");
        let o2 = new $(e10.request.url, { headers: e10.request.headers, nextConfig: e10.request.nextConfig });
        for (let e11 of [...o2.searchParams.keys()]) {
          let t3 = o2.searchParams.getAll(e11);
          if (e11 !== et && e11.startsWith(et)) {
            let r2 = e11.substring(et.length);
            for (let e12 of (o2.searchParams.delete(r2), t3)) o2.searchParams.append(r2, e12);
            o2.searchParams.delete(e11);
          }
        }
        let s2 = o2.buildId;
        o2.buildId = "";
        let l2 = e10.request.headers["x-nextjs-data"];
        l2 && "/index" === o2.pathname && (o2.pathname = "/");
        let c2 = function(e11) {
          let t3 = new Headers();
          for (let [r2, n3] of Object.entries(e11)) for (let e12 of Array.isArray(n3) ? n3 : [n3]) void 0 !== e12 && ("number" == typeof e12 && (e12 = e12.toString()), t3.append(r2, e12));
          return t3;
        }(e10.request.headers), d2 = /* @__PURE__ */ new Map();
        if (!a2) for (let e11 of Y) {
          let t3 = e11.toString().toLowerCase();
          c2.get(t3) && (d2.set(t3, c2.get(t3)), c2.delete(t3));
        }
        let u2 = new eA({ page: e10.page, input: function(e11, t3) {
          let r2 = "string" == typeof e11, n3 = r2 ? new URL(e11) : e11;
          for (let e12 of Q) n3.searchParams.delete(e12);
          if (t3) for (let e12 of ee) n3.searchParams.delete(e12);
          return r2 ? n3.toString() : n3;
        }(o2, true).toString(), init: { body: e10.request.body, geo: e10.request.geo, headers: c2, ip: e10.request.ip, method: e10.request.method, nextConfig: e10.request.nextConfig, signal: e10.request.signal } });
        l2 && Object.defineProperty(u2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCache && e10.IncrementalCache && (globalThis.__incrementalCache = new e10.IncrementalCache({ appDir: true, fetchCache: true, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: e10.request.headers, requestProtocol: "https", getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: { previewModeId: "development-id" } }) }));
        let p2 = new I({ request: u2, page: e10.page });
        if ((t2 = await ek(u2, () => "/middleware" === e10.page || "/src/middleware" === e10.page ? eR().trace(b.execute, { spanName: `middleware ${u2.method} ${u2.nextUrl.pathname}`, attributes: { "http.target": u2.nextUrl.pathname, "http.method": u2.method } }, () => eC.wrap(eN.F, { req: u2, renderOpts: { onUpdateCookies: (e11) => {
          n2 = e11;
        }, previewProps: (null == i2 ? void 0 : i2.preview) || { previewModeId: "development-id", previewModeEncryptionKey: "", previewModeSigningKey: "" } } }, () => e10.handler(u2, p2))) : e10.handler(u2, p2))) && !(t2 instanceof Response)) throw TypeError("Expected an instance of Response to be returned");
        t2 && n2 && t2.headers.set("set-cookie", n2);
        let h2 = null == t2 ? void 0 : t2.headers.get("x-middleware-rewrite");
        if (t2 && h2 && !a2) {
          let r2 = new $(h2, { forceLocale: true, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          r2.host === u2.nextUrl.host && (r2.buildId = s2 || r2.buildId, t2.headers.set("x-middleware-rewrite", String(r2)));
          let n3 = X(String(r2), String(o2));
          l2 && t2.headers.set("x-nextjs-rewrite", n3);
        }
        let g2 = null == t2 ? void 0 : t2.headers.get("Location");
        if (t2 && g2 && !a2) {
          let r2 = new $(g2, { forceLocale: false, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          t2 = new Response(t2.body, t2), r2.host === u2.nextUrl.host && (r2.buildId = s2 || r2.buildId, t2.headers.set("Location", String(r2))), l2 && (t2.headers.delete("Location"), t2.headers.set("x-nextjs-redirect", X(String(r2), String(o2))));
        }
        let f2 = t2 || z.next(), m2 = f2.headers.get("x-middleware-override-headers"), w2 = [];
        if (m2) {
          for (let [e11, t3] of d2) f2.headers.set(`x-middleware-request-${e11}`, t3), w2.push(e11);
          w2.length > 0 && f2.headers.set("x-middleware-override-headers", m2 + "," + w2.join(","));
        }
        return { response: f2, waitUntil: Promise.all(p2[N]), fetchMetrics: u2.fetchMetrics };
      }
      r(7814), "undefined" == typeof URLPattern || URLPattern;
      let eD = new TextEncoder(), ej = new TextDecoder(), eU = (e10) => {
        let t2 = atob(e10), r2 = new Uint8Array(t2.length);
        for (let e11 = 0; e11 < t2.length; e11++) r2[e11] = t2.charCodeAt(e11);
        return r2;
      }, eV = (e10) => {
        let t2 = e10;
        t2 instanceof Uint8Array && (t2 = ej.decode(t2)), t2 = t2.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
        try {
          return eU(t2);
        } catch {
          throw TypeError("The input to be decoded is not correctly encoded.");
        }
      };
      class eH extends Error {
        constructor(e10, t2) {
          super(e10, t2), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      eH.code = "ERR_JOSE_GENERIC";
      class eW extends eH {
        constructor(e10, t2, r2 = "unspecified", n2 = "unspecified") {
          super(e10, { cause: { claim: r2, reason: n2, payload: t2 } }), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = r2, this.reason = n2, this.payload = t2;
        }
      }
      eW.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
      class e$ extends eH {
        constructor(e10, t2, r2 = "unspecified", n2 = "unspecified") {
          super(e10, { cause: { claim: r2, reason: n2, payload: t2 } }), this.code = "ERR_JWT_EXPIRED", this.claim = r2, this.reason = n2, this.payload = t2;
        }
      }
      e$.code = "ERR_JWT_EXPIRED";
      class eq extends eH {
        constructor() {
          super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
        }
      }
      eq.code = "ERR_JOSE_ALG_NOT_ALLOWED";
      class eB extends eH {
        constructor() {
          super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED";
        }
      }
      eB.code = "ERR_JOSE_NOT_SUPPORTED";
      class eK extends eH {
        constructor(e10 = "decryption operation failed", t2) {
          super(e10, t2), this.code = "ERR_JWE_DECRYPTION_FAILED";
        }
      }
      eK.code = "ERR_JWE_DECRYPTION_FAILED";
      class eJ extends eH {
        constructor() {
          super(...arguments), this.code = "ERR_JWE_INVALID";
        }
      }
      eJ.code = "ERR_JWE_INVALID";
      class eG extends eH {
        constructor() {
          super(...arguments), this.code = "ERR_JWS_INVALID";
        }
      }
      eG.code = "ERR_JWS_INVALID";
      class eF extends eH {
        constructor() {
          super(...arguments), this.code = "ERR_JWT_INVALID";
        }
      }
      eF.code = "ERR_JWT_INVALID";
      class ez extends eH {
        constructor() {
          super(...arguments), this.code = "ERR_JWK_INVALID";
        }
      }
      ez.code = "ERR_JWK_INVALID";
      class eX extends eH {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_INVALID";
        }
      }
      eX.code = "ERR_JWKS_INVALID";
      class eY extends eH {
        constructor(e10 = "no applicable key found in the JSON Web Key Set", t2) {
          super(e10, t2), this.code = "ERR_JWKS_NO_MATCHING_KEY";
        }
      }
      eY.code = "ERR_JWKS_NO_MATCHING_KEY";
      class eZ extends eH {
        constructor(e10 = "multiple matching keys found in the JSON Web Key Set", t2) {
          super(e10, t2), this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        }
      }
      Symbol.asyncIterator, eZ.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
      class eQ extends eH {
        constructor(e10 = "request timed out", t2) {
          super(e10, t2), this.code = "ERR_JWKS_TIMEOUT";
        }
      }
      eQ.code = "ERR_JWKS_TIMEOUT";
      class e0 extends eH {
        constructor(e10 = "signature verification failed", t2) {
          super(e10, t2), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        }
      }
      e0.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
      let e1 = crypto, e2 = (e10) => e10 instanceof CryptoKey, e4 = (e10, t2) => {
        if (e10.startsWith("RS") || e10.startsWith("PS")) {
          let { modulusLength: r2 } = t2.algorithm;
          if ("number" != typeof r2 || r2 < 2048) throw TypeError(`${e10} requires key modulusLength to be 2048 bits or larger`);
        }
      };
      function e3(e10, t2 = "algorithm.name") {
        return TypeError(`CryptoKey does not support this operation, its ${t2} must be ${e10}`);
      }
      function e6(e10, t2) {
        return e10.name === t2;
      }
      function e5(e10) {
        return parseInt(e10.name.slice(4), 10);
      }
      function e9(e10, t2, ...r2) {
        if ((r2 = r2.filter(Boolean)).length > 2) {
          let t3 = r2.pop();
          e10 += `one of type ${r2.join(", ")}, or ${t3}.`;
        } else 2 === r2.length ? e10 += `one of type ${r2[0]} or ${r2[1]}.` : e10 += `of type ${r2[0]}.`;
        return null == t2 ? e10 += ` Received ${t2}` : "function" == typeof t2 && t2.name ? e10 += ` Received function ${t2.name}` : "object" == typeof t2 && null != t2 && t2.constructor?.name && (e10 += ` Received an instance of ${t2.constructor.name}`), e10;
      }
      let e8 = (e10, ...t2) => e9("Key must be ", e10, ...t2);
      function e7(e10, t2, ...r2) {
        return e9(`Key for the ${e10} algorithm must be `, t2, ...r2);
      }
      let te = (e10) => !!e2(e10) || e10?.[Symbol.toStringTag] === "KeyObject", tt = ["CryptoKey"];
      function tr(e10) {
        if (!("object" == typeof e10 && null !== e10) || "[object Object]" !== Object.prototype.toString.call(e10)) return false;
        if (null === Object.getPrototypeOf(e10)) return true;
        let t2 = e10;
        for (; null !== Object.getPrototypeOf(t2); ) t2 = Object.getPrototypeOf(t2);
        return Object.getPrototypeOf(e10) === t2;
      }
      function tn(e10) {
        return tr(e10) && "string" == typeof e10.kty;
      }
      let ta = async (e10) => {
        if (!e10.alg) throw TypeError('"alg" argument is required when "jwk.alg" is not present');
        let { algorithm: t2, keyUsages: r2 } = function(e11) {
          let t3, r3;
          switch (e11.kty) {
            case "RSA":
              switch (e11.alg) {
                case "PS256":
                case "PS384":
                case "PS512":
                  t3 = { name: "RSA-PSS", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RS256":
                case "RS384":
                case "RS512":
                  t3 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RSA-OAEP":
                case "RSA-OAEP-256":
                case "RSA-OAEP-384":
                case "RSA-OAEP-512":
                  t3 = { name: "RSA-OAEP", hash: `SHA-${parseInt(e11.alg.slice(-3), 10) || 1}` }, r3 = e11.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
                  break;
                default:
                  throw new eB('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "EC":
              switch (e11.alg) {
                case "ES256":
                  t3 = { name: "ECDSA", namedCurve: "P-256" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ES384":
                  t3 = { name: "ECDSA", namedCurve: "P-384" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ES512":
                  t3 = { name: "ECDSA", namedCurve: "P-521" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t3 = { name: "ECDH", namedCurve: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new eB('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "OKP":
              switch (e11.alg) {
                case "Ed25519":
                  t3 = { name: "Ed25519" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "EdDSA":
                  t3 = { name: e11.crv }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t3 = { name: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new eB('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            default:
              throw new eB('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
          }
          return { algorithm: t3, keyUsages: r3 };
        }(e10), n2 = [t2, e10.ext ?? false, e10.key_ops ?? r2], a2 = { ...e10 };
        return delete a2.alg, delete a2.use, e1.subtle.importKey("jwk", a2, ...n2);
      }, ti = (e10) => eV(e10), to = (e10) => e10?.[Symbol.toStringTag] === "KeyObject", ts = async (e10, t2, r2, n2, a2 = false) => {
        let i2 = e10.get(t2);
        if (i2?.[n2]) return i2[n2];
        let o2 = await ta({ ...r2, alg: n2 });
        return a2 && Object.freeze(t2), i2 ? i2[n2] = o2 : e10.set(t2, { [n2]: o2 }), o2;
      }, tl = { normalizePublicKey: (e10, t2) => {
        if (to(e10)) {
          let r2 = e10.export({ format: "jwk" });
          return (delete r2.d, delete r2.dp, delete r2.dq, delete r2.p, delete r2.q, delete r2.qi, r2.k) ? ti(r2.k) : (i || (i = /* @__PURE__ */ new WeakMap()), ts(i, e10, r2, t2));
        }
        return tn(e10) ? e10.k ? eV(e10.k) : (i || (i = /* @__PURE__ */ new WeakMap()), ts(i, e10, e10, t2, true)) : e10;
      }, normalizePrivateKey: (e10, t2) => {
        if (to(e10)) {
          let r2 = e10.export({ format: "jwk" });
          return r2.k ? ti(r2.k) : (a || (a = /* @__PURE__ */ new WeakMap()), ts(a, e10, r2, t2));
        }
        return tn(e10) ? e10.k ? eV(e10.k) : (a || (a = /* @__PURE__ */ new WeakMap()), ts(a, e10, e10, t2, true)) : e10;
      } };
      async function tc(e10, t2, r2) {
        if ("sign" === r2 && (t2 = await tl.normalizePrivateKey(t2, e10)), "verify" === r2 && (t2 = await tl.normalizePublicKey(t2, e10)), e2(t2)) return !function(e11, t3, ...r3) {
          switch (t3) {
            case "HS256":
            case "HS384":
            case "HS512": {
              if (!e6(e11.algorithm, "HMAC")) throw e3("HMAC");
              let r4 = parseInt(t3.slice(2), 10);
              if (e5(e11.algorithm.hash) !== r4) throw e3(`SHA-${r4}`, "algorithm.hash");
              break;
            }
            case "RS256":
            case "RS384":
            case "RS512": {
              if (!e6(e11.algorithm, "RSASSA-PKCS1-v1_5")) throw e3("RSASSA-PKCS1-v1_5");
              let r4 = parseInt(t3.slice(2), 10);
              if (e5(e11.algorithm.hash) !== r4) throw e3(`SHA-${r4}`, "algorithm.hash");
              break;
            }
            case "PS256":
            case "PS384":
            case "PS512": {
              if (!e6(e11.algorithm, "RSA-PSS")) throw e3("RSA-PSS");
              let r4 = parseInt(t3.slice(2), 10);
              if (e5(e11.algorithm.hash) !== r4) throw e3(`SHA-${r4}`, "algorithm.hash");
              break;
            }
            case "EdDSA":
              if ("Ed25519" !== e11.algorithm.name && "Ed448" !== e11.algorithm.name) throw e3("Ed25519 or Ed448");
              break;
            case "Ed25519":
              if (!e6(e11.algorithm, "Ed25519")) throw e3("Ed25519");
              break;
            case "ES256":
            case "ES384":
            case "ES512": {
              if (!e6(e11.algorithm, "ECDSA")) throw e3("ECDSA");
              let r4 = function(e12) {
                switch (e12) {
                  case "ES256":
                    return "P-256";
                  case "ES384":
                    return "P-384";
                  case "ES512":
                    return "P-521";
                  default:
                    throw Error("unreachable");
                }
              }(t3);
              if (e11.algorithm.namedCurve !== r4) throw e3(r4, "algorithm.namedCurve");
              break;
            }
            default:
              throw TypeError("CryptoKey does not support this operation");
          }
          (function(e12, t4) {
            if (t4.length && !t4.some((t5) => e12.usages.includes(t5))) {
              let e13 = "CryptoKey does not support this operation, its usages must include ";
              if (t4.length > 2) {
                let r4 = t4.pop();
                e13 += `one of ${t4.join(", ")}, or ${r4}.`;
              } else 2 === t4.length ? e13 += `one of ${t4[0]} or ${t4[1]}.` : e13 += `${t4[0]}.`;
              throw TypeError(e13);
            }
          })(e11, r3);
        }(t2, e10, r2), t2;
        if (t2 instanceof Uint8Array) {
          if (!e10.startsWith("HS")) throw TypeError(e8(t2, ...tt));
          return e1.subtle.importKey("raw", t2, { hash: `SHA-${e10.slice(-3)}`, name: "HMAC" }, false, [r2]);
        }
        throw TypeError(e8(t2, ...tt, "Uint8Array", "JSON Web Key"));
      }
      let td = async (e10, t2, r2, n2) => {
        let a2 = await tc(e10, t2, "verify");
        e4(e10, a2);
        let i2 = function(e11, t3) {
          let r3 = `SHA-${e11.slice(-3)}`;
          switch (e11) {
            case "HS256":
            case "HS384":
            case "HS512":
              return { hash: r3, name: "HMAC" };
            case "PS256":
            case "PS384":
            case "PS512":
              return { hash: r3, name: "RSA-PSS", saltLength: e11.slice(-3) >> 3 };
            case "RS256":
            case "RS384":
            case "RS512":
              return { hash: r3, name: "RSASSA-PKCS1-v1_5" };
            case "ES256":
            case "ES384":
            case "ES512":
              return { hash: r3, name: "ECDSA", namedCurve: t3.namedCurve };
            case "Ed25519":
              return { name: "Ed25519" };
            case "EdDSA":
              return { name: t3.name };
            default:
              throw new eB(`alg ${e11} is not supported either by JOSE or your javascript runtime`);
          }
        }(e10, a2.algorithm);
        try {
          return await e1.subtle.verify(i2, a2, r2, n2);
        } catch {
          return false;
        }
      }, tu = (...e10) => {
        let t2;
        let r2 = e10.filter(Boolean);
        if (0 === r2.length || 1 === r2.length) return true;
        for (let e11 of r2) {
          let r3 = Object.keys(e11);
          if (!t2 || 0 === t2.size) {
            t2 = new Set(r3);
            continue;
          }
          for (let e12 of r3) {
            if (t2.has(e12)) return false;
            t2.add(e12);
          }
        }
        return true;
      }, tp = (e10) => e10?.[Symbol.toStringTag], th = (e10, t2, r2) => {
        if (void 0 !== t2.use && "sig" !== t2.use) throw TypeError("Invalid key for this operation, when present its use must be sig");
        if (void 0 !== t2.key_ops && t2.key_ops.includes?.(r2) !== true) throw TypeError(`Invalid key for this operation, when present its key_ops must include ${r2}`);
        if (void 0 !== t2.alg && t2.alg !== e10) throw TypeError(`Invalid key for this operation, when present its alg must be ${e10}`);
        return true;
      }, tg = (e10, t2, r2, n2) => {
        if (!(t2 instanceof Uint8Array)) {
          if (n2 && tn(t2)) {
            if (function(e11) {
              return tn(e11) && "oct" === e11.kty && "string" == typeof e11.k;
            }(t2) && th(e10, t2, r2)) return;
            throw TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
          }
          if (!te(t2)) throw TypeError(e7(e10, t2, ...tt, "Uint8Array", n2 ? "JSON Web Key" : null));
          if ("secret" !== t2.type) throw TypeError(`${tp(t2)} instances for symmetric algorithms must be of type "secret"`);
        }
      }, tf = (e10, t2, r2, n2) => {
        if (n2 && tn(t2)) switch (r2) {
          case "sign":
            if (function(e11) {
              return "oct" !== e11.kty && "string" == typeof e11.d;
            }(t2) && th(e10, t2, r2)) return;
            throw TypeError("JSON Web Key for this operation be a private JWK");
          case "verify":
            if (function(e11) {
              return "oct" !== e11.kty && void 0 === e11.d;
            }(t2) && th(e10, t2, r2)) return;
            throw TypeError("JSON Web Key for this operation be a public JWK");
        }
        if (!te(t2)) throw TypeError(e7(e10, t2, ...tt, n2 ? "JSON Web Key" : null));
        if ("secret" === t2.type) throw TypeError(`${tp(t2)} instances for asymmetric algorithms must not be of type "secret"`);
        if ("sign" === r2 && "public" === t2.type) throw TypeError(`${tp(t2)} instances for asymmetric algorithm signing must be of type "private"`);
        if ("decrypt" === r2 && "public" === t2.type) throw TypeError(`${tp(t2)} instances for asymmetric algorithm decryption must be of type "private"`);
        if (t2.algorithm && "verify" === r2 && "private" === t2.type) throw TypeError(`${tp(t2)} instances for asymmetric algorithm verifying must be of type "public"`);
        if (t2.algorithm && "encrypt" === r2 && "private" === t2.type) throw TypeError(`${tp(t2)} instances for asymmetric algorithm encryption must be of type "public"`);
      };
      function tm(e10, t2, r2, n2) {
        t2.startsWith("HS") || "dir" === t2 || t2.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(t2) ? tg(t2, r2, n2, e10) : tf(t2, r2, n2, e10);
      }
      tm.bind(void 0, false);
      let tb = tm.bind(void 0, true), tw = function(e10, t2, r2, n2, a2) {
        let i2;
        if (void 0 !== a2.crit && n2?.crit === void 0) throw new e10('"crit" (Critical) Header Parameter MUST be integrity protected');
        if (!n2 || void 0 === n2.crit) return /* @__PURE__ */ new Set();
        if (!Array.isArray(n2.crit) || 0 === n2.crit.length || n2.crit.some((e11) => "string" != typeof e11 || 0 === e11.length)) throw new e10('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
        for (let o2 of (i2 = void 0 !== r2 ? new Map([...Object.entries(r2), ...t2.entries()]) : t2, n2.crit)) {
          if (!i2.has(o2)) throw new eB(`Extension Header Parameter "${o2}" is not recognized`);
          if (void 0 === a2[o2]) throw new e10(`Extension Header Parameter "${o2}" is missing`);
          if (i2.get(o2) && void 0 === n2[o2]) throw new e10(`Extension Header Parameter "${o2}" MUST be integrity protected`);
        }
        return new Set(n2.crit);
      }, tv = (e10, t2) => {
        if (void 0 !== t2 && (!Array.isArray(t2) || t2.some((e11) => "string" != typeof e11))) throw TypeError(`"${e10}" option must be an array of strings`);
        if (t2) return new Set(t2);
      };
      async function ty(e10, t2) {
        if (!tr(e10)) throw TypeError("JWK must be an object");
        switch (t2 || (t2 = e10.alg), e10.kty) {
          case "oct":
            if ("string" != typeof e10.k || !e10.k) throw TypeError('missing "k" (Key Value) Parameter value');
            return eV(e10.k);
          case "RSA":
            if ("oth" in e10 && void 0 !== e10.oth) throw new eB('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
          case "EC":
          case "OKP":
            return ta({ ...e10, alg: t2 });
          default:
            throw new eB('Unsupported "kty" (Key Type) Parameter value');
        }
      }
      async function tS(e10, t2, r2) {
        let n2, a2;
        if (!tr(e10)) throw new eG("Flattened JWS must be an object");
        if (void 0 === e10.protected && void 0 === e10.header) throw new eG('Flattened JWS must have either of the "protected" or "header" members');
        if (void 0 !== e10.protected && "string" != typeof e10.protected) throw new eG("JWS Protected Header incorrect type");
        if (void 0 === e10.payload) throw new eG("JWS Payload missing");
        if ("string" != typeof e10.signature) throw new eG("JWS Signature missing or incorrect type");
        if (void 0 !== e10.header && !tr(e10.header)) throw new eG("JWS Unprotected Header incorrect type");
        let i2 = {};
        if (e10.protected) try {
          let t3 = eV(e10.protected);
          i2 = JSON.parse(ej.decode(t3));
        } catch {
          throw new eG("JWS Protected Header is invalid");
        }
        if (!tu(i2, e10.header)) throw new eG("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        let o2 = { ...i2, ...e10.header }, s2 = tw(eG, /* @__PURE__ */ new Map([["b64", true]]), r2?.crit, i2, o2), l2 = true;
        if (s2.has("b64") && "boolean" != typeof (l2 = i2.b64)) throw new eG('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        let { alg: c2 } = o2;
        if ("string" != typeof c2 || !c2) throw new eG('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        let d2 = r2 && tv("algorithms", r2.algorithms);
        if (d2 && !d2.has(c2)) throw new eq('"alg" (Algorithm) Header Parameter value not allowed');
        if (l2) {
          if ("string" != typeof e10.payload) throw new eG("JWS Payload must be a string");
        } else if ("string" != typeof e10.payload && !(e10.payload instanceof Uint8Array)) throw new eG("JWS Payload must be a string or an Uint8Array instance");
        let u2 = false;
        "function" == typeof t2 ? (t2 = await t2(i2, e10), u2 = true, tb(c2, t2, "verify"), tn(t2) && (t2 = await ty(t2, c2))) : tb(c2, t2, "verify");
        let p2 = function(...e11) {
          let t3 = new Uint8Array(e11.reduce((e12, { length: t4 }) => e12 + t4, 0)), r3 = 0;
          for (let n3 of e11) t3.set(n3, r3), r3 += n3.length;
          return t3;
        }(eD.encode(e10.protected ?? ""), eD.encode("."), "string" == typeof e10.payload ? eD.encode(e10.payload) : e10.payload);
        try {
          n2 = eV(e10.signature);
        } catch {
          throw new eG("Failed to base64url decode the signature");
        }
        if (!await td(c2, t2, n2, p2)) throw new e0();
        if (l2) try {
          a2 = eV(e10.payload);
        } catch {
          throw new eG("Failed to base64url decode the payload");
        }
        else a2 = "string" == typeof e10.payload ? eD.encode(e10.payload) : e10.payload;
        let h2 = { payload: a2 };
        return (void 0 !== e10.protected && (h2.protectedHeader = i2), void 0 !== e10.header && (h2.unprotectedHeader = e10.header), u2) ? { ...h2, key: t2 } : h2;
      }
      async function t_(e10, t2, r2) {
        if (e10 instanceof Uint8Array && (e10 = ej.decode(e10)), "string" != typeof e10) throw new eG("Compact JWS must be a string or Uint8Array");
        let { 0: n2, 1: a2, 2: i2, length: o2 } = e10.split(".");
        if (3 !== o2) throw new eG("Invalid Compact JWS");
        let s2 = await tS({ payload: a2, protected: n2, signature: i2 }, t2, r2), l2 = { payload: s2.payload, protectedHeader: s2.protectedHeader };
        return "function" == typeof t2 ? { ...l2, key: s2.key } : l2;
      }
      let tx = (e10) => Math.floor(e10.getTime() / 1e3), tE = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, tP = (e10) => {
        let t2;
        let r2 = tE.exec(e10);
        if (!r2 || r2[4] && r2[1]) throw TypeError("Invalid time period format");
        let n2 = parseFloat(r2[2]);
        switch (r2[3].toLowerCase()) {
          case "sec":
          case "secs":
          case "second":
          case "seconds":
          case "s":
            t2 = Math.round(n2);
            break;
          case "minute":
          case "minutes":
          case "min":
          case "mins":
          case "m":
            t2 = Math.round(60 * n2);
            break;
          case "hour":
          case "hours":
          case "hr":
          case "hrs":
          case "h":
            t2 = Math.round(3600 * n2);
            break;
          case "day":
          case "days":
          case "d":
            t2 = Math.round(86400 * n2);
            break;
          case "week":
          case "weeks":
          case "w":
            t2 = Math.round(604800 * n2);
            break;
          default:
            t2 = Math.round(31557600 * n2);
        }
        return "-" === r2[1] || "ago" === r2[4] ? -t2 : t2;
      }, tR = (e10) => e10.toLowerCase().replace(/^application\//, ""), tO = (e10, t2) => "string" == typeof e10 ? t2.includes(e10) : !!Array.isArray(e10) && t2.some(Set.prototype.has.bind(new Set(e10))), tT = (e10, t2, r2 = {}) => {
        let n2, a2;
        try {
          n2 = JSON.parse(ej.decode(t2));
        } catch {
        }
        if (!tr(n2)) throw new eF("JWT Claims Set must be a top-level JSON object");
        let { typ: i2 } = r2;
        if (i2 && ("string" != typeof e10.typ || tR(e10.typ) !== tR(i2))) throw new eW('unexpected "typ" JWT header value', n2, "typ", "check_failed");
        let { requiredClaims: o2 = [], issuer: s2, subject: l2, audience: c2, maxTokenAge: d2 } = r2, u2 = [...o2];
        for (let e11 of (void 0 !== d2 && u2.push("iat"), void 0 !== c2 && u2.push("aud"), void 0 !== l2 && u2.push("sub"), void 0 !== s2 && u2.push("iss"), new Set(u2.reverse()))) if (!(e11 in n2)) throw new eW(`missing required "${e11}" claim`, n2, e11, "missing");
        if (s2 && !(Array.isArray(s2) ? s2 : [s2]).includes(n2.iss)) throw new eW('unexpected "iss" claim value', n2, "iss", "check_failed");
        if (l2 && n2.sub !== l2) throw new eW('unexpected "sub" claim value', n2, "sub", "check_failed");
        if (c2 && !tO(n2.aud, "string" == typeof c2 ? [c2] : c2)) throw new eW('unexpected "aud" claim value', n2, "aud", "check_failed");
        switch (typeof r2.clockTolerance) {
          case "string":
            a2 = tP(r2.clockTolerance);
            break;
          case "number":
            a2 = r2.clockTolerance;
            break;
          case "undefined":
            a2 = 0;
            break;
          default:
            throw TypeError("Invalid clockTolerance option type");
        }
        let { currentDate: p2 } = r2, h2 = tx(p2 || /* @__PURE__ */ new Date());
        if ((void 0 !== n2.iat || d2) && "number" != typeof n2.iat) throw new eW('"iat" claim must be a number', n2, "iat", "invalid");
        if (void 0 !== n2.nbf) {
          if ("number" != typeof n2.nbf) throw new eW('"nbf" claim must be a number', n2, "nbf", "invalid");
          if (n2.nbf > h2 + a2) throw new eW('"nbf" claim timestamp check failed', n2, "nbf", "check_failed");
        }
        if (void 0 !== n2.exp) {
          if ("number" != typeof n2.exp) throw new eW('"exp" claim must be a number', n2, "exp", "invalid");
          if (n2.exp <= h2 - a2) throw new e$('"exp" claim timestamp check failed', n2, "exp", "check_failed");
        }
        if (d2) {
          let e11 = h2 - n2.iat;
          if (e11 - a2 > ("number" == typeof d2 ? d2 : tP(d2))) throw new e$('"iat" claim timestamp check failed (too far in the past)', n2, "iat", "check_failed");
          if (e11 < 0 - a2) throw new eW('"iat" claim timestamp check failed (it should be in the past)', n2, "iat", "check_failed");
        }
        return n2;
      };
      async function tC(e10, t2, r2) {
        let n2 = await t_(e10, t2, r2);
        if (n2.protectedHeader.crit?.includes("b64") && false === n2.protectedHeader.b64) throw new eF("JWTs MUST NOT use unencoded payload");
        let a2 = { payload: tT(n2.protectedHeader, n2.payload, r2), protectedHeader: n2.protectedHeader };
        return "function" == typeof t2 ? { ...a2, key: n2.key } : a2;
      }
      let tN = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-dev-key-change-me");
      async function tA(e10) {
        try {
          let { payload: t2 } = await tC(e10, tN);
          return t2;
        } catch (e11) {
          return null;
        }
      }
      async function tI(e10) {
        if (e10.nextUrl.pathname.startsWith("/dashboard")) {
          let t2 = e10.cookies.get("token")?.value;
          if (!t2 || !await tA(t2)) return z.redirect(new URL("/login", e10.url));
        }
        return z.next();
      }
      let tk = { matcher: ["/dashboard/:path*"] }, tM = { ...w }, tL = tM.middleware || tM.default, tD = "/src/middleware";
      if ("function" != typeof tL) throw Error(`The Middleware "${tD}" must export a \`middleware\` or a \`default\` function`);
      function tj(e10) {
        return eL({ ...e10, page: tD, handler: tL });
      }
    }, 5066: (e) => {
      "use strict";
      var t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, i = {};
      function o(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function s(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, a2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != a2 ? a2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function l(e2) {
        var t2, r2;
        if (!e2) return;
        let [[n2, a2], ...i2] = s(e2), { domain: o2, expires: l2, httponly: u2, maxage: p2, path: h, samesite: g, secure: f, partitioned: m, priority: b } = Object.fromEntries(i2.map(([e3, t3]) => [e3.toLowerCase(), t3]));
        return function(e3) {
          let t3 = {};
          for (let r3 in e3) e3[r3] && (t3[r3] = e3[r3]);
          return t3;
        }({ name: n2, value: decodeURIComponent(a2), domain: o2, ...l2 && { expires: new Date(l2) }, ...u2 && { httpOnly: true }, ..."string" == typeof p2 && { maxAge: Number(p2) }, path: h, ...g && { sameSite: c.includes(t2 = (t2 = g).toLowerCase()) ? t2 : void 0 }, ...f && { secure: true }, ...b && { priority: d.includes(r2 = (r2 = b).toLowerCase()) ? r2 : void 0 }, ...m && { partitioned: true } });
      }
      ((e2, r2) => {
        for (var n2 in r2) t(e2, n2, { get: r2[n2], enumerable: true });
      })(i, { RequestCookies: () => u, ResponseCookies: () => p, parseCookie: () => s, parseSetCookie: () => l, stringifyCookie: () => o }), e.exports = ((e2, i2, o2, s2) => {
        if (i2 && "object" == typeof i2 || "function" == typeof i2) for (let l2 of n(i2)) a.call(e2, l2) || l2 === o2 || t(e2, l2, { get: () => i2[l2], enumerable: !(s2 = r(i2, l2)) || s2.enumerable });
        return e2;
      })(t({}, "__esModule", { value: true }), i);
      var c = ["strict", "lax", "none"], d = ["low", "medium", "high"], u = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2) for (let [e3, r2] of s(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => o(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => o(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, p = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let a2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (let e3 of Array.isArray(a2) ? a2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, a3, i2, o2 = [], s2 = 0;
            function l2() {
              for (; s2 < e4.length && /\s/.test(e4.charAt(s2)); ) s2 += 1;
              return s2 < e4.length;
            }
            for (; s2 < e4.length; ) {
              for (t3 = s2, i2 = false; l2(); ) if ("," === (r3 = e4.charAt(s2))) {
                for (n3 = s2, s2 += 1, l2(), a3 = s2; s2 < e4.length && "=" !== (r3 = e4.charAt(s2)) && ";" !== r3 && "," !== r3; ) s2 += 1;
                s2 < e4.length && "=" === e4.charAt(s2) ? (i2 = true, s2 = a3, o2.push(e4.substring(t3, n3)), t3 = s2) : s2 = n3 + 1;
              } else s2 += 1;
              (!i2 || s2 >= e4.length) && o2.push(e4.substring(t3, e4.length));
            }
            return o2;
          }(a2)) {
            let t3 = l(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, a2 = this._parsed;
          return a2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = o(r3);
              t3.append("set-cookie", e4);
            }
          }(a2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2, n2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0].path, e2[0].domain];
          return this.set({ name: t2, path: r2, domain: n2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(o).join("; ");
        }
      };
    }, 4213: (e, t, r) => {
      (() => {
        "use strict";
        var t2 = { 491: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ContextAPI = void 0;
          let n2 = r2(223), a2 = r2(172), i2 = r2(930), o = "context", s = new n2.NoopContextManager();
          class l {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new l()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, a2.registerGlobal)(o, e3, i2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t4, r3, ...n3) {
              return this._getContextManager().with(e3, t4, r3, ...n3);
            }
            bind(e3, t4) {
              return this._getContextManager().bind(e3, t4);
            }
            _getContextManager() {
              return (0, a2.getGlobal)(o) || s;
            }
            disable() {
              this._getContextManager().disable(), (0, a2.unregisterGlobal)(o, i2.DiagAPI.instance());
            }
          }
          t3.ContextAPI = l;
        }, 930: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagAPI = void 0;
          let n2 = r2(56), a2 = r2(912), i2 = r2(957), o = r2(172);
          class s {
            constructor() {
              function e3(e4) {
                return function(...t5) {
                  let r3 = (0, o.getGlobal)("diag");
                  if (r3) return r3[e4](...t5);
                };
              }
              let t4 = this;
              t4.setLogger = (e4, r3 = { logLevel: i2.DiagLogLevel.INFO }) => {
                var n3, s2, l;
                if (e4 === t4) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t4.error(null !== (n3 = e5.stack) && void 0 !== n3 ? n3 : e5.message), false;
                }
                "number" == typeof r3 && (r3 = { logLevel: r3 });
                let c = (0, o.getGlobal)("diag"), d = (0, a2.createLogLevelDiagLogger)(null !== (s2 = r3.logLevel) && void 0 !== s2 ? s2 : i2.DiagLogLevel.INFO, e4);
                if (c && !r3.suppressOverrideMessage) {
                  let e5 = null !== (l = Error().stack) && void 0 !== l ? l : "<failed to generate stacktrace>";
                  c.warn(`Current logger will be overwritten from ${e5}`), d.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, o.registerGlobal)("diag", d, t4, true);
              }, t4.disable = () => {
                (0, o.unregisterGlobal)("diag", t4);
              }, t4.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), t4.verbose = e3("verbose"), t4.debug = e3("debug"), t4.info = e3("info"), t4.warn = e3("warn"), t4.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new s()), this._instance;
            }
          }
          t3.DiagAPI = s;
        }, 653: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.MetricsAPI = void 0;
          let n2 = r2(660), a2 = r2(172), i2 = r2(930), o = "metrics";
          class s {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new s()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, a2.registerGlobal)(o, e3, i2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, a2.getGlobal)(o) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t4, r3) {
              return this.getMeterProvider().getMeter(e3, t4, r3);
            }
            disable() {
              (0, a2.unregisterGlobal)(o, i2.DiagAPI.instance());
            }
          }
          t3.MetricsAPI = s;
        }, 181: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.PropagationAPI = void 0;
          let n2 = r2(172), a2 = r2(874), i2 = r2(194), o = r2(277), s = r2(369), l = r2(930), c = "propagation", d = new a2.NoopTextMapPropagator();
          class u {
            constructor() {
              this.createBaggage = s.createBaggage, this.getBaggage = o.getBaggage, this.getActiveBaggage = o.getActiveBaggage, this.setBaggage = o.setBaggage, this.deleteBaggage = o.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new u()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(c, e3, l.DiagAPI.instance());
            }
            inject(e3, t4, r3 = i2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t4, r3);
            }
            extract(e3, t4, r3 = i2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t4, r3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(c, l.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(c) || d;
            }
          }
          t3.PropagationAPI = u;
        }, 997: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceAPI = void 0;
          let n2 = r2(172), a2 = r2(846), i2 = r2(139), o = r2(607), s = r2(930), l = "trace";
          class c {
            constructor() {
              this._proxyTracerProvider = new a2.ProxyTracerProvider(), this.wrapSpanContext = i2.wrapSpanContext, this.isSpanContextValid = i2.isSpanContextValid, this.deleteSpan = o.deleteSpan, this.getSpan = o.getSpan, this.getActiveSpan = o.getActiveSpan, this.getSpanContext = o.getSpanContext, this.setSpan = o.setSpan, this.setSpanContext = o.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new c()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t4 = (0, n2.registerGlobal)(l, this._proxyTracerProvider, s.DiagAPI.instance());
              return t4 && this._proxyTracerProvider.setDelegate(e3), t4;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(l) || this._proxyTracerProvider;
            }
            getTracer(e3, t4) {
              return this.getTracerProvider().getTracer(e3, t4);
            }
            disable() {
              (0, n2.unregisterGlobal)(l, s.DiagAPI.instance()), this._proxyTracerProvider = new a2.ProxyTracerProvider();
            }
          }
          t3.TraceAPI = c;
        }, 277: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.deleteBaggage = t3.setBaggage = t3.getActiveBaggage = t3.getBaggage = void 0;
          let n2 = r2(491), a2 = (0, r2(780).createContextKey)("OpenTelemetry Baggage Key");
          function i2(e3) {
            return e3.getValue(a2) || void 0;
          }
          t3.getBaggage = i2, t3.getActiveBaggage = function() {
            return i2(n2.ContextAPI.getInstance().active());
          }, t3.setBaggage = function(e3, t4) {
            return e3.setValue(a2, t4);
          }, t3.deleteBaggage = function(e3) {
            return e3.deleteValue(a2);
          };
        }, 993: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.BaggageImpl = void 0;
          class r2 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t4 = this._entries.get(e3);
              if (t4) return Object.assign({}, t4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t4]) => [e3, t4]);
            }
            setEntry(e3, t4) {
              let n2 = new r2(this._entries);
              return n2._entries.set(e3, t4), n2;
            }
            removeEntry(e3) {
              let t4 = new r2(this._entries);
              return t4._entries.delete(e3), t4;
            }
            removeEntries(...e3) {
              let t4 = new r2(this._entries);
              for (let r3 of e3) t4._entries.delete(r3);
              return t4;
            }
            clear() {
              return new r2();
            }
          }
          t3.BaggageImpl = r2;
        }, 830: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataSymbol = void 0, t3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataFromString = t3.createBaggage = void 0;
          let n2 = r2(930), a2 = r2(993), i2 = r2(830), o = n2.DiagAPI.instance();
          t3.createBaggage = function(e3 = {}) {
            return new a2.BaggageImpl(new Map(Object.entries(e3)));
          }, t3.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (o.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: i2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.context = void 0;
          let n2 = r2(491);
          t3.context = n2.ContextAPI.getInstance();
        }, 223: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopContextManager = void 0;
          let n2 = r2(780);
          class a2 {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t4, r3, ...n3) {
              return t4.call(r3, ...n3);
            }
            bind(e3, t4) {
              return t4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          t3.NoopContextManager = a2;
        }, 780: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ROOT_CONTEXT = t3.createContextKey = void 0, t3.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r2 {
            constructor(e3) {
              let t4 = this;
              t4._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t4.getValue = (e4) => t4._currentContext.get(e4), t4.setValue = (e4, n2) => {
                let a2 = new r2(t4._currentContext);
                return a2._currentContext.set(e4, n2), a2;
              }, t4.deleteValue = (e4) => {
                let n2 = new r2(t4._currentContext);
                return n2._currentContext.delete(e4), n2;
              };
            }
          }
          t3.ROOT_CONTEXT = new r2();
        }, 506: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.diag = void 0;
          let n2 = r2(930);
          t3.diag = n2.DiagAPI.instance();
        }, 56: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagComponentLogger = void 0;
          let n2 = r2(172);
          class a2 {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          }
          function i2(e3, t4, r3) {
            let a3 = (0, n2.getGlobal)("diag");
            if (a3) return r3.unshift(t4), a3[e3](...r3);
          }
          t3.DiagComponentLogger = a2;
        }, 972: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagConsoleLogger = void 0;
          let r2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class n2 {
            constructor() {
              for (let e3 = 0; e3 < r2.length; e3++) this[r2[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t4) {
                  if (console) {
                    let r3 = console[e4];
                    if ("function" != typeof r3 && (r3 = console.log), "function" == typeof r3) return r3.apply(console, t4);
                  }
                };
              }(r2[e3].c);
            }
          }
          t3.DiagConsoleLogger = n2;
        }, 912: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createLogLevelDiagLogger = void 0;
          let n2 = r2(957);
          t3.createLogLevelDiagLogger = function(e3, t4) {
            function r3(r4, n3) {
              let a2 = t4[r4];
              return "function" == typeof a2 && e3 >= n3 ? a2.bind(t4) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t4 = t4 || {}, { error: r3("error", n2.DiagLogLevel.ERROR), warn: r3("warn", n2.DiagLogLevel.WARN), info: r3("info", n2.DiagLogLevel.INFO), debug: r3("debug", n2.DiagLogLevel.DEBUG), verbose: r3("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagLogLevel = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.ERROR = 30] = "ERROR", e3[e3.WARN = 50] = "WARN", e3[e3.INFO = 60] = "INFO", e3[e3.DEBUG = 70] = "DEBUG", e3[e3.VERBOSE = 80] = "VERBOSE", e3[e3.ALL = 9999] = "ALL";
          }(t3.DiagLogLevel || (t3.DiagLogLevel = {}));
        }, 172: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.unregisterGlobal = t3.getGlobal = t3.registerGlobal = void 0;
          let n2 = r2(200), a2 = r2(521), i2 = r2(130), o = a2.VERSION.split(".")[0], s = Symbol.for(`opentelemetry.js.api.${o}`), l = n2._globalThis;
          t3.registerGlobal = function(e3, t4, r3, n3 = false) {
            var i3;
            let o2 = l[s] = null !== (i3 = l[s]) && void 0 !== i3 ? i3 : { version: a2.VERSION };
            if (!n3 && o2[e3]) {
              let t5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r3.error(t5.stack || t5.message), false;
            }
            if (o2.version !== a2.VERSION) {
              let t5 = Error(`@opentelemetry/api: Registration of version v${o2.version} for ${e3} does not match previously registered API v${a2.VERSION}`);
              return r3.error(t5.stack || t5.message), false;
            }
            return o2[e3] = t4, r3.debug(`@opentelemetry/api: Registered a global for ${e3} v${a2.VERSION}.`), true;
          }, t3.getGlobal = function(e3) {
            var t4, r3;
            let n3 = null === (t4 = l[s]) || void 0 === t4 ? void 0 : t4.version;
            if (n3 && (0, i2.isCompatible)(n3)) return null === (r3 = l[s]) || void 0 === r3 ? void 0 : r3[e3];
          }, t3.unregisterGlobal = function(e3, t4) {
            t4.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${a2.VERSION}.`);
            let r3 = l[s];
            r3 && delete r3[e3];
          };
        }, 130: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.isCompatible = t3._makeCompatibilityCheck = void 0;
          let n2 = r2(521), a2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function i2(e3) {
            let t4 = /* @__PURE__ */ new Set([e3]), r3 = /* @__PURE__ */ new Set(), n3 = e3.match(a2);
            if (!n3) return () => false;
            let i3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != i3.prerelease) return function(t5) {
              return t5 === e3;
            };
            function o(e4) {
              return r3.add(e4), false;
            }
            return function(e4) {
              if (t4.has(e4)) return true;
              if (r3.has(e4)) return false;
              let n4 = e4.match(a2);
              if (!n4) return o(e4);
              let s = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              return null != s.prerelease || i3.major !== s.major ? o(e4) : 0 === i3.major ? i3.minor === s.minor && i3.patch <= s.patch ? (t4.add(e4), true) : o(e4) : i3.minor <= s.minor ? (t4.add(e4), true) : o(e4);
            };
          }
          t3._makeCompatibilityCheck = i2, t3.isCompatible = i2(n2.VERSION);
        }, 886: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.metrics = void 0;
          let n2 = r2(653);
          t3.metrics = n2.MetricsAPI.getInstance();
        }, 901: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ValueType = void 0, function(e3) {
            e3[e3.INT = 0] = "INT", e3[e3.DOUBLE = 1] = "DOUBLE";
          }(t3.ValueType || (t3.ValueType = {}));
        }, 102: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createNoopMeter = t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t3.NOOP_OBSERVABLE_GAUGE_METRIC = t3.NOOP_OBSERVABLE_COUNTER_METRIC = t3.NOOP_UP_DOWN_COUNTER_METRIC = t3.NOOP_HISTOGRAM_METRIC = t3.NOOP_COUNTER_METRIC = t3.NOOP_METER = t3.NoopObservableUpDownCounterMetric = t3.NoopObservableGaugeMetric = t3.NoopObservableCounterMetric = t3.NoopObservableMetric = t3.NoopHistogramMetric = t3.NoopUpDownCounterMetric = t3.NoopCounterMetric = t3.NoopMetric = t3.NoopMeter = void 0;
          class r2 {
            constructor() {
            }
            createHistogram(e3, r3) {
              return t3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r3) {
              return t3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r3) {
              return t3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r3) {
              return t3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t4) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t3.NoopMeter = r2;
          class n2 {
          }
          t3.NoopMetric = n2;
          class a2 extends n2 {
            add(e3, t4) {
            }
          }
          t3.NoopCounterMetric = a2;
          class i2 extends n2 {
            add(e3, t4) {
            }
          }
          t3.NoopUpDownCounterMetric = i2;
          class o extends n2 {
            record(e3, t4) {
            }
          }
          t3.NoopHistogramMetric = o;
          class s {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t3.NoopObservableMetric = s;
          class l extends s {
          }
          t3.NoopObservableCounterMetric = l;
          class c extends s {
          }
          t3.NoopObservableGaugeMetric = c;
          class d extends s {
          }
          t3.NoopObservableUpDownCounterMetric = d, t3.NOOP_METER = new r2(), t3.NOOP_COUNTER_METRIC = new a2(), t3.NOOP_HISTOGRAM_METRIC = new o(), t3.NOOP_UP_DOWN_COUNTER_METRIC = new i2(), t3.NOOP_OBSERVABLE_COUNTER_METRIC = new l(), t3.NOOP_OBSERVABLE_GAUGE_METRIC = new c(), t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new d(), t3.createNoopMeter = function() {
            return t3.NOOP_METER;
          };
        }, 660: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NOOP_METER_PROVIDER = t3.NoopMeterProvider = void 0;
          let n2 = r2(102);
          class a2 {
            getMeter(e3, t4, r3) {
              return n2.NOOP_METER;
            }
          }
          t3.NoopMeterProvider = a2, t3.NOOP_METER_PROVIDER = new a2();
        }, 200: function(e2, t3, r2) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), e3[n3] = t4[r3];
          }), a2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || n2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), a2(r2(46), t3);
        }, 651: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3._globalThis = void 0, t3._globalThis = "object" == typeof globalThis ? globalThis : r.g;
        }, 46: function(e2, t3, r2) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), e3[n3] = t4[r3];
          }), a2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || n2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), a2(r2(651), t3);
        }, 939: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.propagation = void 0;
          let n2 = r2(181);
          t3.propagation = n2.PropagationAPI.getInstance();
        }, 874: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTextMapPropagator = void 0;
          class r2 {
            inject(e3, t4) {
            }
            extract(e3, t4) {
              return e3;
            }
            fields() {
              return [];
            }
          }
          t3.NoopTextMapPropagator = r2;
        }, 194: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.defaultTextMapSetter = t3.defaultTextMapGetter = void 0, t3.defaultTextMapGetter = { get(e3, t4) {
            if (null != e3) return e3[t4];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t3.defaultTextMapSetter = { set(e3, t4, r2) {
            null != e3 && (e3[t4] = r2);
          } };
        }, 845: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.trace = void 0;
          let n2 = r2(997);
          t3.trace = n2.TraceAPI.getInstance();
        }, 403: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NonRecordingSpan = void 0;
          let n2 = r2(476);
          class a2 {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t4) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t4) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t4) {
            }
          }
          t3.NonRecordingSpan = a2;
        }, 614: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracer = void 0;
          let n2 = r2(491), a2 = r2(607), i2 = r2(403), o = r2(139), s = n2.ContextAPI.getInstance();
          class l {
            startSpan(e3, t4, r3 = s.active()) {
              if (null == t4 ? void 0 : t4.root) return new i2.NonRecordingSpan();
              let n3 = r3 && (0, a2.getSpanContext)(r3);
              return "object" == typeof n3 && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, o.isSpanContextValid)(n3) ? new i2.NonRecordingSpan(n3) : new i2.NonRecordingSpan();
            }
            startActiveSpan(e3, t4, r3, n3) {
              let i3, o2, l2;
              if (arguments.length < 2) return;
              2 == arguments.length ? l2 = t4 : 3 == arguments.length ? (i3 = t4, l2 = r3) : (i3 = t4, o2 = r3, l2 = n3);
              let c = null != o2 ? o2 : s.active(), d = this.startSpan(e3, i3, c), u = (0, a2.setSpan)(c, d);
              return s.with(u, l2, void 0, d);
            }
          }
          t3.NoopTracer = l;
        }, 124: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracerProvider = void 0;
          let n2 = r2(614);
          class a2 {
            getTracer(e3, t4, r3) {
              return new n2.NoopTracer();
            }
          }
          t3.NoopTracerProvider = a2;
        }, 125: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracer = void 0;
          let n2 = new (r2(614)).NoopTracer();
          class a2 {
            constructor(e3, t4, r3, n3) {
              this._provider = e3, this.name = t4, this.version = r3, this.options = n3;
            }
            startSpan(e3, t4, r3) {
              return this._getTracer().startSpan(e3, t4, r3);
            }
            startActiveSpan(e3, t4, r3, n3) {
              let a3 = this._getTracer();
              return Reflect.apply(a3.startActiveSpan, a3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          }
          t3.ProxyTracer = a2;
        }, 846: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracerProvider = void 0;
          let n2 = r2(125), a2 = new (r2(124)).NoopTracerProvider();
          class i2 {
            getTracer(e3, t4, r3) {
              var a3;
              return null !== (a3 = this.getDelegateTracer(e3, t4, r3)) && void 0 !== a3 ? a3 : new n2.ProxyTracer(this, e3, t4, r3);
            }
            getDelegate() {
              var e3;
              return null !== (e3 = this._delegate) && void 0 !== e3 ? e3 : a2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t4, r3) {
              var n3;
              return null === (n3 = this._delegate) || void 0 === n3 ? void 0 : n3.getTracer(e3, t4, r3);
            }
          }
          t3.ProxyTracerProvider = i2;
        }, 996: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SamplingDecision = void 0, function(e3) {
            e3[e3.NOT_RECORD = 0] = "NOT_RECORD", e3[e3.RECORD = 1] = "RECORD", e3[e3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
          }(t3.SamplingDecision || (t3.SamplingDecision = {}));
        }, 607: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.getSpanContext = t3.setSpanContext = t3.deleteSpan = t3.setSpan = t3.getActiveSpan = t3.getSpan = void 0;
          let n2 = r2(780), a2 = r2(403), i2 = r2(491), o = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function s(e3) {
            return e3.getValue(o) || void 0;
          }
          function l(e3, t4) {
            return e3.setValue(o, t4);
          }
          t3.getSpan = s, t3.getActiveSpan = function() {
            return s(i2.ContextAPI.getInstance().active());
          }, t3.setSpan = l, t3.deleteSpan = function(e3) {
            return e3.deleteValue(o);
          }, t3.setSpanContext = function(e3, t4) {
            return l(e3, new a2.NonRecordingSpan(t4));
          }, t3.getSpanContext = function(e3) {
            var t4;
            return null === (t4 = s(e3)) || void 0 === t4 ? void 0 : t4.spanContext();
          };
        }, 325: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceStateImpl = void 0;
          let n2 = r2(564);
          class a2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t4) {
              let r3 = this._clone();
              return r3._internalState.has(e3) && r3._internalState.delete(e3), r3._internalState.set(e3, t4), r3;
            }
            unset(e3) {
              let t4 = this._clone();
              return t4._internalState.delete(e3), t4;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t4) => (e3.push(t4 + "=" + this.get(t4)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t4) => {
                let r3 = t4.trim(), a3 = r3.indexOf("=");
                if (-1 !== a3) {
                  let i2 = r3.slice(0, a3), o = r3.slice(a3 + 1, t4.length);
                  (0, n2.validateKey)(i2) && (0, n2.validateValue)(o) && e4.set(i2, o);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new a2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t3.TraceStateImpl = a2;
        }, 564: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.validateValue = t3.validateKey = void 0;
          let r2 = "[_0-9a-z-*/]", n2 = `[a-z]${r2}{0,255}`, a2 = `[a-z0-9]${r2}{0,240}@[a-z]${r2}{0,13}`, i2 = RegExp(`^(?:${n2}|${a2})$`), o = /^[ -~]{0,255}[!-~]$/, s = /,|=/;
          t3.validateKey = function(e3) {
            return i2.test(e3);
          }, t3.validateValue = function(e3) {
            return o.test(e3) && !s.test(e3);
          };
        }, 98: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createTraceState = void 0;
          let n2 = r2(325);
          t3.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.INVALID_SPAN_CONTEXT = t3.INVALID_TRACEID = t3.INVALID_SPANID = void 0;
          let n2 = r2(475);
          t3.INVALID_SPANID = "0000000000000000", t3.INVALID_TRACEID = "00000000000000000000000000000000", t3.INVALID_SPAN_CONTEXT = { traceId: t3.INVALID_TRACEID, spanId: t3.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanKind = void 0, function(e3) {
            e3[e3.INTERNAL = 0] = "INTERNAL", e3[e3.SERVER = 1] = "SERVER", e3[e3.CLIENT = 2] = "CLIENT", e3[e3.PRODUCER = 3] = "PRODUCER", e3[e3.CONSUMER = 4] = "CONSUMER";
          }(t3.SpanKind || (t3.SpanKind = {}));
        }, 139: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.wrapSpanContext = t3.isSpanContextValid = t3.isValidSpanId = t3.isValidTraceId = void 0;
          let n2 = r2(476), a2 = r2(403), i2 = /^([0-9a-f]{32})$/i, o = /^[0-9a-f]{16}$/i;
          function s(e3) {
            return i2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function l(e3) {
            return o.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t3.isValidTraceId = s, t3.isValidSpanId = l, t3.isSpanContextValid = function(e3) {
            return s(e3.traceId) && l(e3.spanId);
          }, t3.wrapSpanContext = function(e3) {
            return new a2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanStatusCode = void 0, function(e3) {
            e3[e3.UNSET = 0] = "UNSET", e3[e3.OK = 1] = "OK", e3[e3.ERROR = 2] = "ERROR";
          }(t3.SpanStatusCode || (t3.SpanStatusCode = {}));
        }, 475: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceFlags = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.SAMPLED = 1] = "SAMPLED";
          }(t3.TraceFlags || (t3.TraceFlags = {}));
        }, 521: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.VERSION = void 0, t3.VERSION = "1.6.0";
        } }, n = {};
        function a(e2) {
          var r2 = n[e2];
          if (void 0 !== r2) return r2.exports;
          var i2 = n[e2] = { exports: {} }, o = true;
          try {
            t2[e2].call(i2.exports, i2, i2.exports, a), o = false;
          } finally {
            o && delete n[e2];
          }
          return i2.exports;
        }
        a.ab = "//";
        var i = {};
        (() => {
          Object.defineProperty(i, "__esModule", { value: true }), i.trace = i.propagation = i.metrics = i.diag = i.context = i.INVALID_SPAN_CONTEXT = i.INVALID_TRACEID = i.INVALID_SPANID = i.isValidSpanId = i.isValidTraceId = i.isSpanContextValid = i.createTraceState = i.TraceFlags = i.SpanStatusCode = i.SpanKind = i.SamplingDecision = i.ProxyTracerProvider = i.ProxyTracer = i.defaultTextMapSetter = i.defaultTextMapGetter = i.ValueType = i.createNoopMeter = i.DiagLogLevel = i.DiagConsoleLogger = i.ROOT_CONTEXT = i.createContextKey = i.baggageEntryMetadataFromString = void 0;
          var e2 = a(369);
          Object.defineProperty(i, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
            return e2.baggageEntryMetadataFromString;
          } });
          var t3 = a(780);
          Object.defineProperty(i, "createContextKey", { enumerable: true, get: function() {
            return t3.createContextKey;
          } }), Object.defineProperty(i, "ROOT_CONTEXT", { enumerable: true, get: function() {
            return t3.ROOT_CONTEXT;
          } });
          var r2 = a(972);
          Object.defineProperty(i, "DiagConsoleLogger", { enumerable: true, get: function() {
            return r2.DiagConsoleLogger;
          } });
          var n2 = a(957);
          Object.defineProperty(i, "DiagLogLevel", { enumerable: true, get: function() {
            return n2.DiagLogLevel;
          } });
          var o = a(102);
          Object.defineProperty(i, "createNoopMeter", { enumerable: true, get: function() {
            return o.createNoopMeter;
          } });
          var s = a(901);
          Object.defineProperty(i, "ValueType", { enumerable: true, get: function() {
            return s.ValueType;
          } });
          var l = a(194);
          Object.defineProperty(i, "defaultTextMapGetter", { enumerable: true, get: function() {
            return l.defaultTextMapGetter;
          } }), Object.defineProperty(i, "defaultTextMapSetter", { enumerable: true, get: function() {
            return l.defaultTextMapSetter;
          } });
          var c = a(125);
          Object.defineProperty(i, "ProxyTracer", { enumerable: true, get: function() {
            return c.ProxyTracer;
          } });
          var d = a(846);
          Object.defineProperty(i, "ProxyTracerProvider", { enumerable: true, get: function() {
            return d.ProxyTracerProvider;
          } });
          var u = a(996);
          Object.defineProperty(i, "SamplingDecision", { enumerable: true, get: function() {
            return u.SamplingDecision;
          } });
          var p = a(357);
          Object.defineProperty(i, "SpanKind", { enumerable: true, get: function() {
            return p.SpanKind;
          } });
          var h = a(847);
          Object.defineProperty(i, "SpanStatusCode", { enumerable: true, get: function() {
            return h.SpanStatusCode;
          } });
          var g = a(475);
          Object.defineProperty(i, "TraceFlags", { enumerable: true, get: function() {
            return g.TraceFlags;
          } });
          var f = a(98);
          Object.defineProperty(i, "createTraceState", { enumerable: true, get: function() {
            return f.createTraceState;
          } });
          var m = a(139);
          Object.defineProperty(i, "isSpanContextValid", { enumerable: true, get: function() {
            return m.isSpanContextValid;
          } }), Object.defineProperty(i, "isValidTraceId", { enumerable: true, get: function() {
            return m.isValidTraceId;
          } }), Object.defineProperty(i, "isValidSpanId", { enumerable: true, get: function() {
            return m.isValidSpanId;
          } });
          var b = a(476);
          Object.defineProperty(i, "INVALID_SPANID", { enumerable: true, get: function() {
            return b.INVALID_SPANID;
          } }), Object.defineProperty(i, "INVALID_TRACEID", { enumerable: true, get: function() {
            return b.INVALID_TRACEID;
          } }), Object.defineProperty(i, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
            return b.INVALID_SPAN_CONTEXT;
          } });
          let w = a(67);
          Object.defineProperty(i, "context", { enumerable: true, get: function() {
            return w.context;
          } });
          let v = a(506);
          Object.defineProperty(i, "diag", { enumerable: true, get: function() {
            return v.diag;
          } });
          let y = a(886);
          Object.defineProperty(i, "metrics", { enumerable: true, get: function() {
            return y.metrics;
          } });
          let S = a(939);
          Object.defineProperty(i, "propagation", { enumerable: true, get: function() {
            return S.propagation;
          } });
          let _ = a(845);
          Object.defineProperty(i, "trace", { enumerable: true, get: function() {
            return _.trace;
          } }), i.default = { context: w.context, diag: v.diag, metrics: y.metrics, propagation: S.propagation, trace: _.trace };
        })(), e.exports = i;
      })();
    }, 6915: (e) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var t = {};
        (() => {
          t.parse = function(t2, r2) {
            if ("string" != typeof t2) throw TypeError("argument str must be a string");
            for (var a2 = {}, i = t2.split(n), o = (r2 || {}).decode || e2, s = 0; s < i.length; s++) {
              var l = i[s], c = l.indexOf("=");
              if (!(c < 0)) {
                var d = l.substr(0, c).trim(), u = l.substr(++c, l.length).trim();
                '"' == u[0] && (u = u.slice(1, -1)), void 0 == a2[d] && (a2[d] = function(e3, t3) {
                  try {
                    return t3(e3);
                  } catch (t4) {
                    return e3;
                  }
                }(u, o));
              }
            }
            return a2;
          }, t.serialize = function(e3, t2, n2) {
            var i = n2 || {}, o = i.encode || r;
            if ("function" != typeof o) throw TypeError("option encode is invalid");
            if (!a.test(e3)) throw TypeError("argument name is invalid");
            var s = o(t2);
            if (s && !a.test(s)) throw TypeError("argument val is invalid");
            var l = e3 + "=" + s;
            if (null != i.maxAge) {
              var c = i.maxAge - 0;
              if (isNaN(c) || !isFinite(c)) throw TypeError("option maxAge is invalid");
              l += "; Max-Age=" + Math.floor(c);
            }
            if (i.domain) {
              if (!a.test(i.domain)) throw TypeError("option domain is invalid");
              l += "; Domain=" + i.domain;
            }
            if (i.path) {
              if (!a.test(i.path)) throw TypeError("option path is invalid");
              l += "; Path=" + i.path;
            }
            if (i.expires) {
              if ("function" != typeof i.expires.toUTCString) throw TypeError("option expires is invalid");
              l += "; Expires=" + i.expires.toUTCString();
            }
            if (i.httpOnly && (l += "; HttpOnly"), i.secure && (l += "; Secure"), i.sameSite) switch ("string" == typeof i.sameSite ? i.sameSite.toLowerCase() : i.sameSite) {
              case true:
              case "strict":
                l += "; SameSite=Strict";
                break;
              case "lax":
                l += "; SameSite=Lax";
                break;
              case "none":
                l += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return l;
          };
          var e2 = decodeURIComponent, r = encodeURIComponent, n = /; */, a = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), e.exports = t;
      })();
    }, 7814: (e, t, r) => {
      var n;
      (() => {
        var a = { 226: function(a2, i2) {
          !function(o2, s2) {
            "use strict";
            var l = "function", c = "undefined", d = "object", u = "string", p = "major", h = "model", g = "name", f = "type", m = "vendor", b = "version", w = "architecture", v = "console", y = "mobile", S = "tablet", _ = "smarttv", x = "wearable", E = "embedded", P = "Amazon", R = "Apple", O = "ASUS", T = "BlackBerry", C = "Browser", N = "Chrome", A = "Firefox", I = "Google", k = "Huawei", M = "Microsoft", L = "Motorola", D = "Opera", j = "Samsung", U = "Sharp", V = "Sony", H = "Xiaomi", W = "Zebra", $ = "Facebook", q = "Chromium OS", B = "Mac OS", K = function(e2, t2) {
              var r2 = {};
              for (var n2 in e2) t2[n2] && t2[n2].length % 2 == 0 ? r2[n2] = t2[n2].concat(e2[n2]) : r2[n2] = e2[n2];
              return r2;
            }, J = function(e2) {
              for (var t2 = {}, r2 = 0; r2 < e2.length; r2++) t2[e2[r2].toUpperCase()] = e2[r2];
              return t2;
            }, G = function(e2, t2) {
              return typeof e2 === u && -1 !== F(t2).indexOf(F(e2));
            }, F = function(e2) {
              return e2.toLowerCase();
            }, z = function(e2, t2) {
              if (typeof e2 === u) return e2 = e2.replace(/^\s\s*/, ""), typeof t2 === c ? e2 : e2.substring(0, 350);
            }, X = function(e2, t2) {
              for (var r2, n2, a3, i3, o3, c2, u2 = 0; u2 < t2.length && !o3; ) {
                var p2 = t2[u2], h2 = t2[u2 + 1];
                for (r2 = n2 = 0; r2 < p2.length && !o3 && p2[r2]; ) if (o3 = p2[r2++].exec(e2)) for (a3 = 0; a3 < h2.length; a3++) c2 = o3[++n2], typeof (i3 = h2[a3]) === d && i3.length > 0 ? 2 === i3.length ? typeof i3[1] == l ? this[i3[0]] = i3[1].call(this, c2) : this[i3[0]] = i3[1] : 3 === i3.length ? typeof i3[1] !== l || i3[1].exec && i3[1].test ? this[i3[0]] = c2 ? c2.replace(i3[1], i3[2]) : void 0 : this[i3[0]] = c2 ? i3[1].call(this, c2, i3[2]) : void 0 : 4 === i3.length && (this[i3[0]] = c2 ? i3[3].call(this, c2.replace(i3[1], i3[2])) : void 0) : this[i3] = c2 || s2;
                u2 += 2;
              }
            }, Y = function(e2, t2) {
              for (var r2 in t2) if (typeof t2[r2] === d && t2[r2].length > 0) {
                for (var n2 = 0; n2 < t2[r2].length; n2++) if (G(t2[r2][n2], e2)) return "?" === r2 ? s2 : r2;
              } else if (G(t2[r2], e2)) return "?" === r2 ? s2 : r2;
              return e2;
            }, Z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Q = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [b, [g, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [b, [g, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [g, b], [/opios[\/ ]+([\w\.]+)/i], [b, [g, D + " Mini"]], [/\bopr\/([\w\.]+)/i], [b, [g, D]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [g, b], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [b, [g, "UC" + C]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [b, [g, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [b, [g, "WeChat"]], [/konqueror\/([\w\.]+)/i], [b, [g, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [b, [g, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [b, [g, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[g, /(.+)/, "$1 Secure " + C], b], [/\bfocus\/([\w\.]+)/i], [b, [g, A + " Focus"]], [/\bopt\/([\w\.]+)/i], [b, [g, D + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [b, [g, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [b, [g, "Dolphin"]], [/coast\/([\w\.]+)/i], [b, [g, D + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [b, [g, "MIUI " + C]], [/fxios\/([-\w\.]+)/i], [b, [g, A]], [/\bqihu|(qi?ho?o?|360)browser/i], [[g, "360 " + C]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[g, /(.+)/, "$1 " + C], b], [/(comodo_dragon)\/([\w\.]+)/i], [[g, /_/g, " "], b], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [g, b], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [g], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[g, $], b], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [g, b], [/\bgsa\/([\w\.]+) .*safari\//i], [b, [g, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [b, [g, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [b, [g, N + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[g, N + " WebView"], b], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [b, [g, "Android " + C]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [g, b], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [b, [g, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [b, g], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [g, [b, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [g, b], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[g, "Netscape"], b], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [b, [g, A + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [g, b], [/(cobalt)\/([\w\.]+)/i], [g, [b, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[w, "amd64"]], [/(ia32(?=;))/i], [[w, F]], [/((?:i[346]|x)86)[;\)]/i], [[w, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[w, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[w, "armhf"]], [/windows (ce|mobile); ppc;/i], [[w, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[w, /ower/, "", F]], [/(sun4\w)[;\)]/i], [[w, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[w, F]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [h, [m, j], [f, S]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [h, [m, j], [f, y]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [h, [m, R], [f, y]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [h, [m, R], [f, S]], [/(macintosh);/i], [h, [m, R]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [h, [m, U], [f, y]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [h, [m, k], [f, S]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [h, [m, k], [f, y]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[h, /_/g, " "], [m, H], [f, y]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[h, /_/g, " "], [m, H], [f, S]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [h, [m, "OPPO"], [f, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [h, [m, "Vivo"], [f, y]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [h, [m, "Realme"], [f, y]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [h, [m, L], [f, y]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [h, [m, L], [f, S]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [h, [m, "LG"], [f, S]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [h, [m, "LG"], [f, y]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [h, [m, "Lenovo"], [f, S]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[h, /_/g, " "], [m, "Nokia"], [f, y]], [/(pixel c)\b/i], [h, [m, I], [f, S]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [h, [m, I], [f, y]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [h, [m, V], [f, y]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[h, "Xperia Tablet"], [m, V], [f, S]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [h, [m, "OnePlus"], [f, y]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [h, [m, P], [f, S]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[h, /(.+)/g, "Fire Phone $1"], [m, P], [f, y]], [/(playbook);[-\w\),; ]+(rim)/i], [h, m, [f, S]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [h, [m, T], [f, y]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [h, [m, O], [f, S]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [h, [m, O], [f, y]], [/(nexus 9)/i], [h, [m, "HTC"], [f, S]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [m, [h, /_/g, " "], [f, y]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [h, [m, "Acer"], [f, S]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [h, [m, "Meizu"], [f, y]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [m, h, [f, y]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [m, h, [f, S]], [/(surface duo)/i], [h, [m, M], [f, S]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [h, [m, "Fairphone"], [f, y]], [/(u304aa)/i], [h, [m, "AT&T"], [f, y]], [/\bsie-(\w*)/i], [h, [m, "Siemens"], [f, y]], [/\b(rct\w+) b/i], [h, [m, "RCA"], [f, S]], [/\b(venue[\d ]{2,7}) b/i], [h, [m, "Dell"], [f, S]], [/\b(q(?:mv|ta)\w+) b/i], [h, [m, "Verizon"], [f, S]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [h, [m, "Barnes & Noble"], [f, S]], [/\b(tm\d{3}\w+) b/i], [h, [m, "NuVision"], [f, S]], [/\b(k88) b/i], [h, [m, "ZTE"], [f, S]], [/\b(nx\d{3}j) b/i], [h, [m, "ZTE"], [f, y]], [/\b(gen\d{3}) b.+49h/i], [h, [m, "Swiss"], [f, y]], [/\b(zur\d{3}) b/i], [h, [m, "Swiss"], [f, S]], [/\b((zeki)?tb.*\b) b/i], [h, [m, "Zeki"], [f, S]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[m, "Dragon Touch"], h, [f, S]], [/\b(ns-?\w{0,9}) b/i], [h, [m, "Insignia"], [f, S]], [/\b((nxa|next)-?\w{0,9}) b/i], [h, [m, "NextBook"], [f, S]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[m, "Voice"], h, [f, y]], [/\b(lvtel\-)?(v1[12]) b/i], [[m, "LvTel"], h, [f, y]], [/\b(ph-1) /i], [h, [m, "Essential"], [f, y]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [h, [m, "Envizen"], [f, S]], [/\b(trio[-\w\. ]+) b/i], [h, [m, "MachSpeed"], [f, S]], [/\btu_(1491) b/i], [h, [m, "Rotor"], [f, S]], [/(shield[\w ]+) b/i], [h, [m, "Nvidia"], [f, S]], [/(sprint) (\w+)/i], [m, h, [f, y]], [/(kin\.[onetw]{3})/i], [[h, /\./g, " "], [m, M], [f, y]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [h, [m, W], [f, S]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [h, [m, W], [f, y]], [/smart-tv.+(samsung)/i], [m, [f, _]], [/hbbtv.+maple;(\d+)/i], [[h, /^/, "SmartTV"], [m, j], [f, _]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[m, "LG"], [f, _]], [/(apple) ?tv/i], [m, [h, R + " TV"], [f, _]], [/crkey/i], [[h, N + "cast"], [m, I], [f, _]], [/droid.+aft(\w)( bui|\))/i], [h, [m, P], [f, _]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [h, [m, U], [f, _]], [/(bravia[\w ]+)( bui|\))/i], [h, [m, V], [f, _]], [/(mitv-\w{5}) bui/i], [h, [m, H], [f, _]], [/Hbbtv.*(technisat) (.*);/i], [m, h, [f, _]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[m, z], [h, z], [f, _]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[f, _]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [m, h, [f, v]], [/droid.+; (shield) bui/i], [h, [m, "Nvidia"], [f, v]], [/(playstation [345portablevi]+)/i], [h, [m, V], [f, v]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [h, [m, M], [f, v]], [/((pebble))app/i], [m, h, [f, x]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [h, [m, R], [f, x]], [/droid.+; (glass) \d/i], [h, [m, I], [f, x]], [/droid.+; (wt63?0{2,3})\)/i], [h, [m, W], [f, x]], [/(quest( 2| pro)?)/i], [h, [m, $], [f, x]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [m, [f, E]], [/(aeobc)\b/i], [h, [m, P], [f, E]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [h, [f, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [h, [f, S]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[f, S]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[f, y]], [/(android[-\w\. ]{0,9});.+buil/i], [h, [m, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [b, [g, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [b, [g, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [g, b], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [b, g]], os: [[/microsoft (windows) (vista|xp)/i], [g, b], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [g, [b, Y, Z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[g, "Windows"], [b, Y, Z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[b, /_/g, "."], [g, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[g, B], [b, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [b, g], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [g, b], [/\(bb(10);/i], [b, [g, T]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [b, [g, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [b, [g, A + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [b, [g, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [b, [g, "watchOS"]], [/crkey\/([\d\.]+)/i], [b, [g, N + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[g, q], b], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [g, b], [/(sunos) ?([\w\.\d]*)/i], [[g, "Solaris"], b], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [g, b]] }, ee = function(e2, t2) {
              if (typeof e2 === d && (t2 = e2, e2 = s2), !(this instanceof ee)) return new ee(e2, t2).getResult();
              var r2 = typeof o2 !== c && o2.navigator ? o2.navigator : s2, n2 = e2 || (r2 && r2.userAgent ? r2.userAgent : ""), a3 = r2 && r2.userAgentData ? r2.userAgentData : s2, i3 = t2 ? K(Q, t2) : Q, v2 = r2 && r2.userAgent == n2;
              return this.getBrowser = function() {
                var e3, t3 = {};
                return t3[g] = s2, t3[b] = s2, X.call(t3, n2, i3.browser), t3[p] = typeof (e3 = t3[b]) === u ? e3.replace(/[^\d\.]/g, "").split(".")[0] : s2, v2 && r2 && r2.brave && typeof r2.brave.isBrave == l && (t3[g] = "Brave"), t3;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[w] = s2, X.call(e3, n2, i3.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[m] = s2, e3[h] = s2, e3[f] = s2, X.call(e3, n2, i3.device), v2 && !e3[f] && a3 && a3.mobile && (e3[f] = y), v2 && "Macintosh" == e3[h] && r2 && typeof r2.standalone !== c && r2.maxTouchPoints && r2.maxTouchPoints > 2 && (e3[h] = "iPad", e3[f] = S), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[g] = s2, e3[b] = s2, X.call(e3, n2, i3.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[g] = s2, e3[b] = s2, X.call(e3, n2, i3.os), v2 && !e3[g] && a3 && "Unknown" != a3.platform && (e3[g] = a3.platform.replace(/chrome os/i, q).replace(/macos/i, B)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return n2;
              }, this.setUA = function(e3) {
                return n2 = typeof e3 === u && e3.length > 350 ? z(e3, 350) : e3, this;
              }, this.setUA(n2), this;
            };
            ee.VERSION = "1.0.35", ee.BROWSER = J([g, b, p]), ee.CPU = J([w]), ee.DEVICE = J([h, m, f, v, y, _, S, x, E]), ee.ENGINE = ee.OS = J([g, b]), typeof i2 !== c ? (a2.exports && (i2 = a2.exports = ee), i2.UAParser = ee) : r.amdO ? void 0 !== (n = function() {
              return ee;
            }.call(t, r, t, e)) && (e.exports = n) : typeof o2 !== c && (o2.UAParser = ee);
            var et = typeof o2 !== c && (o2.jQuery || o2.Zepto);
            if (et && !et.ua) {
              var er = new ee();
              et.ua = er.getResult(), et.ua.get = function() {
                return er.getUA();
              }, et.ua.set = function(e2) {
                er.setUA(e2);
                var t2 = er.getResult();
                for (var r2 in t2) et.ua[r2] = t2[r2];
              };
            }
          }("object" == typeof window ? window : this);
        } }, i = {};
        function o(e2) {
          var t2 = i[e2];
          if (void 0 !== t2) return t2.exports;
          var r2 = i[e2] = { exports: {} }, n2 = true;
          try {
            a[e2].call(r2.exports, r2, r2.exports, o), n2 = false;
          } finally {
            n2 && delete i[e2];
          }
          return r2.exports;
        }
        o.ab = "//";
        var s = o(226);
        e.exports = s;
      })();
    }, 641: (e) => {
      "use strict";
      e.exports = ["chrome 64", "edge 79", "firefox 67", "opera 51", "safari 12"];
    }, 768: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { getTestReqInfo: function() {
        return o;
      }, withRequest: function() {
        return i;
      } });
      let n = new (r(2067)).AsyncLocalStorage();
      function a(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (r2) return { url: t2.url(e2), proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function i(e2, t2, r2) {
        let i2 = a(e2, t2);
        return i2 ? n.run(i2, r2) : r2();
      }
      function o(e2, t2) {
        return n.getStore() || (e2 && t2 ? a(e2, t2) : void 0);
      }
    }, 3301: (e, t, r) => {
      "use strict";
      var n = r(6195).Buffer;
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { handleFetch: function() {
        return s;
      }, interceptFetch: function() {
        return l;
      }, reader: function() {
        return i;
      } });
      let a = r(768), i = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function o(e2, t2) {
        let { url: r2, method: a2, headers: i2, body: o2, cache: s2, credentials: l2, integrity: c, mode: d, redirect: u, referrer: p, referrerPolicy: h } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: a2, headers: [...Array.from(i2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: o2 ? n.from(await t2.arrayBuffer()).toString("base64") : null, cache: s2, credentials: l2, integrity: c, mode: d, redirect: u, referrer: p, referrerPolicy: h } };
      }
      async function s(e2, t2) {
        let r2 = (0, a.getTestReqInfo)(t2, i);
        if (!r2) return e2(t2);
        let { testData: s2, proxyPort: l2 } = r2, c = await o(s2, t2), d = await e2(`http://localhost:${l2}`, { method: "POST", body: JSON.stringify(c), next: { internal: true } });
        if (!d.ok) throw Error(`Proxy request failed: ${d.status}`);
        let u = await d.json(), { api: p } = u;
        switch (p) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Error(`Proxy request aborted [${t2.method} ${t2.url}]`);
        }
        return function(e3) {
          let { status: t3, headers: r3, body: a2 } = e3.response;
          return new Response(a2 ? n.from(a2, "base64") : null, { status: t3, headers: new Headers(r3) });
        }(u);
      }
      function l(e2) {
        return r.g.fetch = function(t2, r2) {
          var n2;
          return (null == r2 ? void 0 : null == (n2 = r2.next) ? void 0 : n2.internal) ? e2(t2, r2) : s(e2, new Request(t2, r2));
        }, () => {
          r.g.fetch = e2;
        };
      }
    }, 1423: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { interceptTestApis: function() {
        return i;
      }, wrapRequestHandler: function() {
        return o;
      } });
      let n = r(768), a = r(3301);
      function i() {
        return (0, a.interceptFetch)(r.g.fetch);
      }
      function o(e2) {
        return (t2, r2) => (0, n.withRequest)(t2, a.reader, () => e2(t2, r2));
      }
    }, 4641: (e, t, r) => {
      "use strict";
      r.d(t, { P: () => o });
      let n = Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available");
      class a {
        disable() {
          throw n;
        }
        getStore() {
        }
        run() {
          throw n;
        }
        exit() {
          throw n;
        }
        enterWith() {
          throw n;
        }
      }
      let i = globalThis.AsyncLocalStorage;
      function o() {
        return i ? new i() : new a();
      }
    }, 5945: (e, t, r) => {
      "use strict";
      r.d(t, { F: () => n });
      let n = (0, r(4641).P)();
    }, 9510: (e, t, r) => {
      "use strict";
      r.d(t, { A: () => n });
      let n = (0, r(4641).P)();
    } }, (e) => {
      var t = e(e.s = 4880);
      (_ENTRIES = "undefined" == typeof _ENTRIES ? {} : _ENTRIES)["middleware_src/middleware"] = t;
    }]);
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "src/middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/dashboard(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(.json)?[\\/#\\?]?$"] }];
    require_prerender_manifest();
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "eslint": { "ignoreDuringBuilds": false }, "typescript": { "ignoreBuildErrors": false, "tsconfigPath": "tsconfig.json" }, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.js", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "analyticsId": "", "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/webp"], "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "inline", "remotePatterns": [], "unoptimized": false }, "devIndicators": { "buildActivity": true, "buildActivityPosition": "bottom-right" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "optimizeFonts": true, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": null, "httpAgentOptions": { "keepAlive": true }, "outputFileTracing": true, "staticPageGenerationTimeout": 60, "swcMinify": true, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "experimental": { "prerenderEarlyExit": false, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 7, "memoryBasedWorkersCount": false, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "outputFileTracingRoot": "/Users/harshnpatel/Documents/github/ohmylife", "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "adjustFontFallbacks": false, "adjustFontFallbacksWithSizeAdjust": false, "typedRoutes": false, "instrumentationHook": false, "bundlePagesExternals": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "missingSuspenseWithCSRBailout": true, "optimizeServerReact": true, "useEarlyImport": false, "staleTimes": { "dynamic": 30, "static": 300 }, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "configFileName": "next.config.js" };
var BuildId = "uCg76zy8A8EFuazfC9hXw";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/dashboard", "regex": "^/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard(?:/)?$" }, { "page": "/dashboard/admin", "regex": "^/dashboard/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/admin(?:/)?$" }, { "page": "/dashboard/leads", "regex": "^/dashboard/leads(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/leads(?:/)?$" }, { "page": "/dashboard/notes", "regex": "^/dashboard/notes(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/notes(?:/)?$" }, { "page": "/dashboard/people", "regex": "^/dashboard/people(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/people(?:/)?$" }, { "page": "/dashboard/projects", "regex": "^/dashboard/projects(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/projects(?:/)?$" }, { "page": "/dashboard/projects/new", "regex": "^/dashboard/projects/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/projects/new(?:/)?$" }, { "page": "/dashboard/sales", "regex": "^/dashboard/sales(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/sales(?:/)?$" }, { "page": "/dashboard/tasks", "regex": "^/dashboard/tasks(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/tasks(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }], "dynamic": [{ "page": "/api/clients/[id]", "regex": "^/api/clients/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/clients/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/files/[...key]", "regex": "^/api/files/(.+?)(?:/)?$", "routeKeys": { "nxtPkey": "nxtPkey" }, "namedRegex": "^/api/files/(?<nxtPkey>.+?)(?:/)?$" }, { "page": "/api/leads/[id]", "regex": "^/api/leads/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/leads/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/notes/[id]", "regex": "^/api/notes/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/notes/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/people/[id]", "regex": "^/api/people/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/people/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/projects/[id]", "regex": "^/api/projects/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/projects/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/projects/[id]/chat", "regex": "^/api/projects/([^/]+?)/chat(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/projects/(?<nxtPid>[^/]+?)/chat(?:/)?$" }, { "page": "/api/projects/[id]/chat/messages", "regex": "^/api/projects/([^/]+?)/chat/messages(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/projects/(?<nxtPid>[^/]+?)/chat/messages(?:/)?$" }, { "page": "/api/projects/[id]/files", "regex": "^/api/projects/([^/]+?)/files(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/projects/(?<nxtPid>[^/]+?)/files(?:/)?$" }, { "page": "/api/projects/[id]/files/[fileId]", "regex": "^/api/projects/([^/]+?)/files/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid", "nxtPfileId": "nxtPfileId" }, "namedRegex": "^/api/projects/(?<nxtPid>[^/]+?)/files/(?<nxtPfileId>[^/]+?)(?:/)?$" }, { "page": "/api/projects/[id]/notes", "regex": "^/api/projects/([^/]+?)/notes(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/projects/(?<nxtPid>[^/]+?)/notes(?:/)?$" }, { "page": "/api/projects/[id]/notes/[noteId]", "regex": "^/api/projects/([^/]+?)/notes/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid", "nxtPnoteId": "nxtPnoteId" }, "namedRegex": "^/api/projects/(?<nxtPid>[^/]+?)/notes/(?<nxtPnoteId>[^/]+?)(?:/)?$" }, { "page": "/api/projects/[id]/tasks", "regex": "^/api/projects/([^/]+?)/tasks(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/projects/(?<nxtPid>[^/]+?)/tasks(?:/)?$" }, { "page": "/api/projects/[id]/tasks/[taskId]", "regex": "^/api/projects/([^/]+?)/tasks/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid", "nxtPtaskId": "nxtPtaskId" }, "namedRegex": "^/api/projects/(?<nxtPid>[^/]+?)/tasks/(?<nxtPtaskId>[^/]+?)(?:/)?$" }, { "page": "/api/sales/[id]", "regex": "^/api/sales/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/sales/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/tasks/[id]", "regex": "^/api/tasks/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/tasks/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/dashboard/projects/[id]", "regex": "^/dashboard/projects/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/dashboard/projects/(?<nxtPid>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/dashboard/notes": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/notes", "dataRoute": "/dashboard/notes.rsc" }, "/dashboard/leads": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/leads", "dataRoute": "/dashboard/leads.rsc" }, "/dashboard/projects/new": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/projects/new", "dataRoute": "/dashboard/projects/new.rsc" }, "/dashboard/projects": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/projects", "dataRoute": "/dashboard/projects.rsc" }, "/dashboard/sales": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/sales", "dataRoute": "/dashboard/sales.rsc" }, "/login": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/login", "dataRoute": "/login.rsc" }, "/dashboard/admin": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/admin", "dataRoute": "/dashboard/admin.rsc" }, "/dashboard": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard", "dataRoute": "/dashboard.rsc" }, "/dashboard/tasks": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/tasks", "dataRoute": "/dashboard/tasks.rsc" }, "/": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc" }, "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null }, "/dashboard/people": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/people", "dataRoute": "/dashboard/people.rsc" } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["prerender-manifest.js", "server/edge-runtime-webpack.js", "server/src/middleware.js"], "name": "src/middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/dashboard(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(.json)?[\\/#\\?]?$", "originalSource": "/dashboard/:path*" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } } }, "functions": { "/api/files/[...key]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/app/api/files/[...key]/route.js"], "name": "app/api/files/[...key]/route", "page": "/api/files/[...key]/route", "matchers": [{ "regexp": "^/api/files/(?<key>.+?)$", "originalSource": "/api/files/[...key]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/dashboard/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/dashboard/route.js"], "name": "app/api/dashboard/route", "page": "/api/dashboard/route", "matchers": [{ "regexp": "^/api/dashboard$", "originalSource": "/api/dashboard" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/auth/login/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/edge-chunks/330.js", "server/app/api/auth/login/route.js"], "name": "app/api/auth/login/route", "page": "/api/auth/login/route", "matchers": [{ "regexp": "^/api/auth/login$", "originalSource": "/api/auth/login" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/clients/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/clients/route.js"], "name": "app/api/clients/route", "page": "/api/clients/route", "matchers": [{ "regexp": "^/api/clients$", "originalSource": "/api/clients" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/leads/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/leads/route.js"], "name": "app/api/leads/route", "page": "/api/leads/route", "matchers": [{ "regexp": "^/api/leads$", "originalSource": "/api/leads" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/leads/[id]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/leads/[id]/route.js"], "name": "app/api/leads/[id]/route", "page": "/api/leads/[id]/route", "matchers": [{ "regexp": "^/api/leads/(?<id>[^/]+?)$", "originalSource": "/api/leads/[id]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/notes/[id]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/notes/[id]/route.js"], "name": "app/api/notes/[id]/route", "page": "/api/notes/[id]/route", "matchers": [{ "regexp": "^/api/notes/(?<id>[^/]+?)$", "originalSource": "/api/notes/[id]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/clients/[id]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/clients/[id]/route.js"], "name": "app/api/clients/[id]/route", "page": "/api/clients/[id]/route", "matchers": [{ "regexp": "^/api/clients/(?<id>[^/]+?)$", "originalSource": "/api/clients/[id]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/notes/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/notes/route.js"], "name": "app/api/notes/route", "page": "/api/notes/route", "matchers": [{ "regexp": "^/api/notes$", "originalSource": "/api/notes" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/people/[id]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/people/[id]/route.js"], "name": "app/api/people/[id]/route", "page": "/api/people/[id]/route", "matchers": [{ "regexp": "^/api/people/(?<id>[^/]+?)$", "originalSource": "/api/people/[id]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/people/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/people/route.js"], "name": "app/api/people/route", "page": "/api/people/route", "matchers": [{ "regexp": "^/api/people$", "originalSource": "/api/people" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/[id]/files/[fileId]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/projects/[id]/files/[fileId]/route.js"], "name": "app/api/projects/[id]/files/[fileId]/route", "page": "/api/projects/[id]/files/[fileId]/route", "matchers": [{ "regexp": "^/api/projects/(?<id>[^/]+?)/files/(?<fileId>[^/]+?)$", "originalSource": "/api/projects/[id]/files/[fileId]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/[id]/chat/messages/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/projects/[id]/chat/messages/route.js"], "name": "app/api/projects/[id]/chat/messages/route", "page": "/api/projects/[id]/chat/messages/route", "matchers": [{ "regexp": "^/api/projects/(?<id>[^/]+?)/chat/messages$", "originalSource": "/api/projects/[id]/chat/messages" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/[id]/files/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/projects/[id]/files/route.js"], "name": "app/api/projects/[id]/files/route", "page": "/api/projects/[id]/files/route", "matchers": [{ "regexp": "^/api/projects/(?<id>[^/]+?)/files$", "originalSource": "/api/projects/[id]/files" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/[id]/chat/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/app/api/projects/[id]/chat/route.js"], "name": "app/api/projects/[id]/chat/route", "page": "/api/projects/[id]/chat/route", "matchers": [{ "regexp": "^/api/projects/(?<id>[^/]+?)/chat$", "originalSource": "/api/projects/[id]/chat" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/[id]/tasks/[taskId]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/projects/[id]/tasks/[taskId]/route.js"], "name": "app/api/projects/[id]/tasks/[taskId]/route", "page": "/api/projects/[id]/tasks/[taskId]/route", "matchers": [{ "regexp": "^/api/projects/(?<id>[^/]+?)/tasks/(?<taskId>[^/]+?)$", "originalSource": "/api/projects/[id]/tasks/[taskId]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/[id]/notes/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/projects/[id]/notes/route.js"], "name": "app/api/projects/[id]/notes/route", "page": "/api/projects/[id]/notes/route", "matchers": [{ "regexp": "^/api/projects/(?<id>[^/]+?)/notes$", "originalSource": "/api/projects/[id]/notes" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/[id]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/projects/[id]/route.js"], "name": "app/api/projects/[id]/route", "page": "/api/projects/[id]/route", "matchers": [{ "regexp": "^/api/projects/(?<id>[^/]+?)$", "originalSource": "/api/projects/[id]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/reset-admin/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/edge-chunks/330.js", "server/app/api/reset-admin/route.js"], "name": "app/api/reset-admin/route", "page": "/api/reset-admin/route", "matchers": [{ "regexp": "^/api/reset\\-admin$", "originalSource": "/api/reset-admin" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/[id]/notes/[noteId]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/projects/[id]/notes/[noteId]/route.js"], "name": "app/api/projects/[id]/notes/[noteId]/route", "page": "/api/projects/[id]/notes/[noteId]/route", "matchers": [{ "regexp": "^/api/projects/(?<id>[^/]+?)/notes/(?<noteId>[^/]+?)$", "originalSource": "/api/projects/[id]/notes/[noteId]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/projects/route.js"], "name": "app/api/projects/route", "page": "/api/projects/route", "matchers": [{ "regexp": "^/api/projects$", "originalSource": "/api/projects" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/setup/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/edge-chunks/330.js", "server/app/api/setup/route.js"], "name": "app/api/setup/route", "page": "/api/setup/route", "matchers": [{ "regexp": "^/api/setup$", "originalSource": "/api/setup" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/tasks/[id]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/tasks/[id]/route.js"], "name": "app/api/tasks/[id]/route", "page": "/api/tasks/[id]/route", "matchers": [{ "regexp": "^/api/tasks/(?<id>[^/]+?)$", "originalSource": "/api/tasks/[id]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/projects/[id]/tasks/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/projects/[id]/tasks/route.js"], "name": "app/api/projects/[id]/tasks/route", "page": "/api/projects/[id]/tasks/route", "matchers": [{ "regexp": "^/api/projects/(?<id>[^/]+?)/tasks$", "originalSource": "/api/projects/[id]/tasks" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/sales/[id]/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/sales/[id]/route.js"], "name": "app/api/sales/[id]/route", "page": "/api/sales/[id]/route", "matchers": [{ "regexp": "^/api/sales/(?<id>[^/]+?)$", "originalSource": "/api/sales/[id]" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/tasks/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/tasks/route.js"], "name": "app/api/tasks/route", "page": "/api/tasks/route", "matchers": [{ "regexp": "^/api/tasks$", "originalSource": "/api/tasks" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/transactions/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/transactions/route.js"], "name": "app/api/transactions/route", "page": "/api/transactions/route", "matchers": [{ "regexp": "^/api/transactions$", "originalSource": "/api/transactions" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/sales/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/app/api/sales/route.js"], "name": "app/api/sales/route", "page": "/api/sales/route", "matchers": [{ "regexp": "^/api/sales$", "originalSource": "/api/sales" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } }, "/api/users/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "prerender-manifest.js", "server/edge-runtime-webpack.js", "server/edge-chunks/46.js", "server/edge-chunks/825.js", "server/edge-chunks/330.js", "server/app/api/users/route.js"], "name": "app/api/users/route", "page": "/api/users/route", "matchers": [{ "regexp": "^/api/users$", "originalSource": "/api/users" }], "wasm": [], "assets": [], "environments": { "previewModeId": "515a00fa4fbee96d515ece9955348b9f", "previewModeSigningKey": "0d98cbc7d86d4c50fa9fd7ea12e4dc0e3160bdd9c2d5d58aa8ab0f17d27b105d", "previewModeEncryptionKey": "b6083b42fa3f7f307c6cf4500529304e5ffab75b62808d1c0d50a351abf8d546" } } }, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/page": "/", "/login/page": "/login", "/favicon.ico/route": "/favicon.ico", "/dashboard/admin/page": "/dashboard/admin", "/dashboard/notes/page": "/dashboard/notes", "/dashboard/page": "/dashboard", "/dashboard/people/page": "/dashboard/people", "/dashboard/projects/[id]/page": "/dashboard/projects/[id]", "/dashboard/projects/page": "/dashboard/projects", "/dashboard/projects/new/page": "/dashboard/projects/new", "/dashboard/leads/page": "/dashboard/leads", "/dashboard/sales/page": "/dashboard/sales", "/dashboard/tasks/page": "/dashboard/tasks", "/api/files/[...key]/route": "/api/files/[...key]", "/api/dashboard/route": "/api/dashboard", "/api/auth/login/route": "/api/auth/login", "/api/clients/route": "/api/clients", "/api/leads/route": "/api/leads", "/api/leads/[id]/route": "/api/leads/[id]", "/api/notes/[id]/route": "/api/notes/[id]", "/api/clients/[id]/route": "/api/clients/[id]", "/api/notes/route": "/api/notes", "/api/people/[id]/route": "/api/people/[id]", "/api/people/route": "/api/people", "/api/projects/[id]/files/[fileId]/route": "/api/projects/[id]/files/[fileId]", "/api/projects/[id]/chat/messages/route": "/api/projects/[id]/chat/messages", "/api/projects/[id]/files/route": "/api/projects/[id]/files", "/api/projects/[id]/chat/route": "/api/projects/[id]/chat", "/api/projects/[id]/tasks/[taskId]/route": "/api/projects/[id]/tasks/[taskId]", "/api/projects/[id]/notes/route": "/api/projects/[id]/notes", "/api/projects/[id]/route": "/api/projects/[id]", "/api/reset-admin/route": "/api/reset-admin", "/api/projects/[id]/notes/[noteId]/route": "/api/projects/[id]/notes/[noteId]", "/api/projects/route": "/api/projects", "/api/setup/route": "/api/setup", "/api/tasks/[id]/route": "/api/tasks/[id]", "/api/projects/[id]/tasks/route": "/api/projects/[id]/tasks", "/api/sales/[id]/route": "/api/sales/[id]", "/api/tasks/route": "/api/tasks", "/api/transactions/route": "/api/transactions", "/api/sales/route": "/api/sales", "/api/users/route": "/api/users" };
var FunctionsConfigManifest = { "version": 1, "functions": { "/api/auth/login": {}, "/api/clients": {}, "/api/clients/[id]": {}, "/api/files/[...key]": {}, "/api/leads/[id]": {}, "/api/leads": {}, "/api/notes": {}, "/api/notes/[id]": {}, "/api/dashboard": {}, "/api/projects/[id]/chat": {}, "/api/people": {}, "/api/projects/[id]/files/[fileId]": {}, "/api/projects/[id]/notes": {}, "/api/projects/[id]/files": {}, "/api/projects/[id]/notes/[noteId]": {}, "/api/projects/[id]/chat/messages": {}, "/api/projects/[id]": {}, "/api/projects/[id]/tasks": {}, "/api/projects": {}, "/api/reset-admin": {}, "/api/projects/[id]/tasks/[taskId]": {}, "/api/people/[id]": {}, "/api/sales/[id]": {}, "/api/setup": {}, "/api/sales": {}, "/api/users": {}, "/api/tasks": {}, "/api/tasks/[id]": {}, "/api/transactions": {} } };
var PagesManifest = { "/_app": "pages/_app.js", "/_error": "pages/_error.js", "/_document": "pages/_document.js", "/404": "pages/404.html" };
process.env.NEXT_BUILD_ID = BuildId;

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream2 } from "node:stream/web";

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (host) {
    return pattern.test(url) && !url.includes(host);
  }
  return pattern.test(url);
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream2({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest.routes).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {});
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = Boolean(event.headers.rsc);
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest.routes).includes(localizedPath ?? "/") || Object.values(PrerenderManifest.dynamicRoutes).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/.pnpm/path-to-regexp@6.3.0/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes, routes } = prerenderManifest;
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest.preview.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/.pnpm/@opennextjs+aws@3.9.0/node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
/*!
* cookie
* Copyright(c) 2012-2014 Roman Shtylman
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*/
