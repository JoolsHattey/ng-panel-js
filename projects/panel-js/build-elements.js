projects.forEach(project => {
    const components = fs.readdirSync(`src/${project}`);
 
    components.forEach(component => compileComponent(project, component));
 });
 
 function compileComponent(project, component) {
    const buildJsFiles = `ng run elements:build:production --aot --main='projects/elements/src/${project}/${component}/compile.ts'`;
    const bundleIntoSingleFile = `cat dist/tmp/runtime.js dist/tmp/main.js > dist/tmp/my-${component}.js`;
    const copyBundledComponent = `cp dist/tmp/my-${component}.js dist/components/`;
 
    execSync(`${buildJsFiles} && ${bundleIntoSingleFile} && ${copyBundledComponent}`);
 }