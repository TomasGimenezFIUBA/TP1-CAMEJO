import { l as createComponent, m as renderTemplate, n as maybeRenderHead, o as addAttribute, C as renderHead, q as renderComponent, v as renderSlot, p as createAstro } from './astro/server_CQA8kpKt.mjs';
/* empty css                                   */

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-3ef6ksr2> <div class="nav-container" data-astro-cid-3ef6ksr2> <nav data-astro-cid-3ef6ksr2> <ul data-astro-cid-3ef6ksr2> <li data-astro-cid-3ef6ksr2><a href="index.php" data-astro-cid-3ef6ksr2>Home</a></li> <li data-astro-cid-3ef6ksr2><a href="create.php" data-astro-cid-3ef6ksr2>Create</a></li> </ul> </nav> </div> <div class="logo-container" data-astro-cid-3ef6ksr2> <img src="/logo.png" alt="Gym Logo" class="logo" data-astro-cid-3ef6ksr2> </div> </header> `;
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer data-astro-cid-sz7xmlte> <div class="container" data-astro-cid-sz7xmlte> <div class="row" data-astro-cid-sz7xmlte> <div class="col-md-12" data-astro-cid-sz7xmlte> <p data-astro-cid-sz7xmlte>© 2024 <a href="http://www.technext.it" target="_blank" data-astro-cid-sz7xmlte>FIUBA - Introducción Al Desarrollo de Software</a> - Panaderos</p> </div> </div> </div> </footer> `;
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/components/Footer.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, {})} <div class="content"> <main> ${renderSlot($$result, $$slots["default"])} </main> </div> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
