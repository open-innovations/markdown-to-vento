import lume from "lume/mod.ts";
import base_path from "lume/plugins/base_path.ts";
import metas from "lume/plugins/metas.ts";
import postcss from "lume/plugins/postcss.ts";
import autoDependency from "https://deno.land/x/oi_lume_utils@v0.4.0/processors/auto-dependency.ts";

const site = lume({
    src: './src',
    location: new URL("https://open-innovations.org.github.io/markdown-to-vento")
    });

site.process([".html"], (pages) => pages.forEach(autoDependency));

site.use(base_path());

site.use(metas({
    defaultPageData: {
      title: 'title',
    },
  }));

site.use(postcss());

site.copy('.nojekyll');

site.copy('assets/js');

export default site;
