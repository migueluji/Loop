class Player {

    constructor(serverGamesFolder, gameFolder, json) {
        this.file = new File();
        this.data = json;
        this.serverGamesFolder = serverGamesFolder;
        this.gameFolder = gameFolder;

        //  this.load = new LoadingView("#222222"); //clase del editor dialogs/LoadingView
        //  document.body.appendChild(this.load.html);

        //  if json = null then load json else load assets
        (!json) ? this.file.loadJson(serverGamesFolder + "/loadJson.php?gameFolder=" + gameFolder, this) :
        this.file.loadImages(serverGamesFolder + "/" + gameFolder, json, this) ; // start loading images
    }

    onJsonLoaded(json) { // when json is loaded then load assets
        this.data = json;
        this.file.loadImages(this.serverGamesFolder + "/" + this.gameFolder, this.data, this);
    }

    onImagesLoaded(){
        this.file.loadSounds(this.serverGamesFolder + "/" + this.gameFolder, this.data, this);
    }

    onSoundsLoaded(){
        this.onAssetLoaded();
    }

    onAssetLoaded() {
    //  this.load.closeDialog(); //clase del editor dialogs/LoadingView
        new Engine(new Game(this.data));
    }
}