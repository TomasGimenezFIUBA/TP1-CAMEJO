/* empty css                                   */
import { l as createComponent, m as renderTemplate, q as renderComponent, n as maybeRenderHead } from './astro/server_CQA8kpKt.mjs';
import { $ as $$Layout } from './Layout_L43caCjt.mjs';
/* empty css                           */

const $$SignUp = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sign Up", "data-astro-cid-eti64xk7": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="signup-section" data-astro-cid-eti64xk7> <div class="container" data-astro-cid-eti64xk7> <div class="signup-box" data-astro-cid-eti64xk7> <div class="signup-header" data-astro-cid-eti64xk7> <h1 data-astro-cid-eti64xk7>Sign Up</h1> <p data-astro-cid-eti64xk7>Create an account and unlock all our features. Join us and enjoy an incredible and personalized experience!</p> </div> <form id="signup-form" action="/api/signup" method="post" data-astro-cid-eti64xk7> <div class="form-group" data-astro-cid-eti64xk7> <label for="name" data-astro-cid-eti64xk7>Name</label> <input type="text" class="form-control" id="name" name="name" placeholder="Enter name" required data-astro-cid-eti64xk7> </div> <div class="form-group" data-astro-cid-eti64xk7> <label for="email" data-astro-cid-eti64xk7>Email</label> <input type="email" class="form-control" id="email" name="email" placeholder="Enter email" required data-astro-cid-eti64xk7> </div> <div class="form-group" data-astro-cid-eti64xk7> <label for="password" data-astro-cid-eti64xk7>Password</label> <input type="password" class="form-control" id="password" name="password" placeholder="Password" required data-astro-cid-eti64xk7> </div> <div class="form-group" data-astro-cid-eti64xk7> <label for="confirm-password" data-astro-cid-eti64xk7>Confirm Password</label> <input type="password" class="form-control" id="confirm-password" name="confirm-password" placeholder="Password" required data-astro-cid-eti64xk7> </div> <button type="submit" class="btn-submit" data-astro-cid-eti64xk7>Sign Up</button> </form> <div class="login-link" data-astro-cid-eti64xk7> <p data-astro-cid-eti64xk7>Already have an account? <a href="/login" data-astro-cid-eti64xk7>Login here</a></p> </div> </div> </div> </section>  ` })} `;
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/sign-up.astro", void 0);

const $$file = "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/sign-up.astro";
const $$url = "/sign-up";

export { $$SignUp as default, $$file as file, $$url as url };