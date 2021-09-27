<!DOCTYPE HTML>

<html>
	<head>
		<style type="text/css">
			
			* {
				margin:0;
				padding:0;
			}

			html, body {
				width:100%;
				height:100%;
				background: #222222;
			}
 
			canvas {
				display:block; 
                position: absolute;
				top: 50%;
				left: 50%;
				transform: translateX(-50%) translateY(-50%);
			}

		</style>
	
		<title>Gamesonomy Engine</title>
		<span id="fps" style="display:flex;justify-content: center;align-items: center;color:white;font-size:36px;font-family:'Lato'">--</span>

	</head>
	
	<body>
		<link rel="stylesheet" type="text/css" href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"></link>
		<link rel="stylesheet" href="../editor/editor.css"></link>
		<script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
		<script src="libraries/math.js"></script>
		<script src="https://pixijs.download/release/pixi.min.js"></script>
		<script src="libraries/box2d.min.js"></script>
		<script src="libraries/howler.min.js"></script>

        <script src="Player.js"></script>
        <script src="../editor/File.js"></script>
		<script src="../editor/dialogs/LoadingView.js"></script>
		<script src="../editor/Utils.js"></script>
		<script src="Engine.js"></script>
		<script src="../editor/Game.js"></script>
		<script src="Scene.js"></script>
		<script src="Actor.js"></script>
		<script src="Script.js"></script>
		<script src="Node.js"></script>
   		<!--script src="Util.js"></script-->
        <script src="Physics.js"></script>
        <script src="Input.js"></script>
        <script src="Logic.js"></script>
        <script src="Audio.js"></script>
        <script src="Render.js"></script>
		<script src="If.js"></script>
		<script src="Do.js"></script>

		<script src="GameObject.js"></script>
		<script src="Container.js"></script>
		<script src="Sprite.js"></script>
		<script src="Text.js"></script>
		<script src="Rule.js"></script>

		<script>
		
			var serverGamesFolder="<?php echo $_POST['serverGamesFolder'];?>";
			var gameFolder="<?php echo $_POST['gameFolder'];?>";
			var editor=true; /* to kown if the engine has been launched from the editor */
			var json=null;

			if (editor) json=JSON.parse(localStorage.getItem("localStorage_GameData"));

			// requestAnimationFrame polyfill
			var  w=window, foundRequestAnimationFrame  =     w.requestAnimationFrame   ||
							w.webkitRequestAnimationFrame || w.msRequestAnimationFrame ||
							w.mozRequestAnimationFrame    || w.oRequestAnimationFrame  ||
							function(cb) { setTimeout(cb,1000/60); } ;
			window.requestAnimationFrame  = foundRequestAnimationFrame ;

			var player = new Player(serverGamesFolder,gameFolder,json);

		</script>

	</body>

</html>