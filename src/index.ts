import type * as Ts from "typescript/lib/tsserverlibrary";

function init({typescript: ts} : { typescript: typeof Ts }) {
    function create(info:  Ts.server.PluginCreateInfo) {
      // Diagnostic logging
      info.project.projectService.logger.info("Loading our ts-server plugin POC");
  
      // Set up decorator object
      const proxy: Ts.LanguageService = Object.create(null);
      for (const k of Object.keys(info.languageService) as Array<keyof Ts.LanguageService>) {
        const x = info.languageService[k];
        // @ts-expect-error - JS runtime trickery which is tricky to type tersely
        proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
      }
  
      info.languageService.getProgram()?.getGlobalDiagnostics()
      // printing options
      let interceptions = "\n";
      for (const k of Object.keys(info.languageService) as Array<keyof Ts.LanguageService>) {
        const funcValue = info.languageService[k];
        if (funcValue === undefined) continue;
        const fullImpl = funcValue.toString();
        interceptions += `- func ${k}: ${fullImpl.substring(0, fullImpl.indexOf('{')).trim()}\n`;
      }
      info.project.projectService.logger.info(`ts-server plugin POC has the following interception points:${interceptions}`);
      return proxy;
    }
  
    return { create };
  }
  
  export = init;

