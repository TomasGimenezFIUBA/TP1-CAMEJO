/* empty css                                   */
import { l as createComponent, m as renderTemplate, n as maybeRenderHead, o as addAttribute, p as createAstro, q as renderComponent } from './astro/server_CQA8kpKt.mjs';
import { $ as $$Layout } from './Layout_L43caCjt.mjs';
/* empty css                         */

const $$Astro = createAstro();
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Card;
  const { href, title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li class="link-card" data-astro-cid-dohjnao5> <a${addAttribute(href, "href")} data-astro-cid-dohjnao5> <h2 data-astro-cid-dohjnao5> ${title} <span data-astro-cid-dohjnao5>&rarr;</span> </h2> </a> </li> `;
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/components/Card.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "GYM", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<ul role="list" class="link-card-grid" data-astro-cid-j7pv25f6> <div class="caja" data-astro-cid-j7pv25f6> <a href="/create-exercise" class="a" data-astro-cid-j7pv25f6> <img src="/person-with-pencil.jpeg" class="imagen" data-astro-cid-j7pv25f6> </a> ${renderComponent($$result2, "Card", $$Card, { "href": "/create-exercise", "title": "CREATE EXERCISE", "data-astro-cid-j7pv25f6": true })} </div> <div class="caja" id="caja2" data-astro-cid-j7pv25f6> <a href="/see-my-exercise" class="a" data-astro-cid-j7pv25f6> <img src="/person-question.jpeg" class="imagen" data-astro-cid-j7pv25f6> </a> ${renderComponent($$result2, "Card", $$Card, { "href": "/see-my-exercise", "title": "SEE MY EXERCISES", "data-astro-cid-j7pv25f6": true })} </div> <div class="caja" data-astro-cid-j7pv25f6> <a href="/search-exercise" class="a" data-astro-cid-j7pv25f6> <img src="./person-lifting-weight.jpeg" class="imagen" id="imagen3" data-astro-cid-j7pv25f6> </a> ${renderComponent($$result2, "Card", $$Card, { "href": "/search-exercise", "title": "EXPLORE EXERCISES", "data-astro-cid-j7pv25f6": true })} </div> </ul> ` })} `;
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/index.astro", void 0);

const $$file = "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
