class App {
    constructor(serverGamesFolder,gameFolder,gameId){		
        this.file = new File();
        this.serverGamesFolder=serverGamesFolder;
        this.gameFolder = gameFolder;
        this.gameId = gameId;

        this.load = new LoadingView("var(--mdc-theme-primary)");
        document.body.appendChild(this.load.html);
        this.file.loadJson(this.serverGamesFolder+"/loadJson.php?gameFolder="+this.gameFolder,this);
    }
    
    onJsonLoaded(json){
        this.data=json;
        this.file.loadImages(this.serverGamesFolder+"/"+this.gameFolder,json,this);
    }

    onImagesLoaded(){
        this.onAssetLoaded();
    }

    onAssetLoaded(){
        var editor = new Editor(new EditorView(),new Game(this.data));
        new CmdManager(editor);
        document.body.appendChild(editor.view.html);
        this.load.closeDialog();
    }
}