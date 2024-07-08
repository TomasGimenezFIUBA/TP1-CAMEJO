import './chunks/core_USlzilVn.mjs';
import './chunks/astro/server_CQA8kpKt.mjs';

/**
 * Tokenize input string.
 */
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
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
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
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
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
                }
                else if (str[j] === "(") {
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
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
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
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@4.11.5/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/api/auth/[...auth]","pattern":"^\\/api\\/auth(?:\\/(.*?))?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"...auth","dynamic":true,"spread":true}]],"params":["...auth"],"component":"node_modules/.pnpm/auth-astro@4.1.2_@auth+core@0.34.1_astro@4.11.5_next@14.2.4_@babel+core@7.24.7_react-dom@18.3_c3s6jkffai6pqwchvmcv5efogm/node_modules/auth-astro/src/api/[...auth].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/create-exercise.C7VHxWlM.css"},{"type":"inline","content":"input[data-astro-cid-3fjig675]{font-size:23px}button[data-astro-cid-3fjig675]{font-size:30px}.subtitles[data-astro-cid-3fjig675]{font-family:inherit;font-size:20px;color:#00ff37b7}.cont-subtit[data-astro-cid-3fjig675]{display:flex;justify-content:center}#body-parts[data-astro-cid-3fjig675]{margin-right:22%}#objects[data-astro-cid-3fjig675]{margin-left:22%}.cont-filter[data-astro-cid-3fjig675]{display:flex;justify-content:center}.form[data-astro-cid-3fjig675]{position:relative;display:flex;flex-direction:column;text-align:center;margin-left:350px;margin-right:350px;margin-bottom:200px;background-color:#252424;top:100px}#exercise-name[data-astro-cid-3fjig675]{color:#000;margin:30px}#back[data-astro-cid-3fjig675],#create[data-astro-cid-3fjig675]{margin:10px;padding:5px 40px;background-color:#000;color:#00ff37b7}\n"}],"routeData":{"route":"/create-exercise","isIndex":false,"type":"page","pattern":"^\\/create-exercise\\/?$","segments":[[{"content":"create-exercise","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/create-exercise.astro","pathname":"/create-exercise","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/create-exercise.C7VHxWlM.css"},{"type":"inline","content":".equipment-selector{display:flex;align-items:center;justify-content:space-between;width:90%;margin:auto;position:relative;padding:20px;background-color:#f7f7f7;border-radius:10px;box-shadow:0 4px 10px #0000001a}.equipment-list{display:flex;overflow:hidden;width:100%;margin:0 20px}.equipment-item{flex:0 0 22%;margin:0 10px;cursor:pointer;transition:transform .3s,box-shadow .3s;text-align:center;background-color:#fff;border-radius:10px;box-shadow:0 2px 4px #0000001a;transition:box-shadow .3s ease-in-out,transform .3s ease-in-out}.equipment-item:hover{box-shadow:0 4px 8px #0003;transform:translateY(-5px)}.equipment-item img{width:100%;height:150px;-o-object-fit:cover;object-fit:cover;border-top-left-radius:10px;border-top-right-radius:10px}.equipment-item h3{margin:10px 0;font-size:1.2rem;color:#333}.equipment-item.selected{border:2px solid #28a745;transform:scale(1.05)}button{background-color:#28a745;color:#fff;border:none;padding:10px;cursor:pointer;border-radius:50%;width:40px;height:40px;box-shadow:0 4px 10px #0003;transition:background-color .3s,transform .3s;display:flex;align-items:center;justify-content:center;font-size:1.2rem}button:disabled{background-color:#ccc;cursor:not-allowed}button:not(:disabled):hover{background-color:#218838;transform:scale(1.1)}\n.muscle-groups{position:relative;padding:.5rem;border-radius:5px;box-shadow:0 2px 5px #0000004d;overflow:hidden;border-top:.25rem solid #28a745;background-color:#2d2d2d;color:#fff;font-family:Montserrat,sans-serif;display:flex;flex-direction:column;align-items:center}.muscle-groups h1{margin:-.5rem -.5rem .5rem;padding:.5rem;background:#28a745;color:#fff;text-align:center;font-size:1rem;text-transform:uppercase;letter-spacing:.05rem}.muscle-groups .content{display:flex;align-items:center;flex-direction:row;width:100%}.muscle-groups .inputs{display:flex;flex-direction:column;gap:.2rem;width:100%}.svg-container{display:flex;align-items:center;justify-content:center;height:100%;width:100%;max-height:400px;margin-left:1rem}.muscle-groups h2{margin:.25rem 0;font-size:.8rem;letter-spacing:.03em;text-transform:uppercase;color:#28a745;border-bottom:1px solid #28a745;padding-bottom:.25rem}.muscle-groups label+h2{margin-top:1rem}.muscle-groups label{display:block;margin:.25rem 0;cursor:pointer;font-size:1rem;opacity:.7;transition:all .3s ease;padding:.25rem .5rem;border-radius:3px;background:#333;color:#fff;text-align:center}.muscle-groups label:hover,.muscle-groups label.hover{opacity:1;background:#28a745;color:#fff}.muscle-groups input:checked+label{font-weight:700;background:#28a745;color:#fff;opacity:1}.muscle-groups svg{position:relative;width:100%;height:auto;z-index:100}.muscle-groups svg g[id] path{opacity:.2;transition:opacity .2s ease-in-out}.muscle-groups svg g g[id]:hover path{cursor:pointer;opacity:.4;fill:#28a745!important}.muscle-groups .muscles-helper{display:none}.muscle-groups label[for=obliques]:hover~.svg-container svg #Obliques path,.muscle-groups label[for=abs]:hover~.svg-container svg #Abs path,.muscle-groups label[for=quads]:hover~.svg-container svg #Quads path,.muscle-groups label[for=biceps]:hover~.svg-container svg #Biceps path,.muscle-groups label[for=adductors]:hover~.svg-container svg #Adductors path,.muscle-groups label[for=pectorals]:hover~.svg-container svg #Pectorals path,.muscle-groups label[for=deltoids]:hover~.svg-container svg #Deltoids path,.muscle-groups label[for=hamstrings]:hover~.svg-container svg #Hamstrings path,.muscle-groups label[for=forearms]:hover~.svg-container svg #Forearms path,.muscle-groups label[for=calves]:hover~.svg-container svg #Calves path,.muscle-groups label[for=triceps]:hover~.svg-container svg #Triceps path,.muscle-groups label[for=glutes]:hover~.svg-container svg #Glutes path,.muscle-groups label[for=lats]:hover~.svg-container svg #Lats path,.muscle-groups label[for=trapezius]:hover~.svg-container svg #Trapezius path{opacity:.35;fill:#28a745!important}.muscle-groups .obliques:checked~.svg-container svg #Obliques path,.muscle-groups .abs:checked~.svg-container svg #Abs path,.muscle-groups .quads:checked~.svg-container svg #Quads path,.muscle-groups .biceps:checked~.svg-container svg #Biceps path,.muscle-groups .adductors:checked~.svg-container svg #Adductors path,.muscle-groups .pectorals:checked~.svg-container svg #Pectorals path,.muscle-groups .deltoids:checked~.svg-container svg #Deltoids path,.muscle-groups .hamstrings:checked~.svg-container svg #Hamstrings path,.muscle-groups .forearms:checked~.svg-container svg #Forearms path,.muscle-groups .calves:checked~.svg-container svg #Calves path,.muscle-groups .triceps:checked~.svg-container svg #Triceps path,.muscle-groups .glutes:checked~.svg-container svg #Glutes path,.muscle-groups .lats:checked~.svg-container svg #Lats path,.muscle-groups .trapezius:checked~.svg-container svg #Trapezius path{opacity:.6;fill:#28a745!important}html{background:#1c1c1c;background:linear-gradient(45deg,#111,#333)}body{font-family:Montserrat,sans-serif;color:#fff}main{display:flex;justify-content:center;align-items:center;min-height:100vh;width:100%;padding:1rem 0}main .info{font-size:.6rem;display:block;width:200px;padding-top:150px;color:#eee;padding-left:1rem;opacity:.5}main .info:hover{opacity:1}main .info a{color:#eee}\n"}],"routeData":{"route":"/demos","isIndex":false,"type":"page","pattern":"^\\/demos\\/?$","segments":[[{"content":"demos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/demos.astro","pathname":"/demos","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"document.getElementById(\"login-form\").addEventListener(\"submit\",function(e){const t=document.getElementById(\"email\").value,n=document.getElementById(\"password\").value;!t||!n?(alert(\"Please complete all fields\"),e.preventDefault()):/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$/.test(t)?n.length<6&&(alert(\"Password must be at least 8 characters.\"),e.preventDefault()):(alert(\"Mail is not valid\"),e.preventDefault())});async function h(e,t,n){const{callbackUrl:a=window.location.href,redirect:o=!0}=t??{},{prefix:r=\"/api/auth\",...c}=t??{},s=e===\"credentials\",d=s||e===\"email\",w=`${`${r}/${s?\"callback\":\"signin\"}/${e}`}?${new URLSearchParams(n)}`,u=await fetch(`${r}/csrf`),{csrfToken:f}=await u.json(),l=await fetch(w,{method:\"post\",headers:{\"Content-Type\":\"application/x-www-form-urlencoded\",\"X-Auth-Return-Redirect\":\"1\"},body:new URLSearchParams({...c,csrfToken:f,callbackUrl:a})}),i=await l.clone().json(),m=new URL(i.url).searchParams.get(\"error\");if(o||!d||!m){window.location.href=i.url??a,i.url.includes(\"#\")&&window.location.reload();return}return l}async function p(e){const{callbackUrl:t=window.location.href,prefix:n=\"/api/auth\"}=e??{},a=await fetch(`${n}/csrf`),{csrfToken:o}=await a.json(),s=(await(await fetch(`${n}/signout`,{method:\"post\",headers:{\"Content-Type\":\"application/x-www-form-urlencoded\",\"X-Auth-Return-Redirect\":\"1\"},body:new URLSearchParams({csrfToken:o,callbackUrl:t})})).json()).url??t;window.location.href=s,s.includes(\"#\")&&window.location.reload()}window.signIn=h;window.signOut=p;\n"}],"styles":[{"type":"external","src":"/_astro/create-exercise.C7VHxWlM.css"},{"type":"inline","content":".login-section[data-astro-cid-sgpqyurt]{display:flex;justify-content:center;align-items:center;height:100vh;background-color:#f8f9fa}.container[data-astro-cid-sgpqyurt]{max-width:400px;width:100%;padding:20px;background-color:#fff;box-shadow:0 4px 8px #0000001a;border-radius:8px}.login-box[data-astro-cid-sgpqyurt]{text-align:center}.login-header[data-astro-cid-sgpqyurt] h1[data-astro-cid-sgpqyurt]{margin-bottom:10px;font-size:24px}.login-header[data-astro-cid-sgpqyurt] p[data-astro-cid-sgpqyurt]{margin-bottom:20px;color:#6c757d}.login-form[data-astro-cid-sgpqyurt] .form-group[data-astro-cid-sgpqyurt]{margin-bottom:15px;text-align:left}.login-form[data-astro-cid-sgpqyurt] .form-control[data-astro-cid-sgpqyurt]{width:100%;padding:10px;border:1px solid #ced4da;border-radius:4px;font-size:16px}.login-form[data-astro-cid-sgpqyurt] .form-control[data-astro-cid-sgpqyurt]:focus{outline:none;border-color:#80bdff;box-shadow:0 0 0 .2rem #007bff40}.btn-submit[data-astro-cid-sgpqyurt]{width:100%;padding:10px;background-color:#007bff;border:none;border-radius:4px;color:#fff;font-size:16px;cursor:pointer;transition:background-color .3s ease}.btn-submit[data-astro-cid-sgpqyurt]:hover{background-color:#0056b3}.register-link[data-astro-cid-sgpqyurt]{margin-top:20px}.register-link[data-astro-cid-sgpqyurt] p[data-astro-cid-sgpqyurt]{color:#6c757d}.register-link[data-astro-cid-sgpqyurt] a[data-astro-cid-sgpqyurt]{color:#007bff;text-decoration:none}.register-link[data-astro-cid-sgpqyurt] a[data-astro-cid-sgpqyurt]:hover{text-decoration:underline}.providers[data-astro-cid-sgpqyurt]{display:flex;justify-content:center;margin-top:20px;color:#000}input[data-astro-cid-sgpqyurt]{color:#000}\n"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/create-exercise.C7VHxWlM.css"},{"type":"inline","content":".imagen[data-astro-cid-srrqrnxk]{height:200px;width:200px}.cont-filter[data-astro-cid-srrqrnxk]{display:flex;justify-content:center}\nul[data-astro-cid-oms62v7c]{position:relative;list-style:none;padding:0;font-size:25px;top:50px}.content[data-astro-cid-oms62v7c]{height:100px;background-color:#252424;border:1px solid #ffffff44}li[data-astro-cid-oms62v7c]{display:flex}.name-calories[data-astro-cid-oms62v7c],.used-mucle[data-astro-cid-oms62v7c],.used-object[data-astro-cid-oms62v7c]{position:relative;top:13px;text-align:center;margin-left:7%;margin-right:7%}.button[data-astro-cid-oms62v7c]{position:relative;bottom:13px;margin:2% 100px 2% 2%;background-color:#0800ff86;padding-left:10px;padding-right:10px;left:150px;height:50px;font-size:23px;border-radius:5px}\n"}],"routeData":{"route":"/search-exercise","isIndex":false,"type":"page","pattern":"^\\/search-exercise\\/?$","segments":[[{"content":"search-exercise","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/search-exercise.astro","pathname":"/search-exercise","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/create-exercise.C7VHxWlM.css"},{"type":"inline","content":".imagen[data-astro-cid-srrqrnxk]{height:200px;width:200px}.cont-filter[data-astro-cid-srrqrnxk]{display:flex;justify-content:center}\nul[data-astro-cid-6zzp6orr]{position:relative;list-style:none;padding:0;font-size:25px;top:50px}.content[data-astro-cid-6zzp6orr]{height:100px;background-color:#252424;border:1px solid #ffffff44}li[data-astro-cid-6zzp6orr]{display:flex}.name-calories[data-astro-cid-6zzp6orr],.used-mucle[data-astro-cid-6zzp6orr],.used-object[data-astro-cid-6zzp6orr]{position:relative;top:13px;text-align:center;margin-left:7%;margin-right:7%}.button[data-astro-cid-6zzp6orr]{position:relative;bottom:13px;margin:2% 100px 2% 2%;background-color:red;padding-left:10px;padding-right:10px;left:150px;height:50px;font-size:23px;border-radius:5px}\n"}],"routeData":{"route":"/see-my-exercise","isIndex":false,"type":"page","pattern":"^\\/see-my-exercise\\/?$","segments":[[{"content":"see-my-exercise","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/see-my-exercise.astro","pathname":"/see-my-exercise","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"document.getElementById(\"signup-form\").addEventListener(\"submit\",function(e){const a=document.getElementById(\"email\").value,t=document.getElementById(\"password\").value,l=document.getElementById(\"confirm-password\").value,s=document.getElementById(\"name\").value;!a||!t||!l||!s?(alert(\"Please complete all fields\"),e.preventDefault()):/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$/.test(a)?t.length<6?(alert(\"Password must be at least 8 characters.\"),e.preventDefault()):t!==l&&(alert(\"Passwords do not match.\"),e.preventDefault()):(alert(\"Mail is not valid\"),e.preventDefault())});\n"}],"styles":[{"type":"external","src":"/_astro/create-exercise.C7VHxWlM.css"},{"type":"inline","content":".signup-section[data-astro-cid-eti64xk7]{display:flex;justify-content:center;align-items:center;height:100vh;background-color:#f8f9fa}.container[data-astro-cid-eti64xk7]{max-width:400px;width:100%;padding:20px;background-color:#fff;box-shadow:0 4px 8px #0000001a;border-radius:8px}.signup-box[data-astro-cid-eti64xk7]{text-align:center}.signup-header[data-astro-cid-eti64xk7] h1[data-astro-cid-eti64xk7]{margin-bottom:10px;font-size:24px}.signup-header[data-astro-cid-eti64xk7] p[data-astro-cid-eti64xk7]{margin-bottom:20px;color:#6c757d}.form-group[data-astro-cid-eti64xk7]{margin-bottom:15px;text-align:left}.form-control[data-astro-cid-eti64xk7]{width:100%;padding:10px;border:1px solid #ced4da;border-radius:4px;font-size:16px;color:#000}.form-control[data-astro-cid-eti64xk7]:focus{outline:none;border-color:#80bdff;box-shadow:0 0 0 .2rem #007bff40}.btn-submit[data-astro-cid-eti64xk7]{width:100%;padding:10px;background-color:#28a745;border:none;border-radius:4px;color:#fff;font-size:16px;cursor:pointer;transition:background-color .3s ease}.btn-submit[data-astro-cid-eti64xk7]:hover{background-color:#218838}label[data-astro-cid-eti64xk7]{font-size:16px;font-weight:500;color:#495057}.login-link[data-astro-cid-eti64xk7]{margin-top:20px}.login-link[data-astro-cid-eti64xk7] p[data-astro-cid-eti64xk7]{color:#6c757d}.login-link[data-astro-cid-eti64xk7] a[data-astro-cid-eti64xk7]{color:#007bff;text-decoration:none}.login-link[data-astro-cid-eti64xk7] a[data-astro-cid-eti64xk7]:hover{text-decoration:underline}\n"}],"routeData":{"route":"/sign-up","isIndex":false,"type":"page","pattern":"^\\/sign-up\\/?$","segments":[[{"content":"sign-up","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sign-up.astro","pathname":"/sign-up","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/create-exercise.C7VHxWlM.css"},{"type":"inline","content":"li[data-astro-cid-dohjnao5]{width:100%}.link-card[data-astro-cid-dohjnao5]{position:relative;list-style:none;display:flex;padding:1px;width:498px;background-color:#23262d;background-image:none;background-size:400%;top:-20px;border-bottom-left-radius:7px;border-bottom-right-radius:7px;background-position:100%;transition:background-position .6s cubic-bezier(.22,1,.36,1);box-shadow:inset 0 0 0 1px #ffffff1a}.link-card[data-astro-cid-dohjnao5]>a[data-astro-cid-dohjnao5]{width:100%;text-decoration:none;line-height:1.4;padding:calc(1.5rem - 1px);border-bottom-left-radius:7px;border-bottom-right-radius:7px;color:#fff;background-color:#23262d;opacity:.8}h2[data-astro-cid-dohjnao5]{margin:0;font-size:1.25rem;transition:color .6s cubic-bezier(.22,1,.36,1)}p[data-astro-cid-dohjnao5]{margin-top:.5rem;margin-bottom:0}.link-card[data-astro-cid-dohjnao5]:is(:hover,:focus-within){background-position:0;background-image:var(--accent-gradient)}.link-card[data-astro-cid-dohjnao5]:is(:hover,:focus-within) h2[data-astro-cid-dohjnao5]{color:rgb(var(--accent-light))}ul[data-astro-cid-j7pv25f6]{margin:auto;padding:1rem;width:900px;max-width:calc(100% - 2rem);color:#fff;font-size:20px;line-height:1.6;position:relative;right:370px;top:100px}.link-card-grid[data-astro-cid-j7pv25f6]{display:flex;padding:0}.imagen[data-astro-cid-j7pv25f6]{border-radius:12px;width:auto;height:500px}.a[data-astro-cid-j7pv25f6]:hover{-webkit-filter:brightness(115%)}.caja[data-astro-cid-j7pv25f6]{width:100%;height:310px}#caja2[data-astro-cid-j7pv25f6]{padding-left:70px;padding-right:70px}#imagen3[data-astro-cid-j7pv25f6]{position:relative;right:2px}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/create-exercise.astro",{"propagation":"none","containsHead":true}],["/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/demos.astro",{"propagation":"none","containsHead":true}],["/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/login.astro",{"propagation":"none","containsHead":true}],["/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/search-exercise.astro",{"propagation":"none","containsHead":true}],["/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/see-my-exercise.astro",{"propagation":"none","containsHead":true}],["/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/sign-up.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:node_modules/.pnpm/astro@4.11.5/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:node_modules/.pnpm/auth-astro@4.1.2_@auth+core@0.34.1_astro@4.11.5_next@14.2.4_@babel+core@7.24.7_react-dom@18.3_c3s6jkffai6pqwchvmcv5efogm/node_modules/auth-astro/src/api/[...auth]@_@ts":"pages/api/auth/_---auth_.astro.mjs","\u0000@astro-page:src/pages/create-exercise@_@astro":"pages/create-exercise.astro.mjs","\u0000@astro-page:src/pages/demos@_@astro":"pages/demos.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/search-exercise@_@astro":"pages/search-exercise.astro.mjs","\u0000@astro-page:src/pages/see-my-exercise@_@astro":"pages/see-my-exercise.astro.mjs","\u0000@astro-page:src/pages/sign-up@_@astro":"pages/sign-up.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/node_modules/.pnpm/astro@4.11.5/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","\u0000@astrojs-manifest":"manifest_EumJ19TP.mjs","/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/node_modules/.pnpm/@astrojs+react@3.6.0_@types+react-dom@18.3.0_@types+react@18.3.3_react-dom@18.3.1_react@18.3.1__react@18.3.1_vite@5.3.3/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_C1YIWAGb.mjs","/node_modules/.pnpm/astro@4.11.5/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/generic_BZ_vUAfa.mjs","/node_modules/.pnpm/auth-astro@4.1.2_@auth+core@0.34.1_astro@4.11.5_next@14.2.4_@babel+core@7.24.7_react-dom@18.3_c3s6jkffai6pqwchvmcv5efogm/node_modules/auth-astro/src/api/[...auth].ts":"chunks/_...auth__DiD8OSQl.mjs","/src/pages/create-exercise.astro":"chunks/create-exercise_Do9H2lq0.mjs","/src/pages/demos.astro":"chunks/demos_DuiybXDo.mjs","/src/pages/login.astro":"chunks/login_BBJrjmqX.mjs","/src/pages/search-exercise.astro":"chunks/search-exercise_jSyOppz9.mjs","/src/pages/see-my-exercise.astro":"chunks/see-my-exercise_v1aLw03k.mjs","/src/pages/sign-up.astro":"chunks/sign-up_I0SdBcAX.mjs","/src/pages/index.astro":"chunks/index_HbZw00UE.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.D6AgCAx7.js","/astro/hoisted.js?q=1":"_astro/hoisted.BW5-zNAp.js","/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/components/TrainingEquipmentSelector":"_astro/TrainingEquipmentSelector.DRGJhYJ6.js","/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/components/MusclesParent":"_astro/MusclesParent.BWeQs6JK.js","@astrojs/react/client.js":"_astro/client.BIGLHmRd.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/create-exercise.C7VHxWlM.css","/favicon.svg","/logo.png","/logo_transparent.png","/person-lifting-weight.jpeg","/person-question.jpeg","/person-with-pencil.jpeg","/_astro/MusclesParent.BWeQs6JK.js","/_astro/TrainingEquipmentSelector.DRGJhYJ6.js","/_astro/client.BIGLHmRd.js","/_astro/index.DhYZZe0J.js","/_astro/jsx-runtime.7faW4zRM.js"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false,"experimentalEnvGetSecretEnabled":false});

export { manifest };
