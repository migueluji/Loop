class Player {

    constructor(serverGamesFolder,gameFolder,json) {
        this.file = new File();
        this.data=json;
        this.serverGamesFolder=serverGamesFolder;
        this.gameFolder=gameFolder;

        this.load = new LoadingView("#222222"); //clase del editor dialogs/LoadingView
        document.body.appendChild(this.load.html);

        (json) ? this.file.loadAssets(serverGamesFolder+"/"+gameFolder+"/images",json.imageList,this) :
                 this.file.load(serverGamesFolder+"/loadJson.php?gameFolder="+gameFolder,this);
    }

    onFileLoaded(json) {
        this.data=json;
        this.file.loadAssets(this.serverGamesFolder+"/"+this.gameFolder+"/images",this.data.imageList,this);
    }

    onAssetLoaded(){
        //var debugParser = Util.parser({}, this.data);
        this.load.closeDialog(); //clase del editor dialogs/LoadingView
        this.engine = new Engine(new Game(this.data));
    }
}