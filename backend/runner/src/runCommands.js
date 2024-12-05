
export const getRunCommand = (filepath)=>{
    console.log(filepath);
    
    const words = filepath.split(".");

    const language = words[words.length-1];
    const fileName = filepath.substring(1,filepath.length - language.length-1);
    let command = "";
    if(language === "js"){
        command = `node ${fileName}.js\n`
    }
    if(language === "java"){
        command = `javac ${fileName}.java && java ${fileName}\n`
    }
    if(language === "py"){
        command = `python ${fileName}.py\n`
    }
    

    return command;

}

