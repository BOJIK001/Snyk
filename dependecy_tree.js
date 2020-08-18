const fetch = require('node-fetch');
const beautify = require("json-beautify");
var deps = new Map();

async function fetch_dependencies_tree(name, version)
{
    if (!deps.has(name  + "@" +  version)) {
        await build_dependencies_tree(name, version);
    }

    let dependencies = await fetch_dependencies(name, version);
    let dt = convert_deps_dependency_tree(name, version);
    let dl = convert_dep_list(dependencies);
    console.log(dt);
    if (JSON.stringify(dt) != JSON.stringify(dl)) {
        await build_dependencies_tree(name, version, true);
    }

    return deps.get(name  + "@" +  version);
}

async function fetch_dependencies(name, version)
{
    let url = `https://registry.npmjs.org/${ name }/${ version }`;
    let settings = { method: "Get" };
    
    const response = await fetch(url, settings);
    const data = await response.json();

    return data.dependencies;
}

async function build_dependencies_tree(name, version, force = false)
{
    // Check if we already have the dependencies tree
    if (deps.has(name  + "@" +  version) && !force) {
        return deps.get(name  + "@" +  version);
    }
    

    let data = await fetch_dependencies(name, version);

    let dep_name = `${name}@${version}`;
    let dt = {};

    // The full dependency tree for name@version packege
    dt[dep_name] = [];

    // Build up the dep. tree and save it in our map
    if (data  === undefined) {
        deps.set(dep_name, dt);
        return dt;
    }

    for(var package in data){
        
        if(!deps.has(package + "@" + data[package]))
        {
            await build_dependencies_tree(package,data[package]);
        }
        dt[dep_name].push(deps.get(package + "@" + data[package]));
    }
    deps.set(dep_name, dt);
}

function convert_dep_list(dependencies)
{
    let dt = {};
    for(var package in dependencies){
        dt[package] = dependencies[package];
    }
    
    return dt;
}

function convert_deps_dependency_tree(name, version)
{
    let data = deps.get(name + "@" + version);
    let dt = {};
    
    for(var package in data[name + "@" + version]){
        
        for(var dd in data[name + "@" + version][package])
            dt[dd.split("@")[0]] = dd.split("@")[1];
    }
    return dt;
}

module.exports = {
    fetch_dependencies_tree
  };