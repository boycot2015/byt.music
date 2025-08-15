import { defineAsyncComponent } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
export default {
    install(app, options) {
        const temp = {}
        const requireModules = import.meta.glob('../components/**/*.vue');
        for (const path in requireModules) {
            const result = path.match(/.*\/(.+)\.vue$/);
            const modulesContent = requireModules[path];
            temp[result[1]] = modulesContent;
            app.component(result[1], defineAsyncComponent(modulesContent));
        }
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            if (temp[key]) continue;
            app.component(key, component)
        }
    }
}