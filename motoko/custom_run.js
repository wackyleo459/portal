console.log("custom run has been called as client module?");

export function loadBase() {
  async function addPackage(name, repo, version, dir) {
    const meta_url =
      "https://data.jsdelivr.com/v1/package/gh/dfinity/motoko-base@moc-0.6.27/flat";
    const base_url =
      "https://cdn.jsdelivr.net/gh//dfinity/motoko-base@moc-0.6.27";
    const response = await fetch(meta_url);
    const json = await response.json();
    const promises = [];
    const fetchedFiles = [];
    for (const f of json.files) {
      if (f.name.startsWith("/src/") && /\.mo$/.test(f.name)) {
        const promise = (async () => {
          const content = await (await fetch(base_url + f.name)).text();
          const stripped = name + f.name.slice(dir.length + 1);
          fetchedFiles.push(stripped);
          Motoko.saveFile(stripped, content);
        })();
        promises.push(promise);
      }
    }
    Promise.all(promises).then(() => {
      Motoko.addPackage(name, name + "/");
      console.log("Loaded motoko library base");
      changeCodeBlock(); // from run_repl.js
    });
  }
  addPackage("base", "dfinity/motoko-base", "Nat", "src");
}

export function onRouteDidUpdate({ location, previousLocation }) {
  console.log("current_location", location);
  console.log("previous_location", previousLocation);
  if (location.pathname !== previousLocation?.pathname) {
    console.log("onRouteDidUpdate called");
    if (document.getElementsByClassName("language-motoko").length > 0) {
      console.log("onRouteDidUpdate motoko code is here, so onLoad called");
      loadBase();
    } else {
      console.log("no motoko code, no onLoad called");
    }
  }
}
