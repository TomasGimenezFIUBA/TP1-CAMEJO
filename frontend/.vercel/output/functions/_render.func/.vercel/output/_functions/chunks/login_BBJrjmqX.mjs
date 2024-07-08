/* empty css                                   */
import { l as createComponent, m as renderTemplate, n as maybeRenderHead, q as renderComponent, p as createAstro, u as unescapeHTML, F as Fragment, t as defineScriptVars, v as renderSlot, s as spreadAttributes } from './astro/server_CQA8kpKt.mjs';
import { $ as $$Layout } from './Layout_L43caCjt.mjs';
import { g as getSession, a as authConfig } from './server_DuyaJzFT.mjs';
/* empty css                         */

const $$Astro$2 = createAstro();
const $$Auth = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Auth;
  const { authConfig: authConfig$1 = authConfig } = Astro2.props;
  let session = await getSession(Astro2.request, authConfig$1);
  return renderTemplate`${maybeRenderHead()}<div> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(Astro2.slots.render("default", [session]))}` })} </div>`;
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/node_modules/.pnpm/auth-astro@4.1.2_@auth+core@0.34.1_astro@4.11.5_next@14.2.4_@babel+core@7.24.7_react-dom@18.3_c3s6jkffai6pqwchvmcv5efogm/node_modules/auth-astro/src/components/Auth.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro();
const $$SignIn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SignIn;
  const key = Math.random().toString(36).slice(2, 11);
  const { provider, options, authParams, ...attrs } = Astro2.props;
  attrs.class = `signin-${key} ${attrs.class ?? ""}`;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", "<button", "> ", " </button>  <script>(function(){", "\n	document\n		.querySelector(`.signin-${key}`)\n		?.addEventListener('click', () => signIn(provider, options, authParams))\n})();<\/script>"], ["", "<button", "> ", " </button>  <script>(function(){", "\n	document\n		.querySelector(\\`.signin-\\${key}\\`)\n		?.addEventListener('click', () => signIn(provider, options, authParams))\n})();<\/script>"])), maybeRenderHead(), spreadAttributes(attrs), renderSlot($$result, $$slots["default"]), defineScriptVars({ provider, options, authParams, key }));
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/node_modules/.pnpm/auth-astro@4.1.2_@auth+core@0.34.1_astro@4.11.5_next@14.2.4_@babel+core@7.24.7_react-dom@18.3_c3s6jkffai6pqwchvmcv5efogm/node_modules/auth-astro/src/components/SignIn.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$SignOut = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SignOut;
  const key = Math.random().toString(36).slice(2, 11);
  const { params, ...attrs } = Astro2.props;
  attrs.class = `signout-${key} ${attrs.class ?? ""}`;
  return renderTemplate(_a || (_a = __template(["", "<button", "> ", " </button>  <script>(function(){", "\n	document.querySelector(`.signout-${key}`)?.addEventListener('click', () => signOut(params))\n})();<\/script>"], ["", "<button", "> ", " </button>  <script>(function(){", "\n	document.querySelector(\\`.signout-\\${key}\\`)?.addEventListener('click', () => signOut(params))\n})();<\/script>"])), maybeRenderHead(), spreadAttributes(attrs), renderSlot($$result, $$slots["default"]), defineScriptVars({ params, key }));
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/node_modules/.pnpm/auth-astro@4.1.2_@auth+core@0.34.1_astro@4.11.5_next@14.2.4_@babel+core@7.24.7_react-dom@18.3_c3s6jkffai6pqwchvmcv5efogm/node_modules/auth-astro/src/components/SignOut.astro", void 0);

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login", "data-astro-cid-sgpqyurt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="login-section" data-astro-cid-sgpqyurt> <div class="container" data-astro-cid-sgpqyurt> <div class="login-box" data-astro-cid-sgpqyurt> <div class="login-header" data-astro-cid-sgpqyurt> <h1 data-astro-cid-sgpqyurt>Login</h1> <p data-astro-cid-sgpqyurt>To continue using our features you must login.</p> </div> <form id="login-form" class="login-form" data-astro-cid-sgpqyurt> <div class="form-group" data-astro-cid-sgpqyurt> <label for="email" data-astro-cid-sgpqyurt>Email</label> <input type="email" class="form-control" id="email" placeholder="Enter email" data-astro-cid-sgpqyurt> </div> <div class="form-group" data-astro-cid-sgpqyurt> <label for="password" data-astro-cid-sgpqyurt>Password</label> <input type="password" class="form-control" id="password" placeholder="Password" data-astro-cid-sgpqyurt> </div> <button type="submit" class="btn-submit" data-astro-cid-sgpqyurt>Submit</button> </form> <ul class="providers" data-astro-cid-sgpqyurt> ${renderComponent($$result2, "SignIn", $$SignIn, { "provider": "google", "data-astro-cid-sgpqyurt": true }, { "default": ($$result3) => renderTemplate`Inicia sesion` })} </ul> <div class="register-link" data-astro-cid-sgpqyurt> <p data-astro-cid-sgpqyurt>First time? Click the link and <a href="/sign-up" data-astro-cid-sgpqyurt>Register here</a></p> </div> </div> </div> </section>  ` })} `;
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/login.astro", void 0);
const $$file = "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/login.astro";
const $$url = "/login";

export { $$Login as default, $$file as file, $$url as url };
