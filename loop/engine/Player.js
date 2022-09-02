class Player {

    constructor() {
        //  this.load = new LoadingView("#222222"); //clase del editor dialogs/LoadingView
        //  document.body.appendChild(this.load.html);
        this.file = new File();

        (editor) ? this.onJsonLoaded(JSON.parse(localStorage.getItem("localStorage_GameData")) ): 
             this.file.loadJson(serverGamesFolder + "/loadJson.php?gameFolder=" + gameFolder, this) ;
    }

    onJsonLoaded(json) { // when json is loaded then load assets
        this.json = json;
        this.file.loadImages(serverGamesFolder + "/" + gameFolder, this.json, this);
    }

    onImagesLoaded(){
        this.file.loadSounds(serverGamesFolder + "/" + gameFolder, this.json, this);
    }

    onSoundsLoaded(){
        this.onAssetLoaded();
    }

    onAssetLoaded() {
    //  this.load.closeDialog(); //clase del editor dialogs/LoadingView
        new Engine(new Game(this.json));
    }
}