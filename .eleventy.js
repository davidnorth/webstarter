import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/inter/files": "fonts/inter",
  });
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  eleventyConfig.on("eleventy.before", async ({ dir }) => {
    const { bundle } = await import("lightningcss");
    const outDir = resolve(dir.output, "css");
    mkdirSync(outDir, { recursive: true });
    const { code } = bundle({
      filename: resolve("src/css/main.css"),
      minify: true,
      targets: { chrome: 111, firefox: 111, safari: 16 },
    });
    writeFileSync(resolve(outDir, "main.css"), code);
  });

  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/components/");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
  };
}
