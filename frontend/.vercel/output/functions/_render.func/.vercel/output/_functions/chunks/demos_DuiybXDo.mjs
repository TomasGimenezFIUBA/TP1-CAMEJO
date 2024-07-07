/* empty css                                   */
import { l as createComponent, m as renderTemplate, q as renderComponent, n as maybeRenderHead } from './astro/server_CQA8kpKt.mjs';
import { $ as $$Layout } from './Layout_L43caCjt.mjs';

const $$Demos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "demos" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full h-full min-h-lvh"> <!-- 
            <MusclesGroupSelector> </MusclesGroupSelector>
        <MusclesGroupSelector selectedMuscles={["biceps"]} onMuscleChange={() => {}} client:only="react"></MusclesGroupSelector>
        --> ${renderComponent($$result2, "ParentComponent", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/components/MusclesParent", "client:component-export": "default" })} ${renderComponent($$result2, "TrainingEquipmentSelector", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/components/TrainingEquipmentSelector", "client:component-export": "default" })} </div> ` })} `;
}, "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/demos.astro", void 0);

const $$file = "/Users/vendor-tgimenez/Documents/Personales/fiuba/intro/GYM/TP1-CAMEJO/frontend/src/pages/demos.astro";
const $$url = "/demos";

export { $$Demos as default, $$file as file, $$url as url };
